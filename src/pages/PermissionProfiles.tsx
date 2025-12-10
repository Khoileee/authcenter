import { AppHeader } from "@/components/AppHeader";
import { SearchBar } from "@/components/common/SearchBar";
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Copy, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { CreateProfileDialog } from "@/components/dialogs/CreateProfileDialog";

// Mock data
const mockProfiles = [
  {
    id: 1,
    name: "BDA - TTPTDL",
    appliedFor: "Đơn vị = TTPTDL; Vai trò = BDA",
    systemPermCount: 12,
    dataPermCount: 8,
    status: "active",
  },
  {
    id: 2,
    name: "Admin Full Access",
    appliedFor: "Vai trò = Admin",
    systemPermCount: 45,
    dataPermCount: 20,
    status: "active",
  },
  {
    id: 3,
    name: "DQ Viewer",
    appliedFor: "Đơn vị = TTPTDL; Vai trò = Viewer",
    systemPermCount: 5,
    dataPermCount: 3,
    status: "inactive",
  },
];

export default function PermissionProfiles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [unitFilter, setUnitFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const columns = [
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
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => console.log("View", value)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => console.log("Edit", value)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => console.log("Clone", value)}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => console.log("Delete", value)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <AppHeader title="Profile quyền" />

      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Quản lý các gói quyền có thể gán nhanh cho người dùng
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Tìm theo tên, mô tả..."
              />
            </div>

            <Select value={unitFilter} onValueChange={setUnitFilter}>
              <SelectTrigger className="w-48 bg-white">
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
              <SelectTrigger className="w-48 bg-white">
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
              <SelectTrigger className="w-40 bg-white">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Tạo profile mới
            </Button>
          </div>

          {/* Table */}
          <div className="flex-1 min-h-0">
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
