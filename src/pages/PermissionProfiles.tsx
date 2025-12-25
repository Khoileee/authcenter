import React, { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateProfileDialog } from "@/components/dialogs/CreateProfileDialog";
import { SearchFilter } from "@/components/common/SearchFilter";
import { ViewButton, EditButton, CopyButton, DeleteButton, ActionButtonsContainer } from "@/components/common/ActionButtons";

// Mock data
const mockProfiles = [
  { id: 1, name: "BDA - TTPTDL", appliedFor: "Đơn vị = TTPTDL; Vai trò = BDA", systemPermCount: 12, dataPermCount: 8, status: "active" },
  { id: 2, name: "Admin Full Access", appliedFor: "Vai trò = Admin", systemPermCount: 45, dataPermCount: 20, status: "active" },
  { id: 3, name: "DQ Viewer", appliedFor: "Đơn vị = TTPTDL; Vai trò = Viewer", systemPermCount: 5, dataPermCount: 3, status: "inactive" },
  { id: 4, name: "Data Engineer Profile", appliedFor: "Vai trò = Data Engineer", systemPermCount: 18, dataPermCount: 15, status: "active" },
  { id: 5, name: "IT Support Standard", appliedFor: "Đơn vị = IT Department; Vai trò = Support", systemPermCount: 22, dataPermCount: 5, status: "active" },
  { id: 6, name: "Finance Read Only", appliedFor: "Đơn vị = Finance", systemPermCount: 8, dataPermCount: 12, status: "active" },
  { id: 7, name: "HR Manager Profile", appliedFor: "Vai trò = HR Manager", systemPermCount: 15, dataPermCount: 10, status: "active" },
  { id: 8, name: "Developer Standard", appliedFor: "Vai trò = Developer", systemPermCount: 20, dataPermCount: 8, status: "active" },
  { id: 9, name: "Security Auditor", appliedFor: "Vai trò = Auditor", systemPermCount: 35, dataPermCount: 25, status: "active" },
  { id: 10, name: "Marketing Team", appliedFor: "Đơn vị = Marketing", systemPermCount: 10, dataPermCount: 5, status: "active" },
  { id: 11, name: "Sales Representative", appliedFor: "Vai trò = Sales Rep", systemPermCount: 12, dataPermCount: 8, status: "active" },
  { id: 12, name: "Customer Service", appliedFor: "Đơn vị = Customer Service", systemPermCount: 15, dataPermCount: 6, status: "active" },
  { id: 13, name: "Operations Manager", appliedFor: "Vai trò = Ops Manager", systemPermCount: 25, dataPermCount: 12, status: "active" },
  { id: 14, name: "Legal Compliance", appliedFor: "Đơn vị = Legal", systemPermCount: 18, dataPermCount: 15, status: "active" },
  { id: 15, name: "Research Team", appliedFor: "Đơn vị = Research", systemPermCount: 14, dataPermCount: 20, status: "inactive" },
  { id: 16, name: "DevOps Engineer", appliedFor: "Vai trò = DevOps", systemPermCount: 30, dataPermCount: 10, status: "active" },
  { id: 17, name: "BI Analyst Profile", appliedFor: "Vai trò = BI Analyst", systemPermCount: 16, dataPermCount: 18, status: "active" },
  { id: 18, name: "Tech Lead Profile", appliedFor: "Vai trò = Tech Lead", systemPermCount: 28, dataPermCount: 12, status: "active" },
];

export default function PermissionProfiles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [unitFilter, setUnitFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setUnitFilter("all");
    setRoleFilter("all");
  };

  const columns: { header: string; accessor: keyof typeof mockProfiles[0]; className?: string; render?: (value: any, row: typeof mockProfiles[0]) => React.ReactNode; }[] = [
    {
      header: "Tên profile",
      accessor: "name",
      render: (value: string) => (
        <span className="font-medium text-foreground">{value}</span>
      ),
    },
    {
      header: "Áp dụng cho",
      accessor: "appliedFor",
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">{value}</span>
      ),
    },
    {
      header: "Số quyền hệ thống",
      accessor: "systemPermCount",
      render: (value: number) => (
        <span className="text-sm font-mono">{value}</span>
      ),
    },
    {
      header: "Số quyền dữ liệu",
      accessor: "dataPermCount",
      render: (value: number) => (
        <span className="text-sm font-mono">{value}</span>
      ),
    },
    {
      header: "Trạng thái",
      accessor: "status",
      render: (value: string) => (
        <Badge
          className={
            value === "active"
              ? "inline-flex bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/20"
              : "inline-flex bg-slate-100 text-slate-500 hover:bg-slate-200"
          }
        >
          {value === "active" ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Hành động",
      accessor: "id",
      className: "text-center",
      render: (value: number) => (
        <ActionButtonsContainer>
          <ViewButton onClick={() => console.log("View", value)} />
          <EditButton onClick={() => console.log("Edit", value)} />
          <CopyButton onClick={() => console.log("Clone", value)} />
          <DeleteButton onClick={() => console.log("Delete", value)} />
        </ActionButtonsContainer>
      ),
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <AppHeader title="Profile quyền" />

      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold tracking-tight">Quản lý Profile quyền</h1>
              <p className="text-sm text-muted-foreground">
                Quản lý các gói quyền có thể gán nhanh cho người dùng trong hệ thống
              </p>
            </div>
            <Button onClick={() => setCreateDialogOpen(true)} className="gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-105">
              <Plus className="h-4 w-4" />
              Tạo profile mới
            </Button>
          </div>

          {/* Filters */}
          <SearchFilter
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            onSearch={() => console.log("Search:", searchTerm)}
            onReset={handleReset}
            placeholder="Tìm theo tên, mô tả..."
          >
            <Select value={unitFilter} onValueChange={setUnitFilter}>
              <SelectTrigger className="w-48 bg-background/50 border-border/50 shadow-sm hover:bg-background/80">
                <SelectValue placeholder="Đơn vị áp dụng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả đơn vị</SelectItem>
                <SelectItem value="ttptdl">TTPTDL</SelectItem>
                <SelectItem value="it">IT</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48 bg-background/50 border-border/50 shadow-sm hover:bg-background/80">
                <SelectValue placeholder="Vai trò áp dụng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vai trò</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="bda">BDA</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-background/50 border-border/50 shadow-sm hover:bg-background/80">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </SearchFilter>

          {/* Table */}
          <div className="flex-1 min-h-0 mt-6">
            <DataTable columns={columns} data={mockProfiles} />
          </div>

          {/* Create Dialog */}
          <CreateProfileDialog 
            open={createDialogOpen} 
            onOpenChange={setCreateDialogOpen}
          />
        </div>
      </main>
    </div>
  );
}
