import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Pencil } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockUsers = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    username: "annv",
    email: "annv@company.com",
    unit: "IT Department",
    roles: ["Admin", "Manager"],
    status: "active",
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    username: "binhtt",
    email: "binhtt@company.com",
    unit: "HR Department",
    roles: ["User"],
    status: "active",
  },
  {
    id: 3,
    name: "Lê Nhật Khôi",
    username: "khoiln1",
    email: "khoiln1@company.com",
    unit: "Data Team",
    roles: ["Data Analyst"],
    status: "active",
  },
];

export function UsersTab() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Quản lý người dùng</CardTitle>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Thêm người dùng
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm theo tên, username hoặc email..." className="pl-9" />
          </div>
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Đơn vị" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="it">IT Department</SelectItem>
              <SelectItem value="hr">HR Department</SelectItem>
              <SelectItem value="data">Data Team</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Đơn vị</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.unit}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {user.roles.map((role) => (
                        <Badge key={role} variant="secondary">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "secondary"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
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
