import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PolicyMatrix } from "./PolicyMatrix";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Pencil, Copy, Trash2, Search } from "lucide-react";
import { DataTable, Column } from "@/components/ui/data-table";
import { useState } from "react";
import { RuleDetailPanel } from "./RuleDetailPanel";
import { DynamicGroupPanel } from "./DynamicGroupPanel";

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

const columns: Column<typeof mockPolicies[0]>[] = [
    { header: "Tên chính sách", accessorKey: "name", className: "font-medium" },
    { header: "Mô tả", accessorKey: "description", className: "text-muted-foreground" },
    {
        header: "Trạng thái",
        cell: (policy) => (
            <Badge
                variant={policy.status === "active" ? "default" : "secondary"}
                className={
                    policy.status === "active"
                        ? "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-200/50"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }
            >
                {policy.status === "active" ? "Hoạt động" : "Nháp"}
            </Badge>
        ),
    },
    { header: "Áp dụng cho", accessorKey: "appliedTo" },
    { header: "Cập nhật", accessorKey: "updatedAt", className: "text-muted-foreground" },
    {
        header: "Hành động",
        className: "text-right",
        cell: () => (
            <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10">
                    <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10">
                    <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10">
                    <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        ),
    },
];

export function RoleRBACTab() {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isDynamicGroupPanelOpen, setIsDynamicGroupPanelOpen] = useState(false);

    return (
        <div className="space-y-6">
            <Tabs defaultValue="rbac" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="rbac">Ma trận RBAC</TabsTrigger>
                    <TabsTrigger value="abac">Quyền nhóm động (ABAC)</TabsTrigger>
                    <TabsTrigger value="rules">Danh sách rule</TabsTrigger>
                </TabsList>

                {/* A. RBAC Matrix */}
                <TabsContent value="rbac" className="space-y-0">
                    <PolicyMatrix />
                </TabsContent>

                {/* B. Dynamic Groups (ABAC) */}
                <TabsContent value="abac" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold tracking-tight">Quyền theo nhóm động (ABAC)</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Tạo nhóm người dùng tự động dựa trên thuộc tính và gán quyền cho nhóm
                            </p>
                        </div>
                        <Button onClick={() => setIsDynamicGroupPanelOpen(true)} className="shadow-lg shadow-primary/20">
                            <Plus className="h-4 w-4 mr-2" />
                            Tạo nhóm động
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {/* Mock Dynamic Groups */}
                                <div className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold">Nhân viên PTDL - Quản lý bảng</h4>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Nhân viên thuộc đơn vị PTDL có quyền quản lý bảng do đơn vị mình sở hữu
                                            </p>
                                            <div className="flex gap-2 mt-3">
                                                <Badge variant="outline" className="font-mono text-xs">
                                                    user.unit == "PTDL"
                                                </Badge>
                                                <Badge variant="outline" className="font-mono text-xs">
                                                    resource.owner_unit == user.unit
                                                </Badge>
                                            </div>
                                            <div className="flex gap-2 mt-2">
                                                <Badge variant="secondary">table:edit</Badge>
                                                <Badge variant="secondary">table:view</Badge>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold">Senior Manager - Phê duyệt job cao giá trị</h4>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Senior Manager có thể phê duyệt job có giá trị trên 100 triệu
                                            </p>
                                            <div className="flex gap-2 mt-3">
                                                <Badge variant="outline" className="font-mono text-xs">
                                                    user.seniority == "senior"
                                                </Badge>
                                                <Badge variant="outline" className="font-mono text-xs">
                                                    resource.value {">"} 100000000
                                                </Badge>
                                            </div>
                                            <div className="flex gap-2 mt-2">
                                                <Badge variant="secondary">job:approve</Badge>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* C. Rule List */}
                <TabsContent value="rules" className="space-y-0">
                    <Card className="border-none shadow-none bg-transparent">
                        <CardHeader className="flex flex-row items-center justify-between px-0 pt-0 pb-6">
                            <div className="flex flex-col gap-1">
                                <CardTitle className="text-2xl font-bold tracking-tight">Danh sách rule</CardTitle>
                                <p className="text-sm text-muted-foreground">Quản lý tất cả rule phân quyền trong hệ thống</p>
                            </div>
                            <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105" onClick={() => setIsPanelOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Tạo rule mới
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0 space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm kiếm chính sách..."
                                    className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/20 transition-all shadow-sm hover:bg-background/80"
                                />
                            </div>

                            <DataTable data={mockPolicies} columns={columns} pageSize={10} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Panels */}
            <RuleDetailPanel open={isPanelOpen} onOpenChange={setIsPanelOpen} rule={null} />
            <DynamicGroupPanel open={isDynamicGroupPanelOpen} onOpenChange={setIsDynamicGroupPanelOpen} />
        </div>
    );
}
