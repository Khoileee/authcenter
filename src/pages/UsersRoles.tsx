import { AppHeader } from "@/components/AppHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersTab } from "@/components/users-roles/UsersTab";
import { RolesTab } from "@/components/users-roles/RolesTab";

export default function UsersRoles() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <AppHeader title="Người dùng & Vai trò" />

      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
          <Tabs defaultValue="users" className="w-full flex-1 flex flex-col min-h-0">
            <TabsList className="mb-6 bg-muted/50 p-1 w-fit">
              <TabsTrigger value="users" className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-6">
                Người dùng
              </TabsTrigger>
              <TabsTrigger value="roles" className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-6">
                Vai trò
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-0 flex-1 min-h-0">
              <UsersTab />
            </TabsContent>

            <TabsContent value="roles" className="mt-0 flex-1 min-h-0">
              <RolesTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
