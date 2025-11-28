import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Pencil, Copy, Trash2 } from "lucide-react";
import { DataTable, Column } from "@/components/ui/data-table";

const mockPolicies = [
  {
    id: 1,
    name: "Admin Full Access",
    description: "Quyền truy cập đầy đủ cho Admin",
    status: "active",
    appliedTo: "2 vai trò",
    updatedAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Data Quality - View Only",
    description: "Chỉ xem Data Quality menu",
    status: "active",
    appliedTo: "3 vai trò",
    updatedAt: "2024-01-14",
  },
  {
    id: 3,
    name: "User khoiln1 Special Access",
    description: "Quyền đặc biệt cho user khoiln1",
    status: "active",
    appliedTo: "1 người dùng",
    updatedAt: "2024-01-13",
  },
  {
    id: 4,
    name: "Report Creator",
    description: "Tạo và chỉnh sửa báo cáo",
    status: "draft",
    appliedTo: "0",
    updatedAt: "2024-01-12",
  },
];

const columns: Column<typeof mockPolicies[0]>[] = [
  { header: "Tên chính sách", accessorKey: "name", className: "font-medium" },
  { header: "Mô tả", accessorKey: "description", className: "text-muted-foreground" },
  {
    header: "Trạng thái",
    cell: (policy) => (
      <Badge variant={policy.status === "active" ? "default" : "secondary"} className={policy.status === "active" ? "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-200/50" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}>
        {policy.status === "active" ? "Active" : "Draft"}
      </Badge>
    ),
  },
  { header: "Áp dụng cho", accessorKey: "appliedTo" },
  { header: "Cập nhật", accessorKey: "updatedAt", className: "text-muted-foreground" },
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
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10">
          <Copy className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function Policies() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <AppHeader title="Chính sách phân quyền" />

      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
          <Card className="h-full flex flex-col border-none shadow-none bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between px-0 pt-0 pb-6">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-2xl font-bold tracking-tight">Danh sách chính sách</CardTitle>
                <p className="text-sm text-muted-foreground">Quản lý các chính sách phân quyền trong hệ thống</p>
              </div>
              <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                Tạo chính sách
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col min-h-0">
              <div className="flex-1 min-h-0">
                <DataTable data={mockPolicies} columns={columns} pageSize={10} />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
