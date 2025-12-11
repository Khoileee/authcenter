import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, Pencil, Trash2, Search } from "lucide-react";
import { DataTable, Column } from "@/components/ui/data-table";
import { CreateResourcePanel } from "@/components/dialogs/CreateResourceDialog";
import { useState } from "react";

const mockResources = [
  { 
    id: 1, 
    system: "Ticket System",
    code: "feature.ticket.create", 
    name: "Create Ticket", 
    type: "Business Entity", 
    featureGroup: "Ticket System",
    status: "active"
  },
  { 
    id: 2, 
    system: "Data Quality",
    code: "menu.data_quality", 
    name: "Data Quality", 
    type: "UI Menu", 
    featureGroup: "Data Management",
    status: "active"
  },
  { 
    id: 3, 
    system: "Data Quality",
    code: "api.dq.upload_rule", 
    name: "Upload Rule API", 
    type: "API Endpoint", 
    featureGroup: "Data Quality",
    status: "active"
  },
  { 
    id: 4, 
    system: "Administration",
    code: "menu.user_management", 
    name: "User Management", 
    type: "UI Menu", 
    featureGroup: "Administration",
    status: "inactive"
  },
];

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
    className: "text-right",
    cell: () => (
      <div className="flex justify-end gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
          title="Cấu hình"
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
          title="Sửa thông tin"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          title="Xóa"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export function ResourcesTab() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <>
      <Card className="h-full flex flex-col border-none shadow-none bg-transparent">
        <CardHeader className="flex flex-row items-center justify-between px-0 pt-0 pb-6">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Danh sách tài nguyên</CardTitle>
            <p className="text-sm text-muted-foreground">Quản lý các tài nguyên cần phân quyền</p>
          </div>
          <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm tài nguyên
          </Button>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col min-h-0 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Tìm kiếm theo mã hoặc tên tài nguyên..." 
              className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/20 transition-all shadow-sm hover:bg-background/80" 
            />
          </div>

          <div className="flex-1 min-h-0">
            <DataTable data={mockResources} columns={columns} pageSize={10} />
          </div>
        </CardContent>
      </Card>

      <CreateResourcePanel open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </>
  );
}
