import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DataTable, Column } from "@/components/ui/data-table";
import { CreateResourcePanel } from "@/components/dialogs/CreateResourceDialog";
import { SearchFilter } from "@/components/common/SearchFilter";
import { SettingsButton, EditButton, DeleteButton, ActionButtonsContainer } from "@/components/common/ActionButtons";
import { useState } from "react";

const mockResources = [
  { id: 1, system: "Ticket System", code: "feature.ticket.create", name: "Create Ticket", type: "Business Entity", featureGroup: "Ticket System", status: "active" },
  { id: 2, system: "Ticket System", code: "feature.ticket.view", name: "View Ticket", type: "Business Entity", featureGroup: "Ticket System", status: "active" },
  { id: 3, system: "Ticket System", code: "feature.ticket.assign", name: "Assign Ticket", type: "Business Entity", featureGroup: "Ticket System", status: "active" },
  { id: 4, system: "Data Quality", code: "menu.data_quality", name: "Data Quality Menu", type: "UI Menu", featureGroup: "Data Management", status: "active" },
  { id: 5, system: "Data Quality", code: "api.dq.upload_rule", name: "Upload Rule API", type: "API Endpoint", featureGroup: "Data Quality", status: "active" },
  { id: 6, system: "Data Quality", code: "api.dq.execute_rule", name: "Execute Rule API", type: "API Endpoint", featureGroup: "Data Quality", status: "active" },
  { id: 7, system: "Data Quality", code: "feature.dq.manage_rules", name: "Manage DQ Rules", type: "Business Entity", featureGroup: "Data Quality", status: "active" },
  { id: 8, system: "Data Quality", code: "feature.dq.view_reports", name: "View DQ Reports", type: "Business Entity", featureGroup: "Data Quality", status: "active" },
  { id: 9, system: "Administration", code: "menu.user_management", name: "User Management", type: "UI Menu", featureGroup: "Administration", status: "active" },
  { id: 10, system: "Administration", code: "menu.role_management", name: "Role Management", type: "UI Menu", featureGroup: "Administration", status: "active" },
  { id: 11, system: "Administration", code: "menu.audit_log", name: "Audit Log", type: "UI Menu", featureGroup: "Administration", status: "active" },
  { id: 12, system: "Administration", code: "api.admin.export_users", name: "Export Users API", type: "API Endpoint", featureGroup: "Administration", status: "active" },
  { id: 13, system: "Analytics", code: "menu.dashboard", name: "Analytics Dashboard", type: "UI Menu", featureGroup: "Analytics", status: "active" },
  { id: 14, system: "Analytics", code: "menu.reports", name: "Reports Menu", type: "UI Menu", featureGroup: "Analytics", status: "active" },
  { id: 15, system: "Analytics", code: "feature.report.create", name: "Create Report", type: "Business Entity", featureGroup: "Analytics", status: "active" },
  { id: 16, system: "Analytics", code: "feature.report.export", name: "Export Report", type: "Business Entity", featureGroup: "Analytics", status: "active" },
  { id: 17, system: "Workflow", code: "menu.workflow", name: "Workflow Menu", type: "UI Menu", featureGroup: "Workflow", status: "active" },
  { id: 18, system: "Workflow", code: "feature.workflow.create", name: "Create Workflow", type: "Business Entity", featureGroup: "Workflow", status: "active" },
  { id: 19, system: "Workflow", code: "feature.workflow.approve", name: "Approve Workflow", type: "Business Entity", featureGroup: "Workflow", status: "active" },
  { id: 20, system: "Notification", code: "api.notification.send", name: "Send Notification API", type: "API Endpoint", featureGroup: "Notification", status: "active" },
  { id: 21, system: "Notification", code: "menu.notification_settings", name: "Notification Settings", type: "UI Menu", featureGroup: "Notification", status: "active" },
  { id: 22, system: "File Storage", code: "api.storage.upload", name: "Upload File API", type: "API Endpoint", featureGroup: "File Storage", status: "active" },
  { id: 23, system: "File Storage", code: "api.storage.download", name: "Download File API", type: "API Endpoint", featureGroup: "File Storage", status: "active" },
  { id: 24, system: "File Storage", code: "feature.storage.manage", name: "Manage Files", type: "Business Entity", featureGroup: "File Storage", status: "inactive" },
  { id: 25, system: "Integration", code: "api.integration.sync", name: "Sync Data API", type: "API Endpoint", featureGroup: "Integration", status: "active" },
];

export function ResourcesTab() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleReset = () => {
    setSearchValue("");
  };

  const columns: Column<typeof mockResources[0]>[] = [
    { 
      header: "Hệ thống", 
      accessorKey: "system",
      cell: (resource) => (
        <span className="font-medium text-foreground">{resource.system}</span>
      ),
    },
    { 
      header: "Mã tài nguyên", 
      accessorKey: "code", 
      className: "font-mono text-sm text-primary"
    },
    { 
      header: "Tên hiển thị", 
      accessorKey: "name", 
      className: "font-medium"
    },
    {
      header: "Trạng thái",
      accessorKey: "status",
      cell: (resource) => (
        resource.status === "active" ? (
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-none bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-200/50">
            Active
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-slate-100 text-slate-500 hover:bg-slate-200">
            Inactive
          </span>
        )
      ),
    },
    {
      header: "Hành động",
      className: "text-center",
      cell: (resource) => (
        <ActionButtonsContainer>
          <SettingsButton onClick={() => console.log("Settings", resource.id)} />
          <EditButton onClick={() => console.log("Edit", resource.id)} />
          <DeleteButton onClick={() => console.log("Delete", resource.id)} />
        </ActionButtonsContainer>
      ),
    },
  ];

  return (
    <>
      <Card className="h-full flex flex-col border-none shadow-none bg-transparent">
        <CardHeader className="flex flex-row items-center justify-between px-0 pt-0 pb-6">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="text-2xl font-bold tracking-tight">Danh sách tài nguyên</CardTitle>
            <p className="text-sm text-muted-foreground">Quản lý các tài nguyên cần phân quyền trong hệ thống</p>
          </div>
          <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm tài nguyên
          </Button>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col min-h-0 space-y-4">
          <SearchFilter
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onSearch={() => console.log("Search:", searchValue)}
            onReset={handleReset}
            placeholder="Tìm kiếm theo mã hoặc tên tài nguyên..."
          />

          <div className="flex-1 min-h-0">
            <DataTable data={mockResources} columns={columns} pageSize={10} />
          </div>
        </CardContent>
      </Card>

      <CreateResourcePanel open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </>
  );
}
