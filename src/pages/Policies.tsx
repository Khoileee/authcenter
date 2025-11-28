import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Pencil, Copy, Trash2 } from "lucide-react";

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

export default function Policies() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader title="Chính sách phân quyền" />
      
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Danh sách chính sách</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tạo chính sách
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên chính sách</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Áp dụng cho</TableHead>
                      <TableHead>Cập nhật</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPolicies.map((policy) => (
                      <TableRow key={policy.id}>
                        <TableCell className="font-medium">{policy.name}</TableCell>
                        <TableCell className="text-muted-foreground">{policy.description}</TableCell>
                        <TableCell>
                          <Badge variant={policy.status === "active" ? "default" : "secondary"}>
                            {policy.status === "active" ? "Active" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>{policy.appliedTo}</TableCell>
                        <TableCell className="text-muted-foreground">{policy.updatedAt}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Copy className="h-4 w-4" />
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
        </div>
      </main>
    </div>
  );
}
