import { AppHeader } from "@/components/AppHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourcesTab } from "@/components/resources-actions/ResourcesTab";
import { ActionsTab } from "@/components/resources-actions/ActionsTab";

export default function ResourcesActions() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader title="Tài nguyên & Hành động" />
      
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="resources" className="w-full">
            <TabsList className="mb-6 bg-muted/50 p-1">
              <TabsTrigger value="resources" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Tài nguyên
              </TabsTrigger>
              <TabsTrigger value="actions" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Hành động
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="resources" className="mt-0">
              <ResourcesTab />
            </TabsContent>
            
            <TabsContent value="actions" className="mt-0">
              <ActionsTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
