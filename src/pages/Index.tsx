import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Database, FileText, ArrowUpRight, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <AppHeader title="Tổng quan" />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-8 pb-8">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Chào mừng đến với Auth Center
            </h1>
            <p className="text-sm text-muted-foreground">
              Hệ thống quản lý phân quyền tập trung cho doanh nghiệp
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                  Tổng số người dùng
                </CardTitle>
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <Users className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">1,234</div>
                <div className="flex items-center text-xs text-success mt-1 font-medium">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +12% so với tháng trước
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                  Vai trò
                </CardTitle>
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform">
                  <Shield className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">24</div>
                <p className="text-xs text-muted-foreground mt-1">Đang hoạt động</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                  Chính sách
                </CardTitle>
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                  <FileText className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">156</div>
                <p className="text-xs text-muted-foreground mt-1">Đã áp dụng</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                  Tài nguyên
                </CardTitle>
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
                  <Database className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">89</div>
                <p className="text-xs text-muted-foreground mt-1">Đang quản lý</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <CardTitle className="text-foreground">Hoạt động gần đây</CardTitle>
                </div>
                <CardDescription>Các thay đổi mới nhất trong hệ thống</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-4 p-3 rounded-xl bg-background/50 border border-border/50 hover:bg-background/80 transition-colors group cursor-default">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 group-hover:scale-125 transition-transform" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          Cập nhật chính sách "Admin Full Access"
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{i} giờ trước • Bởi Admin</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="text-foreground">Truy cập nhanh</CardTitle>
                <CardDescription>Các tính năng thường dùng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/users-roles">
                    <Button variant="outline" className="w-full justify-start h-auto py-6 flex-col gap-2 hover:bg-primary/5 hover:border-primary/50 transition-all group border-border/60 bg-background/50">
                      <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                        <Users className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-medium">Quản lý người dùng</span>
                    </Button>
                  </Link>
                  <Link to="/policies">
                    <Button variant="outline" className="w-full justify-start h-auto py-6 flex-col gap-2 hover:bg-emerald-500/5 hover:border-emerald-500/50 transition-all group border-border/60 bg-background/50">
                      <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                        <FileText className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-medium">Tạo chính sách</span>
                    </Button>
                  </Link>
                  <Link to="/resources-actions">
                    <Button variant="outline" className="w-full justify-start h-auto py-6 flex-col gap-2 hover:bg-amber-500/5 hover:border-amber-500/50 transition-all group border-border/60 bg-background/50">
                      <div className="p-2 rounded-full bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
                        <Database className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-medium">Tài nguyên</span>
                    </Button>
                  </Link>
                  <Link to="/permission-check">
                    <Button variant="outline" className="w-full justify-start h-auto py-6 flex-col gap-2 hover:bg-indigo-500/5 hover:border-indigo-500/50 transition-all group border-border/60 bg-background/50">
                      <div className="p-2 rounded-full bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform">
                        <Shield className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-medium">Kiểm tra quyền</span>
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
