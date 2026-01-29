import { AppHeader } from "@/components/AppHeader";
import { UnitsTab } from "@/components/units/UnitsTab";

export default function Units() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <AppHeader title="Đơn vị" />

      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
          <UnitsTab />
        </div>
      </main>
    </div>
  );
}
