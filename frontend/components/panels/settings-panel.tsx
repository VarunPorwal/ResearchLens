"use client";

import { useState, useEffect } from "react";
import { User, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/auth-provider";

export default function SettingsPanel() {
    const { user } = useAuth();
    const [settings, setSettings] = useState({
        displayName: user?.user_metadata?.full_name || "Research User",
        email: user?.email || "user@research.org",
        emailNotifications: "Enabled",
        paperAlerts: "Weekly",
        summaryReports: "Monthly",
        dataRetention: "90 days",
        analytics: "Anonymized",
        sharing: "Private"
    });

    useEffect(() => {
        const saved = localStorage.getItem("researchlens-settings");
        if (saved) {
            try {
                setSettings(prev => ({
                    ...prev,
                    ...JSON.parse(saved),
                    displayName: user?.user_metadata?.full_name || prev.displayName,
                    email: user?.email || prev.email
                }));
            } catch (e) {
                console.error("Failed to parse settings", e);
            }
        } else if (user) {
            setSettings(prev => ({
                ...prev,
                displayName: user.user_metadata?.full_name || prev.displayName,
                email: user.email || prev.email
            }));
        }
    }, [user]);

    const handleSave = () => {
        localStorage.setItem("researchlens-settings", JSON.stringify(settings));
        toast.success("Preferences saved successfully");
    };

    return (
        <div className="max-w-3xl mx-auto w-full pb-20">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight mb-1 text-foreground">Settings</h1>
                <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="space-y-6"
            >

                {/* Profile Section */}
                <div className="rounded-2xl border border-border/40 bg-card/50 p-5 backdrop-blur-sm shadow-sm group hover:border-border/60 transition-colors">
                    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border/20">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">Profile</h3>
                            <p className="text-[11px] text-muted-foreground mt-0.5">Manage your identity down to the institution</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="rounded-xl bg-secondary/30 px-4 py-3 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground w-1/3">Display Name</span>
                            <input
                                type="text"
                                value={settings.displayName}
                                onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
                                className="text-xs font-medium text-foreground bg-transparent border-none text-right focus:outline-none w-2/3"
                            />
                        </div>
                        <div className="rounded-xl bg-secondary/30 px-4 py-3 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground w-1/3">Email</span>
                            <input
                                type="email"
                                value={settings.email}
                                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                className="text-xs font-medium text-foreground bg-transparent border-none text-right focus:outline-none w-2/3"
                            />
                        </div>
                    </div>
                </div>

                {/* Notifications Section */}
                <div className="rounded-2xl border border-border/40 bg-card/50 p-5 backdrop-blur-sm shadow-sm group hover:border-border/60 transition-colors">
                    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border/20">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Bell className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                            <p className="text-[11px] text-muted-foreground mt-0.5">Control how and when we alert you</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="rounded-xl bg-secondary/30 px-4 py-3 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground w-1/3">Email Notifications</span>
                            <select
                                value={settings.emailNotifications}
                                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.value })}
                                className="text-xs font-medium text-foreground bg-transparent border-none text-right focus:outline-none appearance-none cursor-pointer"
                            >
                                <option className="bg-background">Enabled</option>
                                <option className="bg-background">Disabled</option>
                            </select>
                        </div>
                        <div className="rounded-xl bg-secondary/30 px-4 py-3 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground w-1/3">Paper Alerts</span>
                            <select
                                value={settings.paperAlerts}
                                onChange={(e) => setSettings({ ...settings, paperAlerts: e.target.value })}
                                className="text-xs font-medium text-foreground bg-transparent border-none text-right focus:outline-none appearance-none cursor-pointer"
                            >
                                <option className="bg-background">Daily</option>
                                <option className="bg-background">Weekly</option>
                                <option className="bg-background">Monthly</option>
                                <option className="bg-background">Never</option>
                            </select>
                        </div>
                        <div className="rounded-xl bg-secondary/30 px-4 py-3 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground w-1/3">Summary Reports</span>
                            <select
                                value={settings.summaryReports}
                                onChange={(e) => setSettings({ ...settings, summaryReports: e.target.value })}
                                className="text-xs font-medium text-foreground bg-transparent border-none text-right focus:outline-none appearance-none cursor-pointer"
                            >
                                <option className="bg-background">Weekly</option>
                                <option className="bg-background">Monthly</option>
                                <option className="bg-background">Quarterly</option>
                                <option className="bg-background">Never</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Privacy Section */}
                <div className="rounded-2xl border border-border/40 bg-card/50 p-5 backdrop-blur-sm shadow-sm group hover:border-border/60 transition-colors">
                    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border/20">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Shield className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">Privacy</h3>
                            <p className="text-[11px] text-muted-foreground mt-0.5">Security and data retention boundaries</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="rounded-xl bg-secondary/30 px-4 py-3 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground w-1/3">Data Retention</span>
                            <select
                                value={settings.dataRetention}
                                onChange={(e) => setSettings({ ...settings, dataRetention: e.target.value })}
                                className="text-xs font-medium text-foreground bg-transparent border-none text-right focus:outline-none appearance-none cursor-pointer"
                            >
                                <option className="bg-background">30 days</option>
                                <option className="bg-background">90 days</option>
                                <option className="bg-background">1 Year</option>
                                <option className="bg-background">Indefinite</option>
                            </select>
                        </div>
                        <div className="rounded-xl bg-secondary/30 px-4 py-3 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground w-1/3">Analytics</span>
                            <select
                                value={settings.analytics}
                                onChange={(e) => setSettings({ ...settings, analytics: e.target.value })}
                                className="text-xs font-medium text-foreground bg-transparent border-none text-right focus:outline-none appearance-none cursor-pointer"
                            >
                                <option className="bg-background">Anonymized</option>
                                <option className="bg-background">Full Tracking</option>
                                <option className="bg-background">Disabled</option>
                            </select>
                        </div>
                        <div className="rounded-xl bg-secondary/30 px-4 py-3 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground w-1/3">Sharing</span>
                            <select
                                value={settings.sharing}
                                onChange={(e) => setSettings({ ...settings, sharing: e.target.value })}
                                className="text-xs font-medium text-foreground bg-transparent border-none text-right focus:outline-none appearance-none cursor-pointer"
                            >
                                <option className="bg-background">Private</option>
                                <option className="bg-background">Team Only</option>
                                <option className="bg-background">Public</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-10 rounded-xl shadow-[0_0_15px_oklch(0.65_0.25_265/0.25)] hover:shadow-[0_0_20px_oklch(0.65_0.25_265/0.4)] transition-all">
                        Save Changes
                    </Button>
                </div>

            </motion.div>
        </div>
    );
}
