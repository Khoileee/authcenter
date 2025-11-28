import { AppHeader } from "@/components/AppHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersTab } from "@/components/users-roles/UsersTab";
import { RolesTab } from "@/components/users-roles/RolesTab";

export default function UsersRoles() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader title="Người dùng & Vai trò" />
      
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="users">Người dùng</TabsTrigger>
              <TabsTrigger value="roles">Vai trò</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="mt-0">
              <UsersTab />
            </TabsContent>
            
            <TabsContent value="roles" className="mt-0">
              <RolesTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
