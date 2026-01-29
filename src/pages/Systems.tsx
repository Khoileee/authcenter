import { AppHeader } from "@/components/AppHeader";
import { SystemsTab } from "@/components/systems/SystemsTab";

export default function Systems() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <AppHeader title="Quản lý hệ thống" />

      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
          <SystemsTab />
        </div>
      </main>
    </div>
  );
}
