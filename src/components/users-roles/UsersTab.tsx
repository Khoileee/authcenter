import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, Column } from "@/components/ui/data-table";
import { CreateUserPanel } from "@/components/dialogs/CreateUserDialog";
import { UserPermissionDialog } from "@/components/dialogs/UserPermissionDialog";
import { SearchFilter } from "@/components/common/SearchFilter";
import { ViewButton, EditButton, DeleteButton, PermissionButton, ActionButtonsContainer } from "@/components/common/ActionButtons";
import { ViewDetailPanel } from "@/components/common/ViewDetailPanel";
import { EditFormPanel, EditFormField } from "@/components/common/EditFormPanel";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const mockUsers = [
  { id: 1, employeeId: "NV001", name: "Nguyễn Văn An", username: "annv", email: "annv@company.com", phone: "0901234567", unit: "IT Department", position: "IT Manager", roles: ["Admin", "Manager"], ipAddresses: ["192.168.1.10", "10.0.0.5"], status: "active" },
  { id: 2, employeeId: "NV002", name: "Trần Thị Bình", username: "binhtt", email: "binhtt@company.com", phone: "0902345678", unit: "HR Department", position: "HR Director", roles: ["HR Manager"], ipAddresses: ["192.168.1.20"], status: "active" },
  { id: 3, employeeId: "NV003", name: "Lê Nhật Khôi", username: "khoiln1", email: "khoiln1@company.com", phone: "0903456789", unit: "Data Team", position: "Senior Data Analyst", roles: ["Data Analyst", "DQ Admin"], ipAddresses: ["192.168.1.30", "10.0.0.15"], status: "active" },
  { id: 4, employeeId: "NV004", name: "Phạm Minh Đức", username: "ducpm", email: "ducpm@company.com", phone: "0904567890", unit: "IT Department", position: "Developer", roles: ["Developer"], ipAddresses: ["192.168.1.40"], status: "inactive" },
  { id: 5, employeeId: "NV005", name: "Hoàng Thu Thảo", username: "thaoht", email: "thaoht@company.com", phone: "0905678901", unit: "Marketing", position: "Marketing Staff", roles: ["User"], ipAddresses: [], status: "active" },
  { id: 6, employeeId: "NV006", name: "Vũ Tuấn Anh", username: "anhvt", email: "anhvt@company.com", phone: "0906789012", unit: "Sales", position: "Sales Director", roles: ["Sales Manager"], ipAddresses: ["192.168.2.10"], status: "active" },
  { id: 7, employeeId: "NV007", name: "Đặng Thị Mai", username: "maidt", email: "maidt@company.com", phone: "0907890123", unit: "HR Department", position: "HR Staff", roles: ["User"], ipAddresses: [], status: "active" },
  { id: 8, employeeId: "NV008", name: "Ngô Văn Hùng", username: "hungnv", email: "hungnv@company.com", phone: "0908901234", unit: "IT Department", position: "DevOps Engineer", roles: ["DevOps", "SRE"], ipAddresses: ["192.168.1.50", "10.0.0.25", "172.16.0.5"], status: "active" },
  { id: 9, employeeId: "NV009", name: "Bùi Thị Lan", username: "lanbt", email: "lanbt@company.com", phone: "0909012345", unit: "Finance", position: "Accountant", roles: ["Accountant"], ipAddresses: ["192.168.3.10"], status: "inactive" },
  { id: 10, employeeId: "NV010", name: "Trịnh Quốc Bảo", username: "baotq", email: "baotq@company.com", phone: "0910123456", unit: "Board", position: "Director", roles: ["Admin", "Auditor"], ipAddresses: ["192.168.0.1"], status: "active" },
  { id: 11, employeeId: "NV011", name: "Lý Thị Hà", username: "halt", email: "halt@company.com", phone: "0911234567", unit: "Marketing", position: "Marketing Staff", roles: ["User"], ipAddresses: [], status: "active" },
  { id: 12, employeeId: "NV012", name: "Nguyễn Thanh Tùng", username: "tungnt", email: "tungnt@company.com", phone: "0912345678", unit: "IT Department", position: "Tech Lead", roles: ["Developer", "Tech Lead"], ipAddresses: ["192.168.1.60"], status: "active" },
  { id: 13, employeeId: "NV013", name: "Võ Minh Quang", username: "quangvm", email: "quangvm@company.com", phone: "0913456789", unit: "Data Team", position: "Data Engineer", roles: ["Data Engineer"], ipAddresses: ["192.168.1.35"], status: "active" },
  { id: 14, employeeId: "NV014", name: "Phan Thị Hương", username: "huongpt", email: "huongpt@company.com", phone: "0914567890", unit: "Finance", position: "Finance Manager", roles: ["Finance Manager"], ipAddresses: ["192.168.3.20"], status: "active" },
  { id: 15, employeeId: "NV015", name: "Đỗ Văn Thành", username: "thanhdv", email: "thanhdv@company.com", phone: "0915678901", unit: "IT Department", position: "Security Admin", roles: ["Security Admin"], ipAddresses: ["192.168.1.5", "10.0.0.2"], status: "active" },
  { id: 16, employeeId: "NV016", name: "Lương Thị Ngọc", username: "ngoclt", email: "ngoclt@company.com", phone: "0916789012", unit: "Customer Service", position: "Support Lead", roles: ["Support Lead"], ipAddresses: ["192.168.4.10"], status: "active" },
  { id: 17, employeeId: "NV017", name: "Trương Văn Hải", username: "haitv", email: "haitv@company.com", phone: "0917890123", unit: "Operations", position: "Ops Manager", roles: ["Ops Manager"], ipAddresses: ["192.168.5.10"], status: "active" },
  { id: 18, employeeId: "NV018", name: "Mai Anh Tuấn", username: "tuanma", email: "tuanma@company.com", phone: "0918901234", unit: "Data Team", position: "BI Analyst", roles: ["BI Analyst"], ipAddresses: ["192.168.1.38"], status: "active" },
  { id: 19, employeeId: "NV019", name: "Hoàng Văn Phúc", username: "phuchv", email: "phuchv@company.com", phone: "0919012345", unit: "IT Department", position: "QA Engineer", roles: ["QA Engineer"], ipAddresses: ["192.168.1.70"], status: "inactive" },
  { id: 20, employeeId: "NV020", name: "Nguyễn Thị Linh", username: "linhnt", email: "linhnt@company.com", phone: "0920123456", unit: "Legal", position: "Legal Advisor", roles: ["Legal Advisor"], ipAddresses: ["192.168.6.10"], status: "active" },
  { id: 21, employeeId: "", name: "Cao Minh Trí", username: "tricm", email: "tricm@company.com", phone: "0921234567", unit: "Research", position: "Researcher", roles: ["Researcher"], ipAddresses: [], status: "active" },
  { id: 22, employeeId: "NV022", name: "Đinh Thị Thủy", username: "thuydt", email: "thuydt@company.com", phone: "0922345678", unit: "HR Department", position: "Recruiter", roles: ["Recruiter"], ipAddresses: ["192.168.1.25"], status: "active" },
  { id: 23, employeeId: "NV023", name: "Lê Hoàng Nam", username: "namlh", email: "namlh@company.com", phone: "0923456789", unit: "IT Department", position: "System Admin", roles: ["System Admin"], ipAddresses: ["192.168.1.2", "10.0.0.1"], status: "active" },
  { id: 24, employeeId: "NV024", name: "Phạm Thị Yến", username: "yenpt", email: "yenpt@company.com", phone: "0924567890", unit: "Marketing", position: "Marketing Manager", roles: ["Marketing Manager"], ipAddresses: ["192.168.2.20"], status: "active" },
  { id: 25, employeeId: "NV025", name: "Nguyễn Đức Minh", username: "minhnd", email: "minhnd@company.com", phone: "0925678901", unit: "Sales", position: "Sales Rep", roles: ["Sales Rep"], ipAddresses: [], status: "active" },
];

export function UsersTab() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [editFormData, setEditFormData] = useState({ employeeId: "", name: "", username: "", email: "", phone: "", unit: "", position: "", status: "active" });
  const [searchValue, setSearchValue] = useState("");
  const [unitFilter, setUnitFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleOpenPermissionDialog = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    setIsPermissionDialogOpen(true);
  };

  const handleView = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    setEditFormData({ 
      employeeId: user.employeeId, 
      name: user.name, 
      username: user.username, 
      email: user.email, 
      phone: user.phone,
      unit: user.unit,
      position: user.position,
      status: user.status
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    toast({ title: "Đã xóa người dùng", description: `Người dùng "${selectedUser?.name}" đã được xóa thành công.` });
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleSaveEdit = () => {
    toast({ title: "Đã cập nhật", description: `Thông tin người dùng "${editFormData.name}" đã được cập nhật.` });
    setIsEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handleReset = () => {
    setSearchValue("");
    setUnitFilter("all");
    setStatusFilter("all");
  };

  const unitOptions = [
    { value: "IT Department", label: "IT Department" },
    { value: "HR Department", label: "HR Department" },
    { value: "Data Team", label: "Data Team" },
    { value: "Marketing", label: "Marketing" },
    { value: "Sales", label: "Sales" },
    { value: "Finance", label: "Finance" },
    { value: "Operations", label: "Operations" },
    { value: "Customer Service", label: "Customer Service" },
    { value: "Legal", label: "Legal" },
    { value: "Research", label: "Research" },
    { value: "Board", label: "Board" },
  ];

  const editFields: EditFormField[] = [
    { name: "employeeId", label: "Mã nhân viên", type: "text", value: editFormData.employeeId, disabled: true },
    { name: "name", label: "Họ tên", type: "text", value: editFormData.name, required: true },
    { name: "username", label: "Username", type: "text", value: editFormData.username, required: true, disabled: true, description: "Username phải khớp với tài khoản SSO" },
    { name: "email", label: "Email", type: "email", value: editFormData.email, required: true },
    { name: "phone", label: "Số điện thoại", type: "text", value: editFormData.phone },
    { name: "unit", label: "Đơn vị", type: "select", value: editFormData.unit, required: true, options: unitOptions },
    { name: "position", label: "Vị trí / Chức danh", type: "text", value: editFormData.position },
    { name: "status", label: "Trạng thái", type: "select", value: editFormData.status, required: true, options: [
      { value: "active", label: "Hoạt động" },
      { value: "inactive", label: "Ngừng hoạt động" },
    ]},
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
        <Switch
          checked={user.status === "active"}
          onCheckedChange={() => {
            toast({ title: "Cập nhật trạng thái", description: `Trạng thái người dùng "${user.name}" đã được thay đổi.` });
          }}
        />
      ),
    },
    {
      header: "Hành động",
      className: "text-center",
      cell: (user) => (
        <ActionButtonsContainer>
          <ViewButton onClick={() => handleView(user)} />
          <EditButton onClick={() => handleEdit(user)} />
          <DeleteButton onClick={() => handleDelete(user)} />
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
            <CardTitle className="text-2xl font-bold tracking-tight">Danh sách người dùng</CardTitle>
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

      {/* View Detail Panel */}
      <ViewDetailPanel
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        title={selectedUser?.name || ""}
        description="Thông tin chi tiết người dùng"
        badges={selectedUser ? [{ label: selectedUser.status === "active" ? "Hoạt động" : "Ngừng hoạt động", variant: selectedUser.status === "active" ? "success" : "secondary" }] : []}
        fields={selectedUser ? [
          { label: "Mã nhân viên", value: selectedUser.employeeId || "Chưa có" },
          { label: "Username", value: selectedUser.username },
          { label: "Email", value: selectedUser.email },
          { label: "Số điện thoại", value: selectedUser.phone || "Chưa có" },
          { label: "Đơn vị", value: selectedUser.unit },
          { label: "Vị trí / Chức danh", value: selectedUser.position || "Chưa có" },
          { label: "Vai trò", value: <div className="flex gap-1 flex-wrap">{selectedUser.roles.map(r => <Badge key={r} variant="secondary" className="font-normal">{r}</Badge>)}</div> },
          { label: "IP Address", value: selectedUser.ipAddresses.length > 0 
            ? <div className="flex gap-1 flex-wrap">{selectedUser.ipAddresses.map(ip => <Badge key={ip} variant="outline" className="font-mono text-xs">{ip}</Badge>)}</div>
            : "Không giới hạn" },
          { label: "Trạng thái", value: selectedUser.status === "active" ? "Hoạt động" : "Ngừng hoạt động" },
        ] : []}
      />

      {/* Edit Panel */}
      <EditFormPanel
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Chỉnh sửa người dùng"
        description="Cập nhật thông tin người dùng trong hệ thống"
        fields={editFields}
        onFieldChange={(name, value) => setEditFormData(prev => ({ ...prev, [name]: value }))}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Xóa người dùng"
        description="Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác."
        itemName={selectedUser?.name}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
