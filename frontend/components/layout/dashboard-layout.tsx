"use client";

import { Sidebar } from "./sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { isLoading, user } = useAuth();

    // Close mobile sidebar on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">Initializing Security...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-primary/30">

            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Mobile Header & Sidebar */}
            <div className="md:hidden flex flex-col w-full h-full">
                <div className="h-14 border-b border-border/50 bg-background/60 backdrop-blur-md flex items-center justify-between px-4 z-40 fixed top-0 w-full">
                    <button onClick={() => setMobileOpen(!mobileOpen)}>
                        <Menu className="h-5 w-5" />
                    </button>
                    <Link href="/">
                        <div className="flex items-center gap-2 cursor-pointer group">
                            <Sparkles className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                            <span className="font-bold group-hover:text-primary transition-colors">ResearchLens</span>
                        </div>
                    </Link>
                </div>

                <AnimatePresence>
                    {mobileOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
                                onClick={() => setMobileOpen(false)}
                            />
                            <motion.div
                                initial={{ x: -220 }} animate={{ x: 0 }} exit={{ x: -220 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="fixed inset-y-0 left-0 z-50 shadow-2xl"
                            >
                                <Sidebar />
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Main Content Area Mobile offset */}
                <div className="pt-14 flex-1 h-full overflow-hidden relative flex flex-col">
                    {/* Subtle dashboard global glow */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] -z-10 pointer-events-none" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="flex-1 overflow-y-auto p-4 sm:p-6"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Main Content Area Desktop offset */}
            <main className="hidden md:flex flex-1 h-full overflow-hidden relative flex-col ml-[220px] transition-all duration-200">
                <style>{`
           /* Override ml based on sidebar state via sibling if possible, but for simplicity assuming expanded here. 
              A more robust approach controls this via context, but hardcoding ml-[220px] or dynamic styled is fine for now as requested. */
           @media (min-width: 768px) {
              main:has(aside[style*="width: 64px"]) {
                 margin-left: 64px;
              }
           }
        `}</style>
                {/* Subtle dashboard global glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] -z-10 pointer-events-none" />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 overflow-y-auto p-6 lg:p-10 max-w-7xl mx-auto w-full"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
