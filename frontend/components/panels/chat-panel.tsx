"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Bot, User, AlertCircle, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { usePaperStore } from "@/store/usePaperStore";
import { toast } from "sonner";
import ReactMarkdown from 'react-markdown';

export default function ChatPanel() {
    const { activeFileId, papers, chatMessages, setChatMessages } = usePaperStore();
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const activePaper = papers.find(p => p.file_id === activeFileId);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatMessages, isLoading]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;
        if (!activeFileId) {
            toast.error("Please select a paper from the Upload tab first.");
            return;
        }

        const userMsg = input.trim();
        setInput("");
        setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);

        setIsLoading(true);
        try {
            const response = await api.chatWithDocument(activeFileId, userMsg);
            setChatMessages((prev) => [...prev, { role: "assistant", content: response.answer }]);
        } catch (error) {
            toast.error("Cloud connection error. Make sure the backend is running.");
            setChatMessages((prev) => [...prev, { role: "assistant", content: "I'm having trouble reaching the research engine. Please try again in a moment." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full max-w-5xl mx-auto h-[max(500px,calc(100vh-18rem))]">
            <div className="mb-4 flex-shrink-0 hidden">
                <h1 className="text-2xl font-bold tracking-tight mb-1">Research Chat</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                    Ask questions about your uploaded papers
                    {activeFileId && <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-[10px] font-mono border border-primary/30">Active: {activePaper?.filename}</span>}
                </p>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto rounded-t-2xl border-t border-l border-r border-border/40 bg-card/30 p-6 backdrop-blur-sm space-y-6 flex flex-col min-h-0 relative"
            >
                {/* Clear Chat Button */}
                {chatMessages.length > 0 && (
                    <div className="sticky top-0 z-10 flex justify-end mb-4 -mx-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setChatMessages([])}
                            className="bg-background/80 hover:bg-secondary/80 hover:text-foreground backdrop-blur-md border border-border/40 text-muted-foreground shadow-sm h-8 px-3 text-xs transition-all rounded-lg"
                        >
                            <RefreshCcw className="h-3 w-3 mr-1.5" />
                            Clear Chat
                        </Button>
                    </div>
                )}
                {chatMessages.length === 0 && (
                    <div className="m-auto text-center opacity-50 flex flex-col items-center">
                        <Bot className="h-12 w-12 mb-4" />
                        <p>Start a conversation about your document.</p>
                    </div>
                )}
                <AnimatePresence initial={false}>
                    {chatMessages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex items-start gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                        >
                            <div className={`h-8 w-8 shrink-0 rounded-lg flex items-center justify-center
                     ${msg.role === "user" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"}`}
                            >
                                {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                            </div>
                            <div className={`px-5 py-4 max-w-[85%] text-sm leading-relaxed shadow-sm
                     ${msg.role === "user"
                                    ? "bg-primary/10 text-foreground rounded-2xl rounded-tr-sm"
                                    : "bg-secondary/50 text-foreground rounded-2xl rounded-tl-sm border border-border/40"
                                }`}>
                                {msg.role === "assistant" ? (
                                    <div className="prose prose-invert max-w-none text-sm leading-relaxed prose-p:leading-relaxed prose-p:my-2 prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-ul:my-2 prose-li:my-0.5 prose-strong:text-accent font-sans">
                                        <ReactMarkdown>
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    <span className="whitespace-pre-wrap">{msg.content}</span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-4">
                        <div className="h-8 w-8 shrink-0 rounded-lg bg-accent/20 text-accent flex items-center justify-center">
                            <Bot className="h-4 w-4" />
                        </div>
                        <div className="px-4 py-3 bg-secondary/50 rounded-2xl rounded-tl-sm border border-border/40 flex items-center gap-1.5 shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="h-2 w-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="h-2 w-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="flex-shrink-0 relative">
                <div className="absolute left-4 top-1/2 -translate-y-[calc(50%+2px)] h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center pointer-events-none">
                    <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about the methodology, results, or specific concepts..."
                    className="w-full pl-14 pr-16 h-16 bg-card border-border/40 backdrop-blur-sm shadow-md rounded-b-2xl rounded-t-none text-sm focus-visible:ring-primary/50 relative z-10"
                />
                <Button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/25 transition-transform active:scale-95 z-20"
                >
                    <Send className="h-4 w-4 ml-0.5" />
                </Button>
            </form>
        </div>
    );
}
