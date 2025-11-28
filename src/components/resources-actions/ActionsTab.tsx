import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { DataTable, Column } from "@/components/ui/data-table";

const mockActions = [
  {
    id: 1,
    code: "view_menu",
    displayName: "Xem menu",
    description: "Quyền xem menu trong hệ thống",
  },
  {
    id: 2,
    code: "create_rule",
    displayName: "Tạo rule",
    description: "Quyền tạo rule mới",
  },
  {
    id: 3,
    code: "upload_rule",
    displayName: "Upload rule",
    description: "Quyền upload file rule",
  },
  {
    id: 4,
    code: "edit_user",
    displayName: "Chỉnh sửa người dùng",
    description: "Quyền chỉnh sửa thông tin người dùng",
  },
  {
    id: 5,
    code: "delete_report",
    displayName: "Xóa báo cáo",
    description: "Quyền xóa báo cáo",
  },
];

const columns: Column<typeof mockActions[0]>[] = [
  { header: "Action code", accessorKey: "code", className: "font-mono text-sm" },
  { header: "Tên hiển thị", accessorKey: "displayName", className: "font-medium" },
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

export function ActionsTab() {
  return (
    <Card className="h-full flex flex-col border-none shadow-none bg-transparent">
      <CardHeader className="flex flex-row items-center justify-between px-0 pt-0 pb-6">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Danh sách hành động</CardTitle>
          <p className="text-sm text-muted-foreground">Quản lý các hành động có thể thực hiện trong hệ thống</p>
        </div>
        <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105">
          <Plus className="h-4 w-4 mr-2" />
          Thêm hành động
        </Button>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col min-h-0">
        <div className="flex-1 min-h-0">
          <DataTable data={mockActions} columns={columns} pageSize={10} />
        </div>
      </CardContent>
    </Card>
  );
}
