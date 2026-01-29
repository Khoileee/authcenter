import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DataTable, Column } from "@/components/ui/data-table";
import { CreateResourcePanel } from "@/components/dialogs/CreateResourceDialog";
import { SearchFilter } from "@/components/common/SearchFilter";
import { ViewButton, EditButton, DeleteButton, ActionButtonsContainer } from "@/components/common/ActionButtons";
import { ViewDetailPanel } from "@/components/common/ViewDetailPanel";
import { EditFormPanel, EditFormField } from "@/components/common/EditFormPanel";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const mockResources = [
  // SQLWF - SQL Workflow
  { id: 1, systemCode: "SQLWF", system: "SQL Workflow", code: "menu.table_mgmt", name: "Quản lý bảng", type: "UI Menu", featureGroup: "Data Management", status: "active" },
  { id: 2, systemCode: "SQLWF", system: "SQL Workflow", code: "menu.sql_mgmt", name: "Quản lý SQL", type: "UI Menu", featureGroup: "Data Management", status: "active" },
  { id: 3, systemCode: "SQLWF", system: "SQL Workflow", code: "api.sql.execute", name: "Execute SQL API", type: "API Endpoint", featureGroup: "SQL Engine", status: "active" },
  { id: 4, systemCode: "SQLWF", system: "SQL Workflow", code: "feature.job.create", name: "Tạo Job", type: "Business Entity", featureGroup: "Job Management", status: "active" },
  { id: 5, systemCode: "SQLWF", system: "SQL Workflow", code: "feature.job.execute", name: "Chạy Job", type: "Business Entity", featureGroup: "Job Management", status: "active" },
  // vDVS - Viettel Data Virtualization
  { id: 6, systemCode: "vDVS", system: "Viettel Data Virtualization", code: "menu.data_catalog", name: "Data Catalog", type: "UI Menu", featureGroup: "Data Catalog", status: "active" },
  { id: 7, systemCode: "vDVS", system: "Viettel Data Virtualization", code: "menu.data_lineage", name: "Data Lineage", type: "UI Menu", featureGroup: "Data Governance", status: "active" },
  { id: 8, systemCode: "vDVS", system: "Viettel Data Virtualization", code: "api.metadata.sync", name: "Sync Metadata API", type: "API Endpoint", featureGroup: "Integration", status: "active" },
  { id: 9, systemCode: "vDVS", system: "Viettel Data Virtualization", code: "feature.glossary.manage", name: "Quản lý Glossary", type: "Business Entity", featureGroup: "Data Governance", status: "active" },
  // VTM - Viettel Ticket Management
  { id: 10, systemCode: "VTM", system: "Viettel Ticket Management", code: "menu.ticket", name: "Quản lý Ticket", type: "UI Menu", featureGroup: "Ticket", status: "active" },
  { id: 11, systemCode: "VTM", system: "Viettel Ticket Management", code: "feature.ticket.create", name: "Tạo Ticket", type: "Business Entity", featureGroup: "Ticket", status: "active" },
  { id: 12, systemCode: "VTM", system: "Viettel Ticket Management", code: "feature.ticket.assign", name: "Assign Ticket", type: "Business Entity", featureGroup: "Ticket", status: "active" },
  { id: 13, systemCode: "VTM", system: "Viettel Ticket Management", code: "api.ticket.export", name: "Export Ticket API", type: "API Endpoint", featureGroup: "Ticket", status: "active" },
  // DQ - Data Quality Platform
  { id: 14, systemCode: "DQ", system: "Data Quality Platform", code: "menu.dq_rules", name: "Quản lý DQ Rules", type: "UI Menu", featureGroup: "Data Quality", status: "active" },
  { id: 15, systemCode: "DQ", system: "Data Quality Platform", code: "menu.dq_reports", name: "Báo cáo DQ", type: "UI Menu", featureGroup: "Data Quality", status: "active" },
  { id: 16, systemCode: "DQ", system: "Data Quality Platform", code: "api.dq.execute_rule", name: "Execute DQ Rule API", type: "API Endpoint", featureGroup: "Data Quality", status: "active" },
  { id: 17, systemCode: "DQ", system: "Data Quality Platform", code: "feature.dq.create_rule", name: "Tạo DQ Rule", type: "Business Entity", featureGroup: "Data Quality", status: "active" },
  // ANALYTICS - Analytics Dashboard
  { id: 18, systemCode: "ANALYTICS", system: "Analytics Dashboard", code: "menu.dashboard", name: "Dashboard", type: "UI Menu", featureGroup: "Analytics", status: "active" },
  { id: 19, systemCode: "ANALYTICS", system: "Analytics Dashboard", code: "menu.reports", name: "Reports", type: "UI Menu", featureGroup: "Analytics", status: "active" },
  { id: 20, systemCode: "ANALYTICS", system: "Analytics Dashboard", code: "feature.report.create", name: "Tạo Report", type: "Business Entity", featureGroup: "Analytics", status: "active" },
  { id: 21, systemCode: "ANALYTICS", system: "Analytics Dashboard", code: "api.report.export", name: "Export Report API", type: "API Endpoint", featureGroup: "Analytics", status: "active" },
];

export function ResourcesTab() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<typeof mockResources[0] | null>(null);
  const [editFormData, setEditFormData] = useState({ name: "", code: "", system: "", type: "", featureGroup: "" });
  const [searchValue, setSearchValue] = useState("");

  const handleView = (resource: typeof mockResources[0]) => {
    setSelectedResource(resource);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (resource: typeof mockResources[0]) => {
    setSelectedResource(resource);
    setEditFormData({ 
      name: resource.name, 
      code: resource.code, 
      system: resource.system, 
      type: resource.type, 
      featureGroup: resource.featureGroup 
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (resource: typeof mockResources[0]) => {
    setSelectedResource(resource);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    toast({ title: "Đã xóa tài nguyên", description: `Tài nguyên "${selectedResource?.name}" đã được xóa thành công.` });
    setIsDeleteDialogOpen(false);
    setSelectedResource(null);
  };

  const handleSaveEdit = () => {
    toast({ title: "Đã cập nhật", description: `Tài nguyên "${editFormData.name}" đã được cập nhật.` });
    setIsEditDialogOpen(false);
    setSelectedResource(null);
  };

  const handleReset = () => {
    setSearchValue("");
  };

  const editFields: EditFormField[] = [
    { name: "code", label: "Mã tài nguyên", type: "text", value: editFormData.code, required: true, disabled: true },
    { name: "name", label: "Tên hiển thị", type: "text", value: editFormData.name, required: true },
    { name: "system", label: "Hệ thống", type: "select", value: editFormData.system, required: true, options: [
      { value: "SQLWF", label: "SQL Workflow" },
      { value: "vDVS", label: "Viettel Data Virtualization" },
      { value: "VTM", label: "Viettel Ticket Management" },
      { value: "DQ", label: "Data Quality Platform" },
      { value: "ANALYTICS", label: "Analytics Dashboard" },
    ]},
    { name: "type", label: "Loại", type: "select", value: editFormData.type, required: true, options: [
      { value: "Business Entity", label: "Business Entity" },
      { value: "UI Menu", label: "UI Menu" },
      { value: "API Endpoint", label: "API Endpoint" },
    ]},
    { name: "featureGroup", label: "Nhóm tính năng", type: "text", value: editFormData.featureGroup },
  ];

  const columns: Column<typeof mockResources[0]>[] = [
    { 
      header: "Hệ thống", 
      accessorKey: "systemCode",
      cell: (resource) => (
        <span className="font-mono text-sm font-medium text-primary">{resource.systemCode}</span>
      ),
    },
    { 
      header: "Mã tài nguyên", 
      accessorKey: "code", 
      className: "font-mono text-sm"
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
        <Switch
          checked={resource.status === "active"}
          onCheckedChange={() => {
            toast({ title: "Cập nhật trạng thái", description: `Trạng thái tài nguyên "${resource.name}" đã được thay đổi.` });
          }}
        />
      ),
    },
    {
      header: "Hành động",
      className: "text-center",
      cell: (resource) => (
        <ActionButtonsContainer>
          <ViewButton onClick={() => handleView(resource)} />
          <EditButton onClick={() => handleEdit(resource)} />
          <DeleteButton onClick={() => handleDelete(resource)} />
        </ActionButtonsContainer>
      ),
    },
  ];

  return (
    <>
      <Card className="h-full flex flex-col border-none shadow-none bg-transparent">
        <CardHeader className="flex flex-row items-center justify-between px-0 pt-0 pb-6">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="text-2xl font-bold tracking-tight">Danh sách tài nguyên</CardTitle>
            <p className="text-sm text-muted-foreground">Quản lý các tài nguyên cần phân quyền trong hệ thống</p>
          </div>
          <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm tài nguyên
          </Button>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col min-h-0 space-y-4">
          <SearchFilter
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onSearch={() => console.log("Search:", searchValue)}
            onReset={handleReset}
            placeholder="Tìm kiếm theo mã hoặc tên tài nguyên..."
          />

          <div className="flex-1 min-h-0">
            <DataTable data={mockResources} columns={columns} pageSize={10} />
          </div>
        </CardContent>
      </Card>

      <CreateResourcePanel open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />

      {/* View Detail Panel */}
      <ViewDetailPanel
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        title={selectedResource?.name || ""}
        description="Thông tin chi tiết tài nguyên"
        badges={selectedResource ? [{ label: selectedResource.status === "active" ? "Active" : "Inactive", variant: selectedResource.status === "active" ? "success" : "secondary" }] : []}
        fields={selectedResource ? [
          { label: "Hệ thống", value: selectedResource.system },
          { label: "Mã tài nguyên", value: <code className="font-mono text-sm text-primary">{selectedResource.code}</code> },
          { label: "Tên hiển thị", value: selectedResource.name },
          { label: "Loại", value: <Badge variant="outline">{selectedResource.type}</Badge> },
          { label: "Nhóm tính năng", value: selectedResource.featureGroup },
          { label: "Trạng thái", value: selectedResource.status === "active" ? "Active" : "Inactive" },
        ] : []}
      />

      {/* Edit Panel */}
      <EditFormPanel
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Chỉnh sửa tài nguyên"
        description="Cập nhật thông tin tài nguyên trong hệ thống"
        fields={editFields}
        onFieldChange={(name, value) => setEditFormData(prev => ({ ...prev, [name]: value }))}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Xóa tài nguyên"
        description="Bạn có chắc chắn muốn xóa tài nguyên này? Các quyền liên quan đến tài nguyên này cũng sẽ bị xóa."
        itemName={selectedResource?.name}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
