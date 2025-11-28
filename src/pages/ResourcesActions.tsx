import { AppHeader } from "@/components/AppHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourcesTab } from "@/components/resources-actions/ResourcesTab";
import { ActionsTab } from "@/components/resources-actions/ActionsTab";

export default function ResourcesActions() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <AppHeader title="Tài nguyên & Hành động" />

      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
          <Tabs defaultValue="resources" className="w-full flex-1 flex flex-col min-h-0">
            <TabsList className="mb-6 bg-muted/50 p-1 w-fit">
              <TabsTrigger value="resources" className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-6">
                Tài nguyên
              </TabsTrigger>
              <TabsTrigger value="actions" className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-6">
                Hành động
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resources" className="mt-0 flex-1 min-h-0">
              <ResourcesTab />
            </TabsContent>

            <TabsContent value="actions" className="mt-0 flex-1 min-h-0">
              <ActionsTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
