import DashboardLayout from "@/components/layout/dashboard-layout";
import UploadPanel from "@/components/panels/upload-panel";

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Knowledge Base</h1>
                    <p className="text-muted-foreground">Upload and manage your research papers to begin analysis.</p>
                </div>
                <UploadPanel />
            </div>
        </DashboardLayout>
    );
}
