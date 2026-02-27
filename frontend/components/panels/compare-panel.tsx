"use client";

import { useState, useEffect } from "react";
import { GitCompareArrows, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { usePaperStore } from "@/store/usePaperStore";
import { toast } from "sonner";

export default function ComparePanel() {
    const { papers, comparePaperIds, setComparePaperIds } = usePaperStore();
    const [comparison, setComparison] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (comparePaperIds.length === 2) {
            handleCompare();
        } else {
            setComparison(null);
        }
    }, [comparePaperIds]);

    const handleCompare = async () => {
        setIsLoading(true);
        try {
            const data = await api.comparePapers(comparePaperIds);
            setComparison(data.comparison);
        } catch (error) {
            toast.error("Failed to compare papers");
        } finally {
            setIsLoading(false);
        }
    };

    const togglePaper = (id: string) => {
        setComparePaperIds(
            comparePaperIds.includes(id)
                ? comparePaperIds.filter((p: string) => p !== id)
                : [...comparePaperIds, id].slice(-2)
        );
    };

    if (papers.length < 2) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
                <div className="h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6">
                    < GitCompareArrows className="h-8 w-8 text-primary/40" />
                </div>
                <h2 className="text-xl font-bold mb-2">Insufficient Documents</h2>
                <p className="text-muted-foreground text-sm max-w-sm">
                    Upload at least two research papers to enable side-by-side architectural and metric comparison.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto w-full pb-20">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
                    <GitCompareArrows className="h-6 w-6 text-primary" />
                    Paper Comparison
                </h1>
                <p className="text-sm text-muted-foreground">Select two papers to analyze contrasts and similarities</p>
            </div>

            {/* Selection Area */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {papers.map(p => (
                    <div
                        key={p.file_id}
                        onClick={() => togglePaper(p.file_id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all text-xs font-medium flex items-center justify-between
                            ${comparePaperIds.includes(p.file_id)
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border/40 bg-card/50 hover:border-primary/30"}`}
                    >
                        <span className="truncate mr-2">{p.filename}</span>
                        {comparePaperIds.includes(p.file_id) && <CheckCircle2 className="h-3 w-3 shrink-0" />}
                    </div>
                ))}
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                    <p className="text-sm text-muted-foreground">Synthesizing Comparative Intelligence...</p>
                </div>
            ) : comparison ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden mb-6 shadow-lg shadow-black/5">
                        <div className="h-12 border-b border-border/40 bg-secondary/30 flex items-center px-6 text-xs font-bold text-muted-foreground">
                            <div className="w-[30%]">METRIC</div>
                            <div className="w-[35%] px-4 text-primary">PAPER 1</div>
                            <div className="w-[35%] px-4 text-accent border-l border-border/20">PAPER 2</div>
                        </div>
                        <div className="divide-y divide-border/20">
                            {comparison.metrics?.map((row: any, idx: number) => (
                                <div key={idx} className="flex items-center px-6 py-4 hover:bg-secondary/10 transition-colors">
                                    <div className="w-[30%] text-xs font-bold text-muted-foreground uppercase tracking-wider">{row.metric}</div>
                                    <div className="w-[35%] text-xs text-foreground px-4 leading-relaxed">{row.val1}</div>
                                    <div className="w-[35%] text-xs text-foreground px-4 border-l border-border/10 leading-relaxed">{row.val2}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                            <h3 className="text-xs font-bold text-primary mb-4 uppercase tracking-widest">Key Contrasts</h3>
                            <ul className="space-y-3">
                                {comparison.contrasts?.map((s: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <AlertCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                                        <span className="text-xs text-muted-foreground leading-relaxed">{s}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
                            <h3 className="text-xs font-bold text-accent mb-4 uppercase tracking-widest">Synergies</h3>
                            <ul className="space-y-3">
                                {comparison.synergies?.map((s: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                                        <span className="text-xs text-muted-foreground leading-relaxed">{s}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <div className="text-center py-20 border-2 border-dashed border-border/40 rounded-3xl bg-card/20">
                    <p className="text-sm text-muted-foreground">Select two papers above to begin comparison</p>
                </div>
            )}
        </div>
    );
}
