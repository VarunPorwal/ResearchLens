import DashboardLayout from "@/components/layout/dashboard-layout";
import SettingsPanel from "@/components/panels/settings-panel";

export default function SettingsPage() {
    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Platform Settings</h1>
                <p className="text-muted-foreground">Manage your workspace priorities and connection parameters.</p>
            </div>
            <div className="max-w-3xl">
                <SettingsPanel />
            </div>
        </DashboardLayout>
    );
}
