import DashboardLayout from "@/components/layout/dashboard-layout";
import ComparePanel from "@/components/panels/compare-panel";

export default function ComparePage() {
    return (
        <DashboardLayout>
            <div className="h-full flex flex-col">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Compare Papers</h1>
                    <p className="text-muted-foreground">Select multiple papers to contrast their findings side-by-side.</p>
                </div>
                <div className="flex-1">
                    <ComparePanel />
                </div>
            </div>
        </DashboardLayout>
    );
}
