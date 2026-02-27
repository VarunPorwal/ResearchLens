import DashboardLayout from "@/components/layout/dashboard-layout";
import SummaryPanel from "@/components/panels/summary-panel";

export default function SummariesPage() {
    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Structured Summary</h1>
                <p className="text-muted-foreground">Automatically extracted insights from your active document.</p>
            </div>
            <SummaryPanel />
        </DashboardLayout>
    );
}
