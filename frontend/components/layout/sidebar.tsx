"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    Sparkles,
    Upload,
    MessageSquare,
    FileText,
    GitCompareArrows,
    BarChart3,
    Settings,
    ChevronLeft,
    Home,
    LogOut,
    UserCircle
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";

const navItems = [
    { icon: Upload, label: "Upload", href: "/dashboard" },
    { icon: MessageSquare, label: "Chat", href: "/dashboard/chat" },
    { icon: FileText, label: "Summaries", href: "/dashboard/summaries" },
    { icon: GitCompareArrows, label: "Compare", href: "/dashboard/compare" },
    { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const { user, signOut } = useAuth();

    return (
        <motion.aside
            animate={{ width: collapsed ? 64 : 220 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="h-screen fixed left-0 top-0 bg-sidebar border-r border-sidebar-border flex flex-col z-40"
        >
            {/* Brand */}
            <div className="h-16 flex items-center px-4 border-b border-sidebar-border overflow-hidden whitespace-nowrap justify-center">
                <Link href="/" className="flex items-center justify-center space-x-3 w-full group cursor-pointer">
                    <div className="h-8 w-8 min-w-8 rounded-lg bg-sidebar-primary flex items-center justify-center text-primary-foreground group-hover:scale-105 transition-transform">
                        <Sparkles className="h-4 w-4" />
                    </div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                className="font-bold tracking-tight text-sidebar-foreground group-hover:text-sidebar-primary transition-colors"
                            >
                                ResearchLens
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link key={item.href} href={item.href}>
                            <div
                                className={cn(
                                    "relative flex items-center px-3 py-2.5 rounded-xl cursor-pointer transition-colors group",
                                    isActive
                                        ? "text-sidebar-primary font-medium bg-sidebar-primary/10"
                                        : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                                    collapsed && "justify-center px-0"
                                )}
                            >
                                {/* Active Background Glow */}
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 bg-sidebar-primary/10 rounded-xl"
                                        transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
                                    />
                                )}

                                <div className="relative z-10 flex items-center w-full justify-center lg:justify-start">
                                    <item.icon className={cn("h-5 w-5 min-w-5", isActive ? "text-sidebar-primary" : "text-muted-foreground group-hover:text-sidebar-foreground")} />
                                    <AnimatePresence>
                                        {!collapsed && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -5 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -5 }}
                                                className="ml-3 text-sm whitespace-nowrap"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Controls */}
            <div className="p-3 border-t border-sidebar-border overflow-hidden whitespace-nowrap flex flex-col gap-1">
                <Link href="/">
                    <div className={cn(
                        "flex items-center px-3 py-2.5 rounded-xl cursor-pointer transition-colors text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                        collapsed && "justify-center px-0"
                    )}>
                        <Home className="h-5 w-5 min-w-5 text-muted-foreground group-hover:text-sidebar-foreground" />
                        {!collapsed && <span className="ml-3 text-sm">Back to Home</span>}
                    </div>
                </Link>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={cn(
                        "flex items-center px-3 py-2.5 rounded-xl cursor-pointer transition-colors text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground focus:outline-none",
                        collapsed && "justify-center px-0"
                    )}
                >
                    <motion.div animate={{ rotate: collapsed ? 180 : 0 }}>
                        <ChevronLeft className="h-5 w-5 min-w-5 text-muted-foreground group-hover:text-sidebar-foreground" />
                    </motion.div>
                    {!collapsed && <span className="ml-3 text-sm">Collapse Sidebar</span>}
                </button>

                <div className="mt-2 pt-2 border-t border-sidebar-border">
                    <div className={cn(
                        "flex items-center px-3 py-3 rounded-xl bg-sidebar-accent/50 text-sidebar-foreground/80",
                        collapsed && "justify-center px-0"
                    )}>
                        <div className="h-8 w-8 min-w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary overflow-hidden shrink-0 border border-primary/30">
                            {user?.user_metadata?.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} alt="User" />
                            ) : (
                                <UserCircle className="h-5 w-5" />
                            )}
                        </div>
                        {!collapsed && (
                            <div className="ml-3 overflow-hidden">
                                <p className="text-xs font-semibold truncate leading-none mb-0.5">
                                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User Account"}
                                </p>
                                <p className="text-[10px] text-muted-foreground truncate leading-none">
                                    {user?.email}
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={signOut}
                        className={cn(
                            "w-full flex items-center px-3 py-2.5 mt-1 rounded-xl cursor-pointer transition-colors text-destructive/70 hover:bg-destructive/10 hover:text-destructive focus:outline-none",
                            collapsed && "justify-center px-0"
                        )}
                    >
                        <LogOut className="h-5 w-5 min-w-5" />
                        {!collapsed && <span className="ml-3 text-sm font-medium">Logout</span>}
                    </button>
                </div>
            </div>
        </motion.aside>
    );
}
