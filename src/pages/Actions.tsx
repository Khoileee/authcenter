import { AppHeader } from "@/components/AppHeader";
import { ActionsTab } from "@/components/actions/ActionsTab";

export default function Actions() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <AppHeader title="Quản lý hành động" />

      <main className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
        <div className="w-full flex-1 flex flex-col min-h-0">
          <ActionsTab />
        </div>
      </main>
    </div>
  );
}
