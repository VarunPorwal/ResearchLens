"use client";

import { useState, useEffect } from "react";
import { FileText, ChevronRight, BookOpen, Beaker, ArrowUpRight, AlertTriangle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { usePaperStore } from "@/store/usePaperStore";
import { toast } from "sonner";

interface SummaryData {
    title: string;
    objective: string;
    methodology: {
        approach: string;
        tools: string[];
    };
    key_findings: Array<{
        finding: string;
        evidence: string;
    }>;
    conclusion: string;
    _error?: boolean;
}
export default function SummaryPanel() {
    const { activeFileId, papers, summaries, isFetchingSummaries, fetchSummary } = usePaperStore();

    const summary = activeFileId ? summaries[activeFileId] : null;
    const isLoading = activeFileId ? (isFetchingSummaries[activeFileId] && !summary) : false;

    if (!activeFileId) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
                <div className="h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6">
                    <FileText className="h-8 w-8 text-primary/40" />
                </div>
                <h2 className="text-xl font-bold mb-2">No Paper Selected</h2>
                <p className="text-muted-foreground text-sm max-w-sm">
                    Select a research paper from the Upload tab to generate an AI-powered structured summary.
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground text-sm font-medium">Generating Intelligence Summary...</p>
            </div>
        );
    }

    if (summary?._error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
                <AlertTriangle className="h-12 w-12 text-destructive/80 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Summary Generation Failed</h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-sm">
                    The AI was unable to generate a structured summary for this document. It may be too short or formatted irregularly.
                </p>
                <button
                    onClick={() => {
                        usePaperStore.setState((state) => ({
                            summaries: { ...state.summaries, [activeFileId!]: undefined }
                        }));
                    }}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 text-sm transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!summary) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
                <div className="h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6">
                    <FileText className="h-8 w-8 text-primary/40" />
                </div>
                <h2 className="text-xl font-bold mb-2">Ready to Summarize</h2>
                <p className="text-muted-foreground text-sm max-w-sm mb-6">
                    Click the button below to generate a comprehensive AI summary of this paper.
                </p>
                <button
                    onClick={() => fetchSummary(activeFileId)}
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                    Generate AI Summary
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto w-full pb-20">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight mb-1 text-foreground">Paper Summary</h1>
                <p className="text-sm text-muted-foreground text-pretty">AI-generated structured overview of {summary.title}</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden shadow-lg shadow-black/5"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-border/40 bg-secondary/10">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground leading-tight tracking-tight">{summary.title}</h2>
                            <p className="text-xs text-muted-foreground mt-0.5"><span className="font-semibold text-primary/80">Objective:</span> {summary.objective}</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="grid sm:grid-cols-2 gap-3 p-5">
                    {/* Conclusion */}
                    <div className="rounded-xl bg-secondary/30 p-4 border border-border/20 group">
                        <div className="flex items-center gap-2 mb-2 font-medium text-xs text-primary">
                            <BookOpen className="h-3.5 w-3.5" /> Conclusion
                        </div>
                        <p className="text-xs leading-relaxed text-muted-foreground">{summary.conclusion}</p>
                    </div>

                    {/* Methodology */}
                    <div className="rounded-xl bg-secondary/30 p-4 border border-border/20 group">
                        <div className="flex items-center gap-2 mb-2 font-medium text-xs text-accent">
                            <Beaker className="h-3.5 w-3.5" /> Methodology
                        </div>
                        <p className="text-xs leading-relaxed text-muted-foreground mb-3">{summary.methodology?.approach}</p>
                        {summary.methodology?.tools?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {summary.methodology.tools.map((t: string, i: number) => (
                                    <span key={i} className="px-2 py-0.5 bg-accent/10 text-accent rounded-md text-[10px] font-medium border border-accent/20">{t}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Key Findings */}
                    <div className="rounded-xl bg-secondary/30 p-4 border border-border/20 group">
                        <div className="flex items-center gap-2 mb-3 font-medium text-xs text-[#32D583]">
                            <ArrowUpRight className="h-3.5 w-3.5" /> Key Findings
                        </div>
                        <ul className="space-y-4">
                            {summary.key_findings?.map((kf: any, i: number) => (
                                <li key={i} className="text-xs leading-relaxed text-muted-foreground border-l-2 border-[#32D583]/30 pl-3">
                                    <span className="font-semibold text-foreground block mb-1">{kf.finding}</span>
                                    <span className="italic opacity-80 inline-block">"{kf.evidence}"</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}
