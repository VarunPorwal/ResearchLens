"use client";

import { useState, useEffect } from "react";
import {
    BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts";
import { FileText, BarChart3, TrendingUp, Clock, Loader2, Info } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { usePaperStore } from "@/store/usePaperStore";

const tooltipStyle = {
    backgroundColor: "rgba(15,15,30,0.95)",
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "12px",
    padding: "8px 12px"
};

export default function AnalyticsPanel() {
    const { activeFileId, papers, metrics, isFetchingMetrics, prefetchFileData } = usePaperStore();

    // Fallback trigger just in case it wasn't prefetched
    useEffect(() => {
        if (activeFileId && !metrics[activeFileId] && !isFetchingMetrics[activeFileId]) {
            prefetchFileData(activeFileId);
        }
    }, [activeFileId, metrics, isFetchingMetrics, prefetchFileData]);

    const currentMetrics = activeFileId ? metrics[activeFileId] : null;
    const isLoading = activeFileId ? (isFetchingMetrics[activeFileId] && !currentMetrics) : false;

    if (!activeFileId) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
                <div className="h-16 w-16 rounded-2xl bg-accent/5 flex items-center justify-center mb-6">
                    <BarChart3 className="h-8 w-8 text-accent/40" />
                </div>
                <h2 className="text-xl font-bold mb-2">Metrics Unavailable</h2>
                <p className="text-muted-foreground text-sm max-w-sm">
                    Select a paper to extract and visualize advanced research metrics, model performance, and trend data.
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <Loader2 className="h-10 w-10 animate-spin text-accent mb-4" />
                <p className="text-muted-foreground text-sm font-medium">Extracting Analytical Data...</p>
            </div>
        );
    }

    if (currentMetrics?._error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
                <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
                    <Info className="h-8 w-8 text-destructive/80" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Metrics Extraction Failed</h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-sm">
                    The AI was unable to parse quantitative metrics or analytical data from this document. It may not contain tabular or numeric data.
                </p>
                <button
                    onClick={() => {
                        usePaperStore.setState((state) => ({
                            metrics: { ...state.metrics, [activeFileId!]: undefined }
                        }));
                    }}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 text-sm transition-colors"
                >
                    Retry Extraction
                </button>
            </div>
        );
    }

    // Default mock data for visualization if metrics are empty or in processing
    const barData = metrics?.performance || [
        { name: "Accuracy", value: 92 },
        { name: "F1 Score", value: 89 },
        { name: "Precision", value: 91 },
        { name: "Recall", value: 88 }
    ];

    const radarData = metrics?.dimensions || [
        { metric: "Speed", value: 85 },
        { metric: "Memory", value: 70 },
        { metric: "Scalability", value: 90 },
        { metric: "Interpretability", value: 65 },
        { metric: "Robustness", value: 80 }
    ];

    return (
        <div className="max-w-5xl mx-auto w-full pb-20">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight mb-1 text-foreground">Analytics Dashboard</h1>
                <p className="text-sm text-muted-foreground">Deep data insights for {papers.find(p => p.file_id === activeFileId)?.filename}</p>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                {/* Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="rounded-2xl border border-border/40 bg-card/50 p-4 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-2xl font-bold text-foreground">{metrics?.stat_papers || "1"}</div>
                        <div className="text-xs font-medium text-muted-foreground mt-1">Active Paper</div>
                    </div>

                    <div className="rounded-2xl border border-border/40 bg-card/50 p-4 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-2xl font-bold text-foreground">{metrics?.stat_metrics || "12"}</div>
                        <div className="text-xs font-medium text-muted-foreground mt-1">Metrics Tracked</div>
                    </div>

                    <div className="rounded-2xl border border-border/40 bg-card/50 p-4 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-2xl font-bold text-foreground">{metrics?.stat_insights || "8"}</div>
                        <div className="text-xs font-medium text-muted-foreground mt-1">AI Insights</div>
                    </div>

                    <div className="rounded-2xl border border-border/40 bg-card/50 p-4 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-2xl font-bold text-foreground">{metrics?.stat_confidence || "96%"}</div>
                        <div className="text-xs font-medium text-muted-foreground mt-1">Extraction Confidence</div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                    <div className="rounded-2xl border border-border/40 bg-card/50 p-5 backdrop-blur-sm h-[400px] flex flex-col">
                        <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
                            Performance Profile <Info className="h-3 w-3 text-muted-foreground" />
                        </h3>
                        <div className="flex-1 w-full relative pt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.22 0.01 270 / 0.05)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'oklch(0.65 0.02 270 / 0.4)' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'oklch(0.65 0.02 270 / 0.4)' }} />
                                    <Tooltip cursor={{ fill: 'oklch(0.22 0.01 270 / 0.2)' }} contentStyle={tooltipStyle} />
                                    <Bar dataKey="value" name="Metric Value" fill="oklch(0.65 0.25 265)" radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border/40 bg-card/50 p-5 backdrop-blur-sm h-[400px] flex flex-col">
                        <h3 className="text-sm font-semibold mb-1">Architecture Dimensions</h3>
                        <div className="flex-1 w-full relative pt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                    <PolarGrid stroke="oklch(0.22 0.01 270 / 0.08)" />
                                    <PolarAngleAxis dataKey="metric" tick={{ fill: 'oklch(0.65 0.02 270)', fontSize: 11 }} />
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Radar name="Score" dataKey="value" stroke="oklch(0.55 0.20 180)" fill="oklch(0.55 0.20 180)" fillOpacity={0.15} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-border/40 bg-card/50 p-6 backdrop-blur-sm">
                    <h3 className="text-sm font-semibold mb-4">Paper Specific Insights</h3>
                    <div className="space-y-3">
                        {metrics?.insights?.map((insight: string, i: number) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/20 border border-border/20 text-xs text-muted-foreground leading-relaxed">
                                <div className="h-5 w-5 rounded-md bg-accent/20 flex items-center justify-center shrink-0">
                                    <TrendingUp className="h-3 w-3 text-accent" />
                                </div>
                                {insight}
                            </div>
                        )) || (
                                <div className="text-center py-6 text-xs text-muted-foreground italic">
                                    No specific quantitative insights identified in this document yet.
                                </div>
                            )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
