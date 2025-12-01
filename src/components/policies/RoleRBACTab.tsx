import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PolicyMatrix } from "./PolicyMatrix";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Eye, Pencil, Copy, Trash2, Search } from "lucide-react";
import { DataTable, Column } from "@/components/ui/data-table";
import { useState } from "react";
import { RuleDetailPanel } from "./RuleDetailPanel";

const mockPolicies = [
    {
        id: 1,
        name: "Giao dịch dưới 10 triệu",
        description: "Áp dụng cho giao dịch có giá trị dưới 10 triệu đồng",
        resource: "transaction",
        actions: ["approve", "read", "delete"],
        appliedTo: "4 vai trò",
        status: "active",
        updatedAt: "2024-01-15",
    },
    {
        id: 2,
        name: "Bảng do đơn vị sở hữu",
        description: "Các bảng thuộc quyền sở hữu của đơn vị người dùng",
        resource: "table",
        actions: ["create", "update", "view"],
        appliedTo: "3 vai trò",
        status: "active",
        updatedAt: "2024-01-14",
    },
    {
        id: 3,
        name: "Truy vấn của bản thân",
        description: "Các truy vấn SQL do chính người dùng tạo",
        resource: "sql_query",
        actions: ["create", "update", "delete"],
        appliedTo: "1 user set",
        status: "active",
        updatedAt: "2024-01-13",
    },
    {
        id: 4,
        name: "Phê duyệt job cao giá trị",
        description: "Phê duyệt job có giá trị ước tính cao",
        resource: "job",
        actions: ["approve"],
        appliedTo: "2 vai trò",
        status: "draft",
        updatedAt: "2024-01-12",
    },
    {
        id: 5,
        name: "Quản lý Data Quality Rules",
        description: "Tạo và quản lý các rule kiểm tra chất lượng dữ liệu",
        resource: "data_quality",
        actions: ["create", "update", "view"],
        appliedTo: "2 vai trò, 1 user",
        status: "active",
        updatedAt: "2024-01-11",
    },
];

const resourceLabels: Record<string, string> = {
    transaction: "Transaction",
    table: "Table",
    sql_query: "SQL Query",
    job: "Job",
    data_quality: "Data Quality",
    feature: "Feature",
    dashboard: "Dashboard",
};

const columns: Column<typeof mockPolicies[0]>[] = [
    {
        header: "STT",
        cell: (_, index) => <span className="text-muted-foreground">{index + 1}</span>,
        className: "w-[60px]"
    },
    {
        header: "Tên chính sách",
        accessorKey: "name",
        className: "font-medium min-w-[200px]"
    },
    {
        header: "Mô tả",
        accessorKey: "description",
        className: "text-muted-foreground max-w-[300px] truncate"
    },
    {
        header: "Resource",
        cell: (policy) => (
            <Badge variant="outline" className="font-mono text-xs">
                {resourceLabels[policy.resource] || policy.resource}
            </Badge>
        ),
    },
    {
        header: "Actions",
        cell: (policy) => (
            <div className="flex gap-1 flex-wrap max-w-[200px]">
                {policy.actions.slice(0, 3).map((action) => (
                    <Badge key={action} variant="secondary" className="text-xs font-mono">
                        {action}
                    </Badge>
                ))}
                {policy.actions.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                        +{policy.actions.length - 3}
                    </Badge>
                )}
            </div>
        ),
    },
    {
        header: "Áp dụng cho",
        accessorKey: "appliedTo",
        className: "text-sm"
    },
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
    {
        header: "Cập nhật",
        accessorKey: "updatedAt",
        className: "text-muted-foreground text-sm"
    },
    {
        header: "Hành động",
        className: "text-right",
        cell: () => (
            <div className="flex justify-end gap-1">
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
    const [searchQuery, setSearchQuery] = useState("");
    const [filterResource, setFilterResource] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");

    return (
        <div className="space-y-6">
            <Tabs defaultValue="matrix" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="matrix">Bảng quyền (Policy Matrix)</TabsTrigger>
                    <TabsTrigger value="rules">Danh sách rule (Rule List)</TabsTrigger>
                </TabsList>

                {/* A. Policy Matrix */}
                <TabsContent value="matrix" className="space-y-0">
                    <PolicyMatrix />
                </TabsContent>

                {/* B. Rule List */}
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
                            {/* Filters */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Tìm kiếm chính sách..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/20 transition-all shadow-sm hover:bg-background/80"
                                    />
                                </div>
                                <Select value={filterResource} onValueChange={setFilterResource}>
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="Resource" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả resource</SelectItem>
                                        <SelectItem value="transaction">Transaction</SelectItem>
                                        <SelectItem value="table">Table</SelectItem>
                                        <SelectItem value="sql_query">SQL Query</SelectItem>
                                        <SelectItem value="job">Job</SelectItem>
                                        <SelectItem value="data_quality">Data Quality</SelectItem>
                                        <SelectItem value="feature">Feature</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger className="w-full sm:w-[150px]">
                                        <SelectValue placeholder="Trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        <SelectItem value="active">Hoạt động</SelectItem>
                                        <SelectItem value="draft">Nháp</SelectItem>
                                        <SelectItem value="paused">Tạm dừng</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <DataTable data={mockPolicies} columns={columns} pageSize={10} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Rule Detail Panel */}
            <RuleDetailPanel open={isPanelOpen} onOpenChange={setIsPanelOpen} rule={null} />
        </div>
    );
}
