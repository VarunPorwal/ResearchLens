"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { usePaperStore } from "@/store/usePaperStore";
import { toast } from "sonner";

export default function UploadPanel() {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoadingPapers, setIsLoadingPapers] = useState(true);

    const { papers, setPapers, activeFileId, setActiveFileId } = usePaperStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchPapers();
    }, []);

    const fetchPapers = async () => {
        try {
            setIsLoadingPapers(true);
            const data = await api.listPapers();
            setPapers(data.papers || []);
        } catch (error) {
            toast.error("Failed to load papers. Check backend connection.");
        } finally {
            setIsLoadingPapers(false);
        }
    };

    const handleFile = async (file: File) => {
        if (file.type !== "application/pdf") {
            toast.error("Only PDF files are supported");
            return;
        }

        setIsUploading(true);
        const loadingToast = toast.loading(`Uploading ${file.name}...`);

        try {
            const result = await api.ingestPdf(file);
            toast.success("Paper processed and indexed successfully!", { id: loadingToast });
            fetchPapers(); // Refresh list
            setActiveFileId(result.file_id); // Auto select new file
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.detail || "Failed to process PDF", { id: loadingToast });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (fileId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await api.deletePaper(fileId);
            toast.success("Paper deleted");
            if (activeFileId === fileId) setActiveFileId(null);
            fetchPapers();
        } catch (error) {
            toast.error("Failed to delete paper");
        }
    };

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight mb-1 text-foreground">Upload Papers</h1>
                <p className="text-sm text-muted-foreground">Upload research PDFs for AI analysis</p>
            </div>

            {/* Upload Dropzone */}
            <div className="mb-8">
                <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                <div
                    className={`rounded-2xl border-2 border-dashed bg-card/50 p-12 flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-sm
            ${isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border/60 hover:border-primary/30 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5"}
          `}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleFile(file);
                    }}
                >
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                        {isUploading ? (
                            <Loader2 className="h-6 w-6 text-primary animate-spin" />
                        ) : (
                            <Upload className="h-6 w-6 text-primary" />
                        )}
                    </div>
                    <h3 className="text-base font-semibold mb-1 text-foreground">
                        {isUploading ? "Processing Document..." : "Drag and drop your PDFs here"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                        or click to browse. PDF files up to 50MB
                    </p>
                    <Button
                        disabled={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="border-border/60 bg-secondary/30 backdrop-blur-sm hover:bg-secondary/50 rounded-xl"
                    >
                        Browse Files
                    </Button>
                </div>
            </div>

            {/* Available Papers List */}
            <div>
                <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Uploaded Documents ({papers.length})
                </h3>

                {isLoadingPapers ? (
                    <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary/50" /></div>
                ) : papers.length === 0 ? (
                    <div className="text-center py-10 rounded-2xl border border-border/40 bg-card/30 text-muted-foreground text-sm">No papers found.</div>
                ) : (
                    <div className="grid gap-3">
                        <AnimatePresence>
                            {papers.map((p, index) => (
                                <motion.div
                                    key={p.file_id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05, duration: 0.3 }}
                                    onClick={() => setActiveFileId(p.file_id)}
                                    className={`
                    p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all group backdrop-blur-sm
                    ${activeFileId === p.file_id
                                            ? "border-primary/50 bg-primary/10 shadow-lg shadow-primary/5"
                                            : "border-border/40 bg-card/50 hover:border-primary/30 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5"}
                  `}
                                >
                                    <div className="flex items-center gap-4 overflow-hidden">
                                        <div className={`p-2 rounded-lg transition-colors ${activeFileId === p.file_id ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary group-hover:bg-primary/20"}`}>
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div className="truncate">
                                            <p className="text-sm font-semibold truncate text-foreground leading-tight" title={p.filename}>{p.filename}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{p.chunks_count} chunks indexed • Complete</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0 ml-4">
                                        <CheckCircle2 className="h-5 w-5 text-[#32D583]" />
                                        <button
                                            className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                                            onClick={(e) => handleDelete(p.file_id, e)}
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

        </div>
    );
}
