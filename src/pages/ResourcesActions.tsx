import { AppHeader } from "@/components/AppHeader";
import { ResourcesTab } from "@/components/resources-actions/ResourcesTab";

export default function ResourcesActions() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <AppHeader title="Tài nguyên" />

      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
          <ResourcesTab />
        </div>
      </main>
    </div>
  );
}
