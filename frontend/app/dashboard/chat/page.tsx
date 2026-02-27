import DashboardLayout from "@/components/layout/dashboard-layout";
import ChatPanel from "@/components/panels/chat-panel";

export default function ChatPage() {
    return (
        <DashboardLayout>
            <div className="h-full flex flex-col">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Ask Assistant</h1>
                    <p className="text-muted-foreground">Converse with your active research paper using RAG.</p>
                </div>
                <div className="flex-1 overflow-hidden">
                    <ChatPanel />
                </div>
            </div>
        </DashboardLayout>
    );
}
