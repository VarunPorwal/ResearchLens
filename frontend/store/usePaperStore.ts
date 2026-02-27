import { create } from 'zustand';
import { api } from '@/lib/api';

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface PaperStore {
    activeFileId: string | null;
    setActiveFileId: (id: string | null) => void;
    papers: any[];
    setPapers: (papers: any[]) => void;

    // Chat State
    chatMessages: Message[];
    setChatMessages: (args: Message[] | ((prev: Message[]) => Message[])) => void;

    // Compare UI State
    comparePaperIds: string[];
    setComparePaperIds: (ids: string[]) => void;

    // Pre-fetched Data Caches
    summaries: Record<string, any>;
    metrics: Record<string, any>;
    isFetchingSummaries: Record<string, boolean>;
    isFetchingMetrics: Record<string, boolean>;
    fetchSummary: (id: string) => Promise<void>;
    prefetchFileData: (id: string) => Promise<void>;
}

export const usePaperStore = create<PaperStore>((set, get) => ({
    activeFileId: null,

    setActiveFileId: (id) => {
        set({ activeFileId: id });
        if (id) {
            get().prefetchFileData(id);
        }
    },

    papers: [],
    setPapers: (papers) => set({ papers }),

    chatMessages: [],
    setChatMessages: (args) => set((state) => ({
        chatMessages: typeof args === 'function' ? args(state.chatMessages) : args
    })),

    comparePaperIds: [],
    setComparePaperIds: (ids) => set({ comparePaperIds: ids }),

    summaries: {},
    metrics: {},
    isFetchingSummaries: {},
    isFetchingMetrics: {},

    fetchSummary: async (id: string) => {
        const state = get();
        if (state.summaries[id] || state.isFetchingSummaries[id]) return;

        set((s) => ({ isFetchingSummaries: { ...s.isFetchingSummaries, [id]: true } }));
        try {
            const data = await api.getSummary(id);
            set((s) => ({ summaries: { ...s.summaries, [id]: data.summary } }));
        } catch (err) {
            console.error("Summary fetch error:", err);
            set((s) => ({ summaries: { ...s.summaries, [id]: { _error: true } } }));
        } finally {
            set((s) => ({ isFetchingSummaries: { ...s.isFetchingSummaries, [id]: false } }));
        }
    },

    prefetchFileData: async (id: string) => {
        const state = get();

        // Fetch Metrics independently
        if (!state.metrics[id] && !state.isFetchingMetrics[id]) {
            set((s) => ({ isFetchingMetrics: { ...s.isFetchingMetrics, [id]: true } }));
            api.extractMetrics(id).then(data => {
                set((s) => ({ metrics: { ...s.metrics, [id]: data.metrics } }));
            }).catch((err) => {
                console.error("Metrics prefetch error:", err);
                set((s) => ({ metrics: { ...s.metrics, [id]: { _error: true } } }));
            }).finally(() => {
                set((s) => ({ isFetchingMetrics: { ...s.isFetchingMetrics, [id]: false } }));
            });
        }
    },
}));
