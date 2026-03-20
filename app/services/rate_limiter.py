import time
import threading
from typing import Deque, Tuple
from collections import deque

class RateLimiter:
    def __init__(self, max_requests_per_minute: int, max_tokens_per_minute: int, max_requests_per_day: int = 1000):
        self.max_rpm = max_requests_per_minute
        self.max_tpm = max_tokens_per_minute
        self.max_rpd = max_requests_per_day
        
        # Deque of (timestamp, estimated_tokens)
        self.history: Deque[Tuple[float, int]] = deque()
        self.lock = threading.Lock()
        
    def _cleanup(self, now: float):
        """Removes entries older than 24 hours."""
        cutoff_24h = now - (24 * 60 * 60)
        while self.history and self.history[0][0] < cutoff_24h:
            self.history.popleft()
            
    def wait_if_needed(self, estimated_tokens: int = 0):
        """
        Blocks until there is enough capacity (RPM, TPM, and RPD) 
        to make the request. Calculates sleep time dynamically.
        """
        while True:
            sleep_time = 0.0
            with self.lock:
                now = time.time()
                self._cleanup(now)
                
                # Check 24-hour request limit
                if len(self.history) >= self.max_rpd:
                    # Very long sleep, practically rejected for the day unless server restarts
                    sleep_time = self.history[0][0] + (24 * 60 * 60) - now
                    # We bound it to a very large number instead of infinite
                    sleep_time = max(0.1, sleep_time)
                else:
                    # Check 1-minute limits
                    cutoff_1m = now - 60.0
                    recent_history = [entry for entry in self.history if entry[0] >= cutoff_1m]
                    
                    current_rpm = len(recent_history)
                    current_tpm = sum(tokens for _, tokens in recent_history)
                    
                    can_proceed_rpm = current_rpm < self.max_rpm
                    can_proceed_tpm = (current_tpm + estimated_tokens) <= self.max_tpm
                    
                    if can_proceed_rpm and can_proceed_tpm:
                        self.history.append((now, estimated_tokens))
                        return
                    
                    if recent_history:
                        sleep_time = max(0.1, recent_history[0][0] + 60.0 - now)
                    else:
                        if estimated_tokens > self.max_tpm:
                            self.history.append((now, self.max_tpm))
                            return
                        sleep_time = 1.0
            
            if sleep_time > 0:
                time.sleep(sleep_time)

# Global rate limiter instance. 
# 95 RPM (comfortably under 100 limit)
# 29,500 TPM (comfortably under 30,000 limit)
# 950 RPD (comfortably under 1000 daily limit)
api_rate_limiter = RateLimiter(
    max_requests_per_minute=95, 
    max_tokens_per_minute=29500,
    max_requests_per_day=950
)
