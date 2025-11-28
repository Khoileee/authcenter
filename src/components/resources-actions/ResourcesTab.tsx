import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";

const mockResources = [
  {
    id: 1,
    code: "menu.data_quality",
    displayName: "Data Quality",
    type: "menu",
    description: "Menu quản lý chất lượng dữ liệu",
  },
  {
    id: 2,
    code: "api.user_management",
    displayName: "User Management API",
    type: "api",
    description: "API quản lý người dùng",
  },
  {
    id: 3,
    code: "entity.report",
    displayName: "Report Entity",
    type: "entity",
    description: "Thực thể báo cáo",
  },
  {
    id: 4,
    code: "menu.analytics",
    displayName: "Analytics",
    type: "menu",
    description: "Menu phân tích dữ liệu",
  },
];

const typeColors: Record<string, string> = {
  menu: "default",
  api: "secondary",
  entity: "outline",
};

export function ResourcesTab() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Danh sách tài nguyên</CardTitle>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Thêm tài nguyên
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã tài nguyên</TableHead>
                <TableHead>Tên hiển thị</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-mono text-sm">{resource.code}</TableCell>
                  <TableCell className="font-medium">{resource.displayName}</TableCell>
                  <TableCell>
                    <Badge variant={typeColors[resource.type] as any}>
                      {resource.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{resource.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
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
