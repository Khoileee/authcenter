import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function PermissionCheck() {
  const [result, setResult] = useState<"allow" | "deny" | null>(null);

  const handleCheck = () => {
    // Mock check - in real app would call API
    setResult("allow");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader title="Kiểm tra quyền" />
      
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Card */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin kiểm tra</CardTitle>
                <CardDescription>Nhập thông tin để kiểm tra quyền truy cập</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Chọn người dùng</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn người dùng..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annv">Nguyễn Văn An (annv)</SelectItem>
                      <SelectItem value="binhtt">Trần Thị Bình (binhtt)</SelectItem>
                      <SelectItem value="khoiln1">Lê Nhật Khôi (khoiln1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Chọn tài nguyên</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tài nguyên..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="menu.data_quality">Data Quality</SelectItem>
                      <SelectItem value="menu.analytics">Analytics</SelectItem>
                      <SelectItem value="api.user_management">User Management API</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Chọn hành động</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn hành động..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view_menu">Xem menu</SelectItem>
                      <SelectItem value="create_rule">Tạo rule</SelectItem>
                      <SelectItem value="upload_rule">Upload rule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Dữ liệu bổ sung (JSON - tùy chọn)</Label>
                  <Textarea
                    placeholder='{"context": "additional data"}'
                    className="font-mono text-sm"
                    rows={4}
                  />
                </div>

                <Button onClick={handleCheck} className="w-full">
                  Kiểm tra quyền
                </Button>
              </CardContent>
            </Card>

            {/* Result Card */}
            <Card>
              <CardHeader>
                <CardTitle>Kết quả kiểm tra</CardTitle>
                <CardDescription>Kết quả phân quyền và chi tiết</CardDescription>
              </CardHeader>
              <CardContent>
                {result === null ? (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    Nhập thông tin và nhấn "Kiểm tra quyền" để xem kết quả
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-center p-8">
                      {result === "allow" ? (
                        <div className="text-center">
                          <CheckCircle className="h-20 w-20 text-success mx-auto mb-4" />
                          <h3 className="text-2xl font-bold text-success">ALLOW</h3>
                          <p className="text-muted-foreground mt-2">Quyền truy cập được cho phép</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <XCircle className="h-20 w-20 text-destructive mx-auto mb-4" />
                          <h3 className="text-2xl font-bold text-destructive">DENY</h3>
                          <p className="text-muted-foreground mt-2">Quyền truy cập bị từ chối</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Chi tiết</h4>
                        <div className="bg-muted p-4 rounded-md space-y-2 text-sm">
                          <p><span className="font-medium">Policy áp dụng:</span> "User khoiln1 Special Access"</p>
                          <p><span className="font-medium">Vai trò:</span> Data Analyst</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Điều kiện đúng</h4>
                        <div className="bg-muted p-4 rounded-md space-y-1 text-sm">
                          <p>✓ user.username == "khoiln1"</p>
                          <p>✓ resource == "menu.data_quality"</p>
                          <p>✓ action == "view_menu"</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
