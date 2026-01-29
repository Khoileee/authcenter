import { Shield, Server, Users, UserCheck, Building2, Database, FileText, CheckCircle } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Quản lý người dùng", url: "/users", icon: Users },
  { title: "Quản lý vai trò", url: "/roles", icon: UserCheck },
  { title: "Quản lý đơn vị", url: "/units", icon: Building2 },
  { title: "Quản lý profile quyền", url: "/policies", icon: FileText },
  { title: "Kiểm tra quyền", url: "/permission-check", icon: CheckCircle },
  { title: "Quản lý tài nguyên", url: "/resources-actions", icon: Database },
  { title: "Quản lý hệ thống", url: "/systems", icon: Server },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar backdrop-blur-xl">
      <SidebarHeader className="border-b border-sidebar-border/50 p-5 group-data-[collapsible=icon]:p-3 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center transition-all duration-300">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:gap-0">
          <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/20 ring-1 ring-white/10">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div className={cn(
            "flex flex-col min-w-0 transition-all duration-300 ease-in-out",
            isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
          )}>
            <span className="text-lg font-bold text-sidebar-foreground tracking-tight whitespace-nowrap">Auth Center</span>
            <span className="text-xs text-sidebar-foreground/60 font-medium whitespace-nowrap">Admin Dashboard</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-6 group-data-[collapsible=icon]:px-1 transition-all duration-300">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.title} className="list-none">
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center rounded-xl transition-all duration-300 ease-in-out text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                        "h-11 px-3 gap-3 justify-start",
                        "group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:justify-center"
                      )}
                      activeClassName="!bg-primary !text-white font-medium shadow-lg shadow-primary/30"
                    >
                      <Icon className="h-5 w-5 flex-shrink-0 transition-transform duration-300 hover:scale-110" />
                      <span className={cn(
                        "text-sm transition-all duration-300 ease-in-out whitespace-nowrap",
                        isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
                      )}>
                        {item.title}
                      </span>
                    </NavLink>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
