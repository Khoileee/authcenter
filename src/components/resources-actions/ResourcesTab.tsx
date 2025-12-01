import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { DataTable, Column } from "@/components/ui/data-table";
import { CreateResourcePanel } from "@/components/dialogs/CreateResourceDialog";
import { useState } from "react";

const mockResources = [
  { id: 1, code: "menu.data_quality", name: "Data Quality", type: "UI Menu", featureGroup: "Data Management" },
  { id: 2, code: "api.dq.upload_rule", name: "Upload Rule API", type: "API Endpoint", featureGroup: "Data Quality" },
  { id: 3, code: "feature.ticket.create", name: "Create Ticket", type: "Business Entity", featureGroup: "Ticket System" },
  { id: 4, code: "menu.user_management", name: "User Management", type: "UI Menu", featureGroup: "Administration" },
];

const columns: Column<typeof mockResources[0]>[] = [
  { header: "Mã tài nguyên", accessorKey: "code", className: "font-mono text-sm" },
  { header: "Tên hiển thị", accessorKey: "name", className: "font-medium" },
  {
    header: "Loại",
    accessorKey: "type",
    cell: (resource) => (
      <Badge variant="secondary" className="font-normal">
        {resource.type}
      </Badge>
    ),
  },
  { header: "Nhóm tính năng", accessorKey: "featureGroup", className: "text-muted-foreground" },
  {
    header: "Hành động",
    className: "text-right",
    cell: () => (
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
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
            <Input placeholder="Tìm kiếm tài nguyên..." className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/20 transition-all shadow-sm hover:bg-background/80" />
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
