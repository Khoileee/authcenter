import { AppHeader } from "@/components/AppHeader";
import { RolesTab } from "@/components/users-roles/RolesTab";

export default function Roles() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <AppHeader title="Vai trò" />

      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
          <RolesTab />
        </div>
      </main>
    </div>
  );
}
