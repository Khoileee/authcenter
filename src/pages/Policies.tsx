import { AppHeader } from "@/components/AppHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserACLTab } from "@/components/policies/UserACLTab";
import { RoleRBACTab } from "@/components/policies/RoleRBACTab";

export default function Policies() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <AppHeader title="Chính sách phân quyền" />

      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
          <Tabs defaultValue="acl" className="flex-1 flex flex-col min-h-0">
            <TabsList className="mb-4">
              <TabsTrigger value="acl">Quyền theo người dùng (ACL)</TabsTrigger>
              <TabsTrigger value="rbac">Quyền theo vai trò (RBAC & ABAC)</TabsTrigger>
            </TabsList>

            {/* Tab 1: User ACL */}
            <TabsContent value="acl" className="flex-1 min-h-0 overflow-auto mt-0">
              <UserACLTab />
            </TabsContent>

            {/* Tab 2: Policy Editor (RBAC + ABAC) */}
            <TabsContent value="rbac" className="flex-1 min-h-0 overflow-auto mt-0">
              <RoleRBACTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
