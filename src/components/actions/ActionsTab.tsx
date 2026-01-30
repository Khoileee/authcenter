import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DataTable, Column } from "@/components/ui/data-table";
import { SearchFilter } from "@/components/common/SearchFilter";
import { ViewButton, EditButton, DeleteButton, ActionButtonsContainer } from "@/components/common/ActionButtons";
import { ViewDetailPanel } from "@/components/common/ViewDetailPanel";
import { EditFormPanel, EditFormField } from "@/components/common/EditFormPanel";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ActionDefinition, SYSTEM_ACTIONS, ACTION_CATEGORIES, ACTION_ICONS } from "@/data/actions";

// Use shared type
type Action = ActionDefinition;

const categoryOptions = ACTION_CATEGORIES;
const iconOptions = ACTION_ICONS;

export function ActionsTab() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [actions, setActions] = useState<Action[]>(SYSTEM_ACTIONS);

  // Create form state
  const [createForm, setCreateForm] = useState({
    code: "",
    name: "",
    description: "",
    category: "",
    icon: "Plus",
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    code: "",
    name: "",
    description: "",
    category: "",
    icon: "",
  });

  const handleView = (action: Action) => {
    setSelectedAction(action);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (action: Action) => {
    setSelectedAction(action);
    setEditForm({
      code: action.code,
      name: action.name,
      description: action.description,
      category: action.category,
      icon: action.icon,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (action: Action) => {
    setSelectedAction(action);
    setIsDeleteDialogOpen(true);
  };

  const handleStatusToggle = (action: Action, checked: boolean) => {
    setActions(prev => prev.map(a => 
      a.id === action.id ? { ...a, status: checked ? "active" : "inactive" } : a
    ));
    toast({
      title: checked ? "Đã kích hoạt" : "Đã vô hiệu hóa",
      description: `Hành động "${action.name}" đã được ${checked ? "kích hoạt" : "vô hiệu hóa"}.`,
    });
  };

  const handleCreateSubmit = () => {
    const newAction: Action = {
      id: Math.max(...actions.map(a => a.id)) + 1,
      code: createForm.code,
      name: createForm.name,
      description: createForm.description,
      category: createForm.category,
      icon: createForm.icon,
      status: "active",
      usageCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setActions(prev => [...prev, newAction]);
    setIsCreateDialogOpen(false);
    setCreateForm({ code: "", name: "", description: "", category: "", icon: "Plus" });
    toast({
      title: "Tạo thành công",
      description: `Hành động "${newAction.name}" đã được tạo.`,
    });
  };

  const handleEditSubmit = () => {
    if (!selectedAction) return;
    setActions(prev => prev.map(a => 
      a.id === selectedAction.id ? { ...a, ...editForm } : a
    ));
    setIsEditDialogOpen(false);
    toast({
      title: "Cập nhật thành công",
      description: `Hành động "${editForm.name}" đã được cập nhật.`,
    });
  };

  const handleDeleteConfirm = () => {
    if (!selectedAction) return;
    setActions(prev => prev.filter(a => a.id !== selectedAction.id));
    setIsDeleteDialogOpen(false);
    toast({
      title: "Đã xóa",
      description: `Hành động "${selectedAction.name}" đã được xóa.`,
    });
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "CRUD": return "bg-blue-100 text-blue-800";
      case "List": return "bg-purple-100 text-purple-800";
      case "Workflow": return "bg-orange-100 text-orange-800";
      case "Execute": return "bg-green-100 text-green-800";
      case "Data": return "bg-cyan-100 text-cyan-800";
      case "Collaborate": return "bg-pink-100 text-pink-800";
      case "Admin": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const columns: Column<Action>[] = [
    {
      header: "Mã hành động",
      accessorKey: "code",
      cell: (action) => (
        <code className="px-2 py-1 bg-muted rounded text-sm font-mono">{action.code}</code>
      ),
    },
    {
      header: "Tên hành động",
      accessorKey: "name",
    },
    {
      header: "Nhóm",
      accessorKey: "category",
      cell: (action) => (
        <Badge variant="outline" className={getCategoryBadgeColor(action.category)}>
          {action.category}
        </Badge>
      ),
    },
    {
      header: "Mô tả",
      accessorKey: "description",
      cell: (action) => (
        <span className="text-sm text-muted-foreground line-clamp-1">{action.description}</span>
      ),
    },
    {
      header: "Số lần sử dụng",
      accessorKey: "usageCount",
      cell: (action) => (
        <span className="text-sm">{action.usageCount} resources</span>
      ),
    },
    {
      header: "Trạng thái",
      cell: (action) => (
        <Switch
          checked={action.status === "active"}
          onCheckedChange={(checked) => handleStatusToggle(action, checked)}
        />
      ),
    },
    {
      header: "Thao tác",
      cell: (action) => (
        <ActionButtonsContainer>
          <ViewButton onClick={() => handleView(action)} />
          <EditButton onClick={() => handleEdit(action)} />
          <DeleteButton onClick={() => handleDelete(action)} />
        </ActionButtonsContainer>
      ),
    },
  ];

  const filteredActions = actions.filter(action =>
    action.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    action.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    action.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReset = () => {
    setSearchTerm("");
  };

  // Edit form fields for EditFormPanel
  const editFields: EditFormField[] = [
    { name: "code", label: "Mã hành động", type: "text", value: editForm.code, required: true },
    { name: "name", label: "Tên hành động", type: "text", value: editForm.name, required: true },
    { name: "category", label: "Nhóm", type: "select", value: editForm.category, required: true, options: categoryOptions },
    { name: "icon", label: "Icon", type: "select", value: editForm.icon, options: iconOptions.map(i => ({ value: i, label: i })) },
    { name: "description", label: "Mô tả", type: "textarea", value: editForm.description },
  ];

  return (
    <>
      <Card className="h-full flex flex-col border-none shadow-none bg-transparent">
        <CardHeader className="flex flex-row items-center justify-between px-0 pt-0 pb-6">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="text-2xl font-bold tracking-tight">Danh sách hành động</CardTitle>
            <p className="text-sm text-muted-foreground">Khai báo các hành động (actions) chuẩn để sử dụng trong phân quyền</p>
          </div>
          <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm hành động
          </Button>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col min-h-0 space-y-4">
          <SearchFilter
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            onSearch={() => {}}
            onReset={handleReset}
            placeholder="Tìm kiếm theo mã, tên hoặc nhóm hành động..."
          />

          <div className="flex-1 min-h-0">
            <DataTable data={filteredActions} columns={columns} pageSize={10} />
          </div>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Sheet open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Thêm hành động mới</SheetTitle>
            <SheetDescription>
              Khai báo một hành động mới để sử dụng trong phân quyền.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-code">Mã hành động <span className="text-red-500">*</span></Label>
              <Input
                id="create-code"
                placeholder="VD: create, read, approve..."
                value={createForm.code}
                onChange={(e) => setCreateForm(prev => ({ ...prev, code: e.target.value.toLowerCase().replace(/\s+/g, '_') }))}
              />
              <p className="text-xs text-muted-foreground">Chỉ chữ thường và dấu gạch dưới, không dấu cách</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-name">Tên hành động <span className="text-red-500">*</span></Label>
              <Input
                id="create-name"
                placeholder="VD: Tạo mới, Xem, Phê duyệt..."
                value={createForm.name}
                onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-category">Nhóm <span className="text-red-500">*</span></Label>
              <Select
                value={createForm.category}
                onValueChange={(value) => setCreateForm(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhóm hành động" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-icon">Icon</Label>
              <Select
                value={createForm.icon}
                onValueChange={(value) => setCreateForm(prev => ({ ...prev, icon: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn icon" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-description">Mô tả</Label>
              <Textarea
                id="create-description"
                placeholder="Mô tả chi tiết hành động..."
                value={createForm.description}
                onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Hủy</Button>
            <Button 
              onClick={handleCreateSubmit}
              disabled={!createForm.code || !createForm.name || !createForm.category}
            >
              Tạo hành động
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View Detail Panel */}
      <ViewDetailPanel
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        title={selectedAction?.name || ""}
        description="Thông tin chi tiết hành động"
        badges={selectedAction ? [{ label: selectedAction.status === "active" ? "Active" : "Inactive", variant: selectedAction.status === "active" ? "success" : "secondary" }] : []}
        fields={selectedAction ? [
          { label: "Mã hành động", value: <code className="font-mono text-sm text-primary">{selectedAction.code}</code> },
          { label: "Tên hành động", value: selectedAction.name },
          { label: "Nhóm", value: <Badge variant="outline" className={getCategoryBadgeColor(selectedAction.category)}>{selectedAction.category}</Badge> },
          { label: "Icon", value: selectedAction.icon },
          { label: "Mô tả", value: selectedAction.description },
          { label: "Số lần sử dụng", value: `${selectedAction.usageCount} resources` },
          { label: "Ngày tạo", value: selectedAction.createdAt },
        ] : []}
      />

      {/* Edit Panel */}
      <EditFormPanel
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Chỉnh sửa hành động"
        description="Cập nhật thông tin hành động trong hệ thống"
        fields={editFields}
        onFieldChange={(name, value) => setEditForm(prev => ({ ...prev, [name]: value }))}
        onSave={handleEditSubmit}
      />

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Xóa hành động"
        description="Bạn có chắc chắn muốn xóa hành động này? Các quyền liên quan đến hành động này cũng sẽ bị ảnh hưởng."
        itemName={selectedAction?.name}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
