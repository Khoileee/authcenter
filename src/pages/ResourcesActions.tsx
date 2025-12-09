import { AppHeader } from "@/components/AppHeader";
import { ResourcesTab } from "@/components/resources-actions/ResourcesTab";

export default function ResourcesActions() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <AppHeader title="Tài nguyên" />

      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Quản lý các tài nguyên dùng cho phân quyền trong hệ thống
            </p>
          </div>
          
          <div className="flex-1 min-h-0">
            <ResourcesTab />
          </div>
        </div>
      </main>
    </div>
  );
}
