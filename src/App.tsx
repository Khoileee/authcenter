import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import UsersRoles from "./pages/UsersRoles";
import ResourcesActions from "./pages/ResourcesActions";
import PermissionProfiles from "./pages/PermissionProfiles";
import Policies from "./pages/Policies";
import PermissionCheck from "./pages/PermissionCheck";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/users-roles" element={<UsersRoles />} />
                <Route path="/resources-actions" element={<ResourcesActions />} />
                <Route path="/permission-profiles" element={<PermissionProfiles />} />
                <Route path="/policies" element={<Policies />} />
                <Route path="/permission-check" element={<PermissionCheck />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
