import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Users, Database, FileText, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      title: "Người dùng & Vai trò",
      description: "Quản lý người dùng và gán vai trò RBAC",
      icon: Users,
      href: "/users-roles",
      color: "text-blue-500",
    },
    {
      title: "Tài nguyên & Hành động",
      description: "Định nghĩa tài nguyên và hành động trong hệ thống",
      icon: Database,
      href: "/resources-actions",
      color: "text-green-500",
    },
    {
      title: "Chính sách phân quyền",
      description: "Tạo và quản lý chính sách RBAC và ABAC",
      icon: FileText,
      href: "/policies",
      color: "text-purple-500",
    },
    {
      title: "Kiểm tra quyền",
      description: "Mô phỏng và kiểm tra quyền truy cập",
      icon: CheckCircle,
      href: "/permission-check",
      color: "text-orange-500",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader title="Tổng quan" />
      
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-10 w-10 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Auth Center</h1>
                <p className="text-muted-foreground">Hệ thống quản lý phân quyền tập trung</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Link key={feature.title} to={feature.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <feature.icon className={`h-8 w-8 ${feature.color}`} />
                      <div>
                        <CardTitle>{feature.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-primary hover:underline">
                      Truy cập →
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Về Auth Center</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">
                Auth Center là hệ thống quản lý phân quyền tập trung, hỗ trợ cả RBAC (Role-Based Access Control) 
                và ABAC (Attribute-Based Access Control). Hệ thống cho phép quản lý người dùng, vai trò, 
                tài nguyên, hành động và chính sách phân quyền một cách hiệu quả và linh hoạt.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
