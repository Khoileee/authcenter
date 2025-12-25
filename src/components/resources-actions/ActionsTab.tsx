import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DataTable, Column } from "@/components/ui/data-table";
import { CreateActionPanel } from "@/components/dialogs/CreateActionDialog";
import { SearchFilter } from "@/components/common/SearchFilter";
import { ViewButton, EditButton, DeleteButton, ActionButtonsContainer } from "@/components/common/ActionButtons";
import { ViewDetailPanel } from "@/components/common/ViewDetailPanel";
import { EditFormPanel, EditFormField } from "@/components/common/EditFormPanel";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const mockActions = [
  { id: 1, code: "view", name: "Xem", group: "CRUD", description: "Xem thông tin chi tiết" },
  { id: 2, code: "create", name: "Tạo mới", group: "CRUD", description: "Tạo mới bản ghi" },
  { id: 3, code: "edit", name: "Sửa", group: "CRUD", description: "Chỉnh sửa thông tin" },
  { id: 4, code: "delete", name: "Xóa", group: "CRUD", description: "Xóa bản ghi" },
  { id: 5, code: "approve", name: "Phê duyệt", group: "Workflow", description: "Phê duyệt yêu cầu" },
  { id: 6, code: "reject", name: "Từ chối", group: "Workflow", description: "Từ chối yêu cầu" },
  { id: 7, code: "submit", name: "Gửi duyệt", group: "Workflow", description: "Gửi yêu cầu để phê duyệt" },
  { id: 8, code: "upload_rule", name: "Upload Rule", group: "Admin", description: "Tải lên quy tắc mới" },
  { id: 9, code: "export", name: "Xuất dữ liệu", group: "Data", description: "Xuất dữ liệu ra file" },
  { id: 10, code: "import", name: "Nhập dữ liệu", group: "Data", description: "Nhập dữ liệu từ file" },
  { id: 11, code: "assign", name: "Giao việc", group: "Workflow", description: "Giao việc cho người khác" },
  { id: 12, code: "execute", name: "Thực thi", group: "System", description: "Thực thi tác vụ hệ thống" },
  { id: 13, code: "configure", name: "Cấu hình", group: "Admin", description: "Cấu hình hệ thống" },
  { id: 14, code: "audit", name: "Kiểm toán", group: "Security", description: "Xem lịch sử thao tác" },
  { id: 15, code: "manage_users", name: "Quản lý người dùng", group: "Admin", description: "Quản lý tài khoản người dùng" },
];

export function ActionsTab() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<typeof mockActions[0] | null>(null);
  const [editFormData, setEditFormData] = useState({ code: "", name: "", group: "", description: "" });
  const [searchValue, setSearchValue] = useState("");

  const handleView = (action: typeof mockActions[0]) => {
    setSelectedAction(action);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (action: typeof mockActions[0]) => {
    setSelectedAction(action);
    setEditFormData({ code: action.code, name: action.name, group: action.group, description: action.description });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (action: typeof mockActions[0]) => {
    setSelectedAction(action);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    toast({ title: "Đã xóa hành động", description: `Hành động "${selectedAction?.name}" đã được xóa thành công.` });
    setIsDeleteDialogOpen(false);
    setSelectedAction(null);
  };

  const handleSaveEdit = () => {
    toast({ title: "Đã cập nhật", description: `Hành động "${editFormData.name}" đã được cập nhật.` });
    setIsEditDialogOpen(false);
    setSelectedAction(null);
  };

  const handleReset = () => {
    setSearchValue("");
  };

  const editFields: EditFormField[] = [
    { name: "code", label: "Mã hành động", type: "text", value: editFormData.code, required: true, disabled: true },
    { name: "name", label: "Tên hiển thị", type: "text", value: editFormData.name, required: true },
    { name: "group", label: "Nhóm", type: "select", value: editFormData.group, required: true, options: [
      { value: "CRUD", label: "CRUD" },
      { value: "Workflow", label: "Workflow" },
      { value: "Admin", label: "Admin" },
      { value: "Data", label: "Data" },
      { value: "System", label: "System" },
      { value: "Security", label: "Security" },
    ]},
    { name: "description", label: "Mô tả", type: "textarea", value: editFormData.description },
  ];

  const columns: Column<typeof mockActions[0]>[] = [
    { header: "Mã hành động", accessorKey: "code", className: "font-mono text-sm text-primary" },
    { header: "Tên hiển thị", accessorKey: "name", className: "font-medium" },
    { header: "Nhóm", accessorKey: "group", className: "text-muted-foreground" },
    { header: "Mô tả", accessorKey: "description", className: "text-muted-foreground" },
    {
      header: "Hành động",
      className: "text-center",
      cell: (action) => (
        <ActionButtonsContainer>
          <ViewButton onClick={() => handleView(action)} />
          <EditButton onClick={() => handleEdit(action)} />
          <DeleteButton onClick={() => handleDelete(action)} />
        </ActionButtonsContainer>
      ),
    },
  ];

  return (
    <>
      <Card className="h-full flex flex-col border-none shadow-none bg-transparent">
        <CardHeader className="flex flex-row items-center justify-between px-0 pt-0 pb-6">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="text-2xl font-bold tracking-tight">Danh sách hành động</CardTitle>
            <p className="text-sm text-muted-foreground">Quản lý các hành động có thể phân quyền trong hệ thống</p>
          </div>
          <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm hành động
          </Button>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col min-h-0 space-y-4">
          <SearchFilter
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onSearch={() => console.log("Search:", searchValue)}
            onReset={handleReset}
            placeholder="Tìm kiếm hành động..."
          />

          <div className="flex-1 min-h-0">
            <DataTable data={mockActions} columns={columns} pageSize={10} />
          </div>
        </CardContent>
      </Card>

      <CreateActionPanel open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />

      {/* View Detail Panel */}
      <ViewDetailPanel
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        title={selectedAction?.name || ""}
        description="Thông tin chi tiết hành động"
        fields={selectedAction ? [
          { label: "Mã hành động", value: <code className="font-mono text-sm text-primary">{selectedAction.code}</code> },
          { label: "Tên hiển thị", value: selectedAction.name },
          { label: "Nhóm", value: selectedAction.group },
          { label: "Mô tả", value: selectedAction.description },
        ] : []}
      />

      {/* Edit Panel */}
      <EditFormPanel
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Chỉnh sửa hành động"
        description="Cập nhật thông tin hành động trong hệ thống"
        fields={editFields}
        onFieldChange={(name, value) => setEditFormData(prev => ({ ...prev, [name]: value }))}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Xóa hành động"
        description="Bạn có chắc chắn muốn xóa hành động này? Các quyền sử dụng hành động này sẽ bị ảnh hưởng."
        itemName={selectedAction?.name}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
