import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, Column } from "@/components/ui/data-table";
import { CreateUserPanel } from "@/components/dialogs/CreateUserDialog";
import { UserPermissionDialog } from "@/components/dialogs/UserPermissionDialog";
import { SearchFilter } from "@/components/common/SearchFilter";
import { ViewButton, EditButton, PermissionButton, ActionButtonsContainer } from "@/components/common/ActionButtons";
import { useState } from "react";

const mockUsers = [
  { id: 1, name: "Nguyễn Văn An", username: "annv", email: "annv@company.com", unit: "IT Department", roles: ["Admin", "Manager"], status: "active" },
  { id: 2, name: "Trần Thị Bình", username: "binhtt", email: "binhtt@company.com", unit: "HR Department", roles: ["HR Manager"], status: "active" },
  { id: 3, name: "Lê Nhật Khôi", username: "khoiln1", email: "khoiln1@company.com", unit: "Data Team", roles: ["Data Analyst", "DQ Admin"], status: "active" },
  { id: 4, name: "Phạm Minh Đức", username: "ducpm", email: "ducpm@company.com", unit: "IT Department", roles: ["Developer"], status: "inactive" },
  { id: 5, name: "Hoàng Thu Thảo", username: "thaoht", email: "thaoht@company.com", unit: "Marketing", roles: ["User"], status: "active" },
  { id: 6, name: "Vũ Tuấn Anh", username: "anhvt", email: "anhvt@company.com", unit: "Sales", roles: ["Sales Manager"], status: "active" },
  { id: 7, name: "Đặng Thị Mai", username: "maidt", email: "maidt@company.com", unit: "HR Department", roles: ["User"], status: "active" },
  { id: 8, name: "Ngô Văn Hùng", username: "hungnv", email: "hungnv@company.com", unit: "IT Department", roles: ["DevOps", "SRE"], status: "active" },
  { id: 9, name: "Bùi Thị Lan", username: "lanbt", email: "lanbt@company.com", unit: "Finance", roles: ["Accountant"], status: "inactive" },
  { id: 10, name: "Trịnh Quốc Bảo", username: "baotq", email: "baotq@company.com", unit: "Board", roles: ["Admin", "Auditor"], status: "active" },
  { id: 11, name: "Lý Thị Hà", username: "halt", email: "halt@company.com", unit: "Marketing", roles: ["User"], status: "active" },
  { id: 12, name: "Nguyễn Thanh Tùng", username: "tungnt", email: "tungnt@company.com", unit: "IT Department", roles: ["Developer", "Tech Lead"], status: "active" },
  { id: 13, name: "Võ Minh Quang", username: "quangvm", email: "quangvm@company.com", unit: "Data Team", roles: ["Data Engineer"], status: "active" },
  { id: 14, name: "Phan Thị Hương", username: "huongpt", email: "huongpt@company.com", unit: "Finance", roles: ["Finance Manager"], status: "active" },
  { id: 15, name: "Đỗ Văn Thành", username: "thanhdv", email: "thanhdv@company.com", unit: "IT Department", roles: ["Security Admin"], status: "active" },
  { id: 16, name: "Lương Thị Ngọc", username: "ngoclt", email: "ngoclt@company.com", unit: "Customer Service", roles: ["Support Lead"], status: "active" },
  { id: 17, name: "Trương Văn Hải", username: "haitv", email: "haitv@company.com", unit: "Operations", roles: ["Ops Manager"], status: "active" },
  { id: 18, name: "Mai Anh Tuấn", username: "tuanma", email: "tuanma@company.com", unit: "Data Team", roles: ["BI Analyst"], status: "active" },
  { id: 19, name: "Hoàng Văn Phúc", username: "phuchv", email: "phuchv@company.com", unit: "IT Department", roles: ["QA Engineer"], status: "inactive" },
  { id: 20, name: "Nguyễn Thị Linh", username: "linhnt", email: "linhnt@company.com", unit: "Legal", roles: ["Legal Advisor"], status: "active" },
  { id: 21, name: "Cao Minh Trí", username: "tricm", email: "tricm@company.com", unit: "Research", roles: ["Researcher"], status: "active" },
  { id: 22, name: "Đinh Thị Thủy", username: "thuydt", email: "thuydt@company.com", unit: "HR Department", roles: ["Recruiter"], status: "active" },
  { id: 23, name: "Lê Hoàng Nam", username: "namlh", email: "namlh@company.com", unit: "IT Department", roles: ["System Admin"], status: "active" },
  { id: 24, name: "Phạm Thị Yến", username: "yenpt", email: "yenpt@company.com", unit: "Marketing", roles: ["Marketing Manager"], status: "active" },
  { id: 25, name: "Nguyễn Đức Minh", username: "minhnd", email: "minhnd@company.com", unit: "Sales", roles: ["Sales Rep"], status: "active" },
];

export function UsersTab() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [unitFilter, setUnitFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleOpenPermissionDialog = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    setIsPermissionDialogOpen(true);
  };

  const handleReset = () => {
    setSearchValue("");
    setUnitFilter("all");
    setStatusFilter("all");
  };

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
        user.status === "active" ? (
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-none bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-200/50">
            Hoạt động
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-slate-100 text-slate-500 hover:bg-slate-200">
            Ngừng hoạt động
          </span>
        )
      ),
    },
    {
      header: "Hành động",
      className: "text-center",
      cell: (user) => (
        <ActionButtonsContainer>
          <ViewButton onClick={() => console.log("View", user.id)} />
          <EditButton onClick={() => console.log("Edit", user.id)} />
          <PermissionButton onClick={() => handleOpenPermissionDialog(user)} />
        </ActionButtonsContainer>
      ),
    },
  ];

  return (
    <>
      <Card className="h-full flex flex-col border-none shadow-none bg-transparent">
        <CardHeader className="flex flex-row items-center justify-between px-0 pt-0 pb-6">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="text-2xl font-bold tracking-tight">Quản lý người dùng</CardTitle>
            <p className="text-sm text-muted-foreground">Quản lý thông tin người dùng và phân quyền trong hệ thống</p>
          </div>
          <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm người dùng
          </Button>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col min-h-0 space-y-4">
          <SearchFilter
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onSearch={() => console.log("Search:", searchValue)}
            onReset={handleReset}
            placeholder="Tìm theo tên, username hoặc email..."
          >
            <Select value={unitFilter} onValueChange={setUnitFilter}>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-background/50 border-border/50 shadow-sm hover:bg-background/80">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </SearchFilter>

          <div className="flex-1 min-h-0">
            <DataTable data={mockUsers} columns={columns} pageSize={8} />
          </div>
        </CardContent>
      </Card>

      <CreateUserPanel open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
      <UserPermissionDialog 
        open={isPermissionDialogOpen} 
        onOpenChange={setIsPermissionDialogOpen} 
        user={selectedUser}
      />
    </>
  );
}
