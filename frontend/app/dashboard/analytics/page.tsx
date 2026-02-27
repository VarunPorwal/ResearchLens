import DashboardLayout from "@/components/layout/dashboard-layout";
import AnalyticsPanel from "@/components/panels/analytics-panel";

export default function AnalyticsPage() {
    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Metrics & Analytics</h1>
                <p className="text-muted-foreground">Extracted quantitative data visualized from your active paper.</p>
            </div>
            <AnalyticsPanel />
        </DashboardLayout>
    );
}
