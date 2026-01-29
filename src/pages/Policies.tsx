import { AppHeader } from "@/components/AppHeader";
import { ProfilesTab } from "@/components/policies/ProfilesTab";

export default function Policies() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <AppHeader title="Quản lý profile quyền" />

      <main className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
        <div className="w-full flex-1 flex flex-col min-h-0">
          <ProfilesTab />
        </div>
      </main>
    </div>
  );
}
