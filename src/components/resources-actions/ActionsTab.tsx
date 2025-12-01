import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { DataTable, Column } from "@/components/ui/data-table";
import { CreateActionPanel } from "@/components/dialogs/CreateActionDialog";
import { useState } from "react";

const mockActions = [
  { id: 1, code: "view", name: "Xem", group: "CRUD", description: "Xem thông tin" },
  { id: 2, code: "edit", name: "Sửa", group: "CRUD", description: "Chỉnh sửa thông tin" },
  { id: 3, code: "approve", name: "Phê duyệt", group: "Workflow", description: "Phê duyệt yêu cầu" },
  { id: 4, code: "upload_rule", name: "Upload Rule", group: "Admin", description: "Tải lên quy tắc mới" },
];

const columns: Column<typeof mockActions[0]>[] = [
  { header: "Mã hành động", accessorKey: "code", className: "font-mono text-sm" },
  { header: "Tên hiển thị", accessorKey: "name", className: "font-medium" },
  { header: "Nhóm", accessorKey: "group", className: "text-muted-foreground" },
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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <>
      <Card className="h-full flex flex-col border-none shadow-none bg-transparent">
        <CardHeader className="flex flex-row items-center justify-between px-0 pt-0 pb-6">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Danh sách hành động</CardTitle>
            <p className="text-sm text-muted-foreground">Quản lý các hành động có thể phân quyền</p>
          </div>
          <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm hành động
          </Button>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col min-h-0 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm kiếm hành động..." className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/20 transition-all shadow-sm hover:bg-background/80" />
          </div>

          <div className="flex-1 min-h-0">
            <DataTable data={mockActions} columns={columns} pageSize={10} />
          </div>
        </CardContent>
      </Card>

      <CreateActionPanel open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </>
  );
}
