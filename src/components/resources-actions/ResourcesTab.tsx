import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { DataTable, Column } from "@/components/ui/data-table";

const mockResources = [
  {
    id: 1,
    code: "menu.data_quality",
    displayName: "Data Quality",
    type: "menu",
    description: "Menu quản lý chất lượng dữ liệu",
  },
  {
    id: 2,
    code: "api.user_management",
    displayName: "User Management API",
    type: "api",
    description: "API quản lý người dùng",
  },
  {
    id: 3,
    code: "entity.report",
    displayName: "Report Entity",
    type: "entity",
    description: "Thực thể báo cáo",
  },
  {
    id: 4,
    code: "menu.analytics",
    displayName: "Analytics",
    type: "menu",
    description: "Menu phân tích dữ liệu",
  },
];

const typeColors: Record<string, string> = {
  menu: "default",
  api: "secondary",
  entity: "outline",
};

const columns: Column<typeof mockResources[0]>[] = [
  { header: "Mã tài nguyên", accessorKey: "code", className: "font-mono text-sm" },
  { header: "Tên hiển thị", accessorKey: "displayName", className: "font-medium" },
  {
    header: "Loại",
    cell: (resource) => (
      <Badge variant={typeColors[resource.type] as any} className="capitalize font-normal">
        {resource.type}
      </Badge>
    ),
  },
  { header: "Mô tả", accessorKey: "description", className: "text-muted-foreground" },
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
  return (
    <Card className="h-full flex flex-col border-none shadow-none bg-transparent">
      <CardHeader className="flex flex-row items-center justify-between px-0 pt-0 pb-6">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Danh sách tài nguyên</CardTitle>
          <p className="text-sm text-muted-foreground">Quản lý các tài nguyên trong hệ thống</p>
        </div>
        <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105">
          <Plus className="h-4 w-4 mr-2" />
          Thêm tài nguyên
        </Button>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col min-h-0">
        <div className="flex-1 min-h-0">
          <DataTable data={mockResources} columns={columns} pageSize={10} />
        </div>
      </CardContent>
    </Card>
  );
}
