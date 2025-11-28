import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, ShieldCheck } from "lucide-react";
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
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <AppHeader title="Kiểm tra quyền" />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Card */}
            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <CardTitle>Thông tin kiểm tra</CardTitle>
                </div>
                <CardDescription>Nhập thông tin để kiểm tra quyền truy cập của người dùng đối với tài nguyên</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Chọn người dùng</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50">
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
                    <SelectTrigger className="bg-background/50">
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
                    <SelectTrigger className="bg-background/50">
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
                    className="font-mono text-sm bg-background/50"
                    rows={4}
                  />
                </div>

                <Button onClick={handleCheck} className="w-full shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                  Kiểm tra quyền
                </Button>
              </CardContent>
            </Card>

            {/* Result Card */}
            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle>Kết quả kiểm tra</CardTitle>
                <CardDescription>Kết quả phân quyền và chi tiết giải thích</CardDescription>
              </CardHeader>
              <CardContent className="h-[calc(100%-5rem)]">
                {result === null ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground border-2 border-dashed rounded-xl p-12 bg-muted/30">
                    <ShieldCheck className="h-12 w-12 mb-4 opacity-20" />
                    <p>Nhập thông tin và nhấn "Kiểm tra quyền" để xem kết quả</p>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center justify-center p-8 bg-background/50 rounded-xl border border-border/50">
                      {result === "allow" ? (
                        <div className="text-center">
                          <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4 animate-in zoom-in-50 duration-500">
                            <CheckCircle className="h-12 w-12 text-success" />
                          </div>
                          <h3 className="text-3xl font-bold text-success tracking-tight">ALLOW</h3>
                          <p className="text-muted-foreground mt-2 font-medium">Quyền truy cập được cho phép</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4 animate-in zoom-in-50 duration-500">
                            <XCircle className="h-12 w-12 text-destructive" />
                          </div>
                          <h3 className="text-3xl font-bold text-destructive tracking-tight">DENY</h3>
                          <p className="text-muted-foreground mt-2 font-medium">Quyền truy cập bị từ chối</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <span className="w-1 h-4 bg-primary rounded-full"></span>
                          Chi tiết
                        </h4>
                        <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm border border-border/50">
                          <p><span className="font-medium text-foreground/80">Policy áp dụng:</span> "User khoiln1 Special Access"</p>
                          <p><span className="font-medium text-foreground/80">Vai trò:</span> Data Analyst</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <span className="w-1 h-4 bg-primary rounded-full"></span>
                          Điều kiện đúng
                        </h4>
                        <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm border border-border/50">
                          <div className="flex items-center gap-2 text-success">
                            <CheckCircle className="h-3 w-3" />
                            <span className="font-mono">user.username == "khoiln1"</span>
                          </div>
                          <div className="flex items-center gap-2 text-success">
                            <CheckCircle className="h-3 w-3" />
                            <span className="font-mono">resource == "menu.data_quality"</span>
                          </div>
                          <div className="flex items-center gap-2 text-success">
                            <CheckCircle className="h-3 w-3" />
                            <span className="font-mono">action == "view_menu"</span>
                          </div>
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
