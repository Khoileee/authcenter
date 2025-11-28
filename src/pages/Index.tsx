import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Database, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader title="Tổng quan" />
      
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Chào mừng đến với Auth Center
            </h2>
            <p className="text-muted-foreground text-lg">
              Hệ thống quản lý phân quyền tập trung cho doanh nghiệp
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tổng số người dùng
                </CardTitle>
                <Users className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">1,234</div>
                <p className="text-xs text-success mt-2">+12% so với tháng trước</p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Vai trò
                </CardTitle>
                <Shield className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">24</div>
                <p className="text-xs text-muted-foreground mt-2">Đang hoạt động</p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Chính sách
                </CardTitle>
                <FileText className="h-5 w-5 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">156</div>
                <p className="text-xs text-muted-foreground mt-2">Đã áp dụng</p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tài nguyên
                </CardTitle>
                <Database className="h-5 w-5 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">89</div>
                <p className="text-xs text-muted-foreground mt-2">Đang quản lý</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border shadow-md">
              <CardHeader>
                <CardTitle className="text-foreground">Hoạt động gần đây</CardTitle>
                <CardDescription>Các thay đổi mới nhất trong hệ thống</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          Cập nhật chính sách "Admin Full Access"
                        </p>
                        <p className="text-xs text-muted-foreground">{i} giờ trước</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-md">
              <CardHeader>
                <CardTitle className="text-foreground">Truy cập nhanh</CardTitle>
                <CardDescription>Các tính năng thường dùng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/users-roles">
                    <Button variant="outline" className="w-full justify-start h-auto py-4 hover:bg-primary/10 hover:border-primary transition-colors">
                      <Users className="h-5 w-5 mr-2" />
                      <span className="text-sm">Quản lý người dùng</span>
                    </Button>
                  </Link>
                  <Link to="/policies">
                    <Button variant="outline" className="w-full justify-start h-auto py-4 hover:bg-accent/10 hover:border-accent transition-colors">
                      <FileText className="h-5 w-5 mr-2" />
                      <span className="text-sm">Tạo chính sách</span>
                    </Button>
                  </Link>
                  <Link to="/resources-actions">
                    <Button variant="outline" className="w-full justify-start h-auto py-4 hover:bg-success/10 hover:border-success transition-colors">
                      <Database className="h-5 w-5 mr-2" />
                      <span className="text-sm">Tài nguyên</span>
                    </Button>
                  </Link>
                  <Link to="/permission-check">
                    <Button variant="outline" className="w-full justify-start h-auto py-4 hover:bg-warning/10 hover:border-warning transition-colors">
                      <Shield className="h-5 w-5 mr-2" />
                      <span className="text-sm">Kiểm tra quyền</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
