import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";

const mockActions = [
  {
    id: 1,
    code: "view_menu",
    displayName: "Xem menu",
    description: "Quyền xem menu trong hệ thống",
  },
  {
    id: 2,
    code: "create_rule",
    displayName: "Tạo rule",
    description: "Quyền tạo rule mới",
  },
  {
    id: 3,
    code: "upload_rule",
    displayName: "Upload rule",
    description: "Quyền upload file rule",
  },
  {
    id: 4,
    code: "edit_user",
    displayName: "Chỉnh sửa người dùng",
    description: "Quyền chỉnh sửa thông tin người dùng",
  },
  {
    id: 5,
    code: "delete_report",
    displayName: "Xóa báo cáo",
    description: "Quyền xóa báo cáo",
  },
];

export function ActionsTab() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Danh sách hành động</CardTitle>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Thêm hành động
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action code</TableHead>
                <TableHead>Tên hiển thị</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockActions.map((action) => (
                <TableRow key={action.id}>
                  <TableCell className="font-mono text-sm">{action.code}</TableCell>
                  <TableCell className="font-medium">{action.displayName}</TableCell>
                  <TableCell className="text-muted-foreground">{action.description}</TableCell>
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
