import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Pencil, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, Column } from "@/components/ui/data-table";
import { CreateUserPanel } from "@/components/dialogs/CreateUserDialog";
import { useState } from "react";

const mockUsers = [
  { id: 1, name: "Nguyễn Văn An", username: "annv", email: "annv@company.com", unit: "IT Department", roles: ["Admin", "Manager"], status: "active" },
  { id: 2, name: "Trần Thị Bình", username: "binhtt", email: "binhtt@company.com", unit: "HR Department", roles: ["User"], status: "active" },
  { id: 3, name: "Lê Nhật Khôi", username: "khoiln1", email: "khoiln1@company.com", unit: "Data Team", roles: ["Data Analyst"], status: "active" },
  { id: 4, name: "Phạm Minh Đức", username: "ducpm", email: "ducpm@company.com", unit: "IT Department", roles: ["Developer"], status: "inactive" },
  { id: 5, name: "Hoàng Thu Thảo", username: "thaoht", email: "thaoht@company.com", unit: "Marketing", roles: ["User"], status: "active" },
  { id: 6, name: "Vũ Tuấn Anh", username: "anhvt", email: "anhvt@company.com", unit: "Sales", roles: ["Manager"], status: "active" },
  { id: 7, name: "Đặng Thị Mai", username: "maidt", email: "maidt@company.com", unit: "HR Department", roles: ["User"], status: "active" },
  { id: 8, name: "Ngô Văn Hùng", username: "hungnv", email: "hungnv@company.com", unit: "IT Department", roles: ["DevOps"], status: "active" },
  { id: 9, name: "Bùi Thị Lan", username: "lanbt", email: "lanbt@company.com", unit: "Finance", roles: ["Accountant"], status: "inactive" },
  { id: 10, name: "Trịnh Quốc Bảo", username: "baotq", email: "baotq@company.com", unit: "Board", roles: ["Admin"], status: "active" },
  { id: 11, name: "Lý Thị Hà", username: "halt", email: "halt@company.com", unit: "Marketing", roles: ["User"], status: "active" },
];

const columns: Column<typeof mockUsers[0]>[] = [
  { header: "Họ tên", accessorKey: "name", className: "font-medium" },
  { header: "Username", accessorKey: "username" },
  { header: "Email", accessorKey: "email" },
  { header: "Đơn vị", accessorKey: "unit" },
  {
    header: "Vai trò",
    cell: (user) => (
      <div className="flex gap-1 flex-wrap">
        {user.roles.map((role) => (
          <Badge key={role} variant="secondary" className="font-normal">{role}</Badge>
        ))}
      </div>
    ),
  },
  {
    header: "Trạng thái",
    cell: (user) => (
      <Badge
        variant={user.status === "active" ? "default" : "secondary"}
        className={user.status === "active" ? "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-200/50" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}
      >
        {user.status === "active" ? "Hoạt động" : "Ngừng hoạt động"}
      </Badge>
    ),
  },
  {
    header: "Hành động",
    className: "text-right",
    cell: () => (
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10">
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export function UsersTab() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <>
      <Card className="h-full flex flex-col border-none shadow-none bg-transparent">
        <CardHeader className="flex flex-row items-center justify-between px-0 pt-0 pb-6">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Quản lý người dùng</CardTitle>
            <p className="text-sm text-muted-foreground">Quản lý thông tin người dùng và phân quyền</p>
          </div>
          <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm người dùng
          </Button>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col min-h-0 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 p-0 bg-transparent">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm theo tên, username hoặc email..." className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/20 transition-all shadow-sm hover:bg-background/80" />
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[180px] bg-background/50 border-border/50 shadow-sm hover:bg-background/80">
                  <div className="flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                    <SelectValue placeholder="Đơn vị" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả đơn vị</SelectItem>
                  <SelectItem value="it">IT Department</SelectItem>
                  <SelectItem value="hr">HR Department</SelectItem>
                  <SelectItem value="data">Data Team</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[180px] bg-background/50 border-border/50 shadow-sm hover:bg-background/80">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <DataTable data={mockUsers} columns={columns} pageSize={8} />
          </div>
        </CardContent>
      </Card>

      <CreateUserPanel open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </>
  );
}
