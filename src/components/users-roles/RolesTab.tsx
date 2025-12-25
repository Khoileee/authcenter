import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DataTable, Column } from "@/components/ui/data-table";
import { CreateRolePanel } from "@/components/dialogs/CreateRoleDialog";
import { SearchFilter } from "@/components/common/SearchFilter";
import { ViewButton, EditButton, DeleteButton, ActionButtonsContainer } from "@/components/common/ActionButtons";
import { useState } from "react";

const mockRoles = [
  { id: 1, name: "Admin", description: "Quyền quản trị toàn hệ thống, quản lý người dùng và cấu hình", userCount: 5 },
  { id: 2, name: "Manager", description: "Quản lý nhóm, dự án và phê duyệt yêu cầu", userCount: 12 },
  { id: 3, name: "Data Analyst", description: "Phân tích dữ liệu, tạo báo cáo và dashboard", userCount: 8 },
  { id: 4, name: "User", description: "Người dùng cơ bản với quyền đọc", userCount: 45 },
  { id: 5, name: "Developer", description: "Phát triển và bảo trì ứng dụng", userCount: 18 },
  { id: 6, name: "DevOps", description: "Quản lý CI/CD, infrastructure và deployment", userCount: 6 },
  { id: 7, name: "DQ Admin", description: "Quản trị Data Quality, tạo và quản lý rules", userCount: 4 },
  { id: 8, name: "Security Admin", description: "Quản lý bảo mật, audit và compliance", userCount: 3 },
  { id: 9, name: "HR Manager", description: "Quản lý nhân sự, tuyển dụng và đào tạo", userCount: 5 },
  { id: 10, name: "Finance Manager", description: "Quản lý tài chính, ngân sách và báo cáo tài chính", userCount: 4 },
  { id: 11, name: "Support Lead", description: "Hỗ trợ khách hàng và xử lý ticket", userCount: 7 },
  { id: 12, name: "Auditor", description: "Kiểm toán hệ thống và review quyền truy cập", userCount: 2 },
  { id: 13, name: "BI Analyst", description: "Phân tích Business Intelligence và tạo insights", userCount: 5 },
  { id: 14, name: "Tech Lead", description: "Dẫn dắt kỹ thuật và review code", userCount: 4 },
  { id: 15, name: "Viewer", description: "Chỉ có quyền xem, không chỉnh sửa", userCount: 25 },
];

export function RolesTab() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleReset = () => {
    setSearchValue("");
  };

  const columns: Column<typeof mockRoles[0]>[] = [
    { header: "Tên vai trò", accessorKey: "name", className: "font-medium" },
    { header: "Mô tả", accessorKey: "description", className: "text-muted-foreground" },
    { header: "Số người dùng", accessorKey: "userCount", cell: (role) => `${role.userCount} người` },
    {
      header: "Hành động",
      className: "text-center",
      cell: (role) => (
        <ActionButtonsContainer>
          <ViewButton onClick={() => console.log("View", role.id)} />
          <EditButton onClick={() => console.log("Edit", role.id)} />
          <DeleteButton onClick={() => console.log("Delete", role.id)} />
        </ActionButtonsContainer>
      ),
    },
  ];

  return (
    <>
      <Card className="h-full flex flex-col border-none shadow-none bg-transparent">
        <CardHeader className="flex flex-row items-center justify-between px-0 pt-0 pb-6">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="text-2xl font-bold tracking-tight">Danh sách vai trò</CardTitle>
            <p className="text-sm text-muted-foreground">Quản lý các vai trò và quyền hạn trong hệ thống</p>
          </div>
          <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tạo vai trò mới
          </Button>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col min-h-0 space-y-4">
          <SearchFilter
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onSearch={() => console.log("Search:", searchValue)}
            onReset={handleReset}
            placeholder="Tìm kiếm vai trò..."
          />

          <div className="flex-1 min-h-0">
            <DataTable data={mockRoles} columns={columns} pageSize={10} />
          </div>
        </CardContent>
      </Card>

      <CreateRolePanel open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </>
  );
}
