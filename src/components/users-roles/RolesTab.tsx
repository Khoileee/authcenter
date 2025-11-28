import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";

const mockRoles = [
  {
    id: 1,
    name: "Admin",
    description: "Quyền quản trị toàn hệ thống",
    userCount: 5,
  },
  {
    id: 2,
    name: "Manager",
    description: "Quản lý nhóm và dự án",
    userCount: 12,
  },
  {
    id: 3,
    name: "Data Analyst",
    description: "Phân tích dữ liệu và tạo báo cáo",
    userCount: 8,
  },
  {
    id: 4,
    name: "User",
    description: "Người dùng cơ bản",
    userCount: 45,
  },
];

export function RolesTab() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Danh sách vai trò</CardTitle>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tạo vai trò mới
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên vai trò</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Số người dùng</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell className="text-muted-foreground">{role.description}</TableCell>
                  <TableCell>{role.userCount} người</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
