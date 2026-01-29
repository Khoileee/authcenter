import { AppHeader } from "@/components/AppHeader";
import { UsersTab } from "@/components/users-roles/UsersTab";

export default function Users() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <AppHeader title="Người dùng" />

      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
          <UsersTab />
        </div>
      </main>
    </div>
  );
}
