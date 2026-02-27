import axios from 'axios';
import { supabase } from './supabase';

const isBrowser = typeof window !== 'undefined';
const API_BASE_URL = isBrowser
    ? '/api-proxy'
    : (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api');

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach Supabase Session Token to all requests
apiClient.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
});

export const api = {
    // Papers
    listPapers: async () => {
        const res = await apiClient.get('/papers');
        return res.data;
    },

    deletePaper: async (fileId: string) => {
        const res = await apiClient.delete(`/papers/${fileId}`);
        return res.data;
    },

    // Ingestion
    ingestPdf: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await apiClient.post('/ingest', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    },

    // Chat
    chatWithDocument: async (fileId: string, query: string) => {
        const res = await apiClient.post('/chat', { file_id: fileId, query });
        return res.data;
    },

    // Summarize
    getSummary: async (fileId: string) => {
        const res = await apiClient.post('/summarize', { file_id: fileId });
        return res.data;
    },

    // Compare
    comparePapers: async (fileIds: string[], query?: string) => {
        const res = await apiClient.post('/compare', { file_ids: fileIds, query });
        return res.data;
    },

    // Metrics
    extractMetrics: async (fileId: string) => {
        const res = await apiClient.post('/metrics', { file_id: fileId });
        return res.data;
    }
};
