import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronRight, Plus, Search, Info } from "lucide-react";
import { useState } from "react";
import { RuleDetailPanel } from "./RuleDetailPanel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RuleGroup {
    id: string;
    name: string;
    description: string;
    expanded: boolean;
    actions: string[];
    conditions: string[];
}

const mockRoleColumns = ["Admin", "BDA", "Teller", "Branch Manager", "Risk Officer", "Senior Manager", "Viewer"];

// Resource-specific rule groups với mô tả chi tiết
const resourceRuleGroups: Record<string, RuleGroup[]> = {
    transaction: [
        {
            id: "txn_under_10m",
            name: "Giao dịch dưới 10 triệu",
            description: "Áp dụng cho giao dịch có giá trị dưới 10 triệu đồng",
            expanded: true,
            actions: ["approve", "read", "delete"],
            conditions: ["transaction.amount < 10000000", "user.branch == transaction.branch"],
        },
        {
            id: "txn_10_100m",
            name: "Giao dịch 10-100 triệu (cùng chi nhánh)",
            description: "Giao dịch từ 10-100 triệu, yêu cầu cùng chi nhánh",
            expanded: true,
            actions: ["approve", "read", "delete"],
            conditions: ["transaction.amount >= 10000000", "transaction.amount <= 100000000", "user.branch == transaction.branch"],
        },
        {
            id: "txn_over_100m",
            name: "Giao dịch trên 100 triệu (rủi ro cao)",
            description: "Giao dịch có giá trị trên 100 triệu, yêu cầu cấp cao",
            expanded: false,
            actions: ["approve", "read"],
            conditions: ["transaction.amount > 100000000"],
        },
    ],
    table: [
        {
            id: "table_owned",
            name: "Bảng do đơn vị sở hữu",
            description: "Các bảng thuộc quyền sở hữu của đơn vị người dùng",
            expanded: true,
            actions: ["create", "update", "view", "search", "upload_metadata"],
            conditions: ["resource.owner_unit == user.unit"],
        },
        {
            id: "table_public",
            name: "Bảng công khai",
            description: "Các bảng được chia sẻ công khai trong hệ thống",
            expanded: true,
            actions: ["view", "search"],
            conditions: ["resource.is_public == true"],
        },
        {
            id: "table_sensitive",
            name: "Bảng nhạy cảm",
            description: "Bảng chứa dữ liệu nhạy cảm, yêu cầu quyền đặc biệt",
            expanded: false,
            actions: ["view", "update"],
            conditions: ["resource.sensitive_level == 'high'", "user.clearance_level >= 3"],
        },
    ],
    sql_query: [
        {
            id: "sql_own",
            name: "Truy vấn của bản thân",
            description: "Các truy vấn SQL do chính người dùng tạo",
            expanded: true,
            actions: ["create", "update", "delete", "clone", "search"],
            conditions: ["resource.created_by == user.id"],
        },
        {
            id: "sql_unit",
            name: "Truy vấn của đơn vị",
            description: "Các truy vấn được chia sẻ trong đơn vị",
            expanded: true,
            actions: ["view", "clone", "search"],
            conditions: ["resource.owner_unit == user.unit"],
        },
    ],
    job: [
        {
            id: "job_create",
            name: "Tạo job thông thường",
            description: "Tạo job với mức độ ưu tiên thông thường",
            expanded: true,
            actions: ["create", "view", "search"],
            conditions: ["resource.priority <= 'normal'"],
        },
        {
            id: "job_approve",
            name: "Phê duyệt job",
            description: "Phê duyệt job thuộc đơn vị hoặc có giá trị phù hợp",
            expanded: true,
            actions: ["approve", "view"],
            conditions: ["resource.owner_unit == user.unit", "resource.estimated_cost < 50000000"],
        },
        {
            id: "job_high_priority",
            name: "Job ưu tiên cao",
            description: "Quản lý job có mức độ ưu tiên cao",
            expanded: false,
            actions: ["approve", "update", "delete"],
            conditions: ["resource.priority == 'high'", "user.seniority >= 'senior'"],
        },
    ],
    data_quality: [
        {
            id: "dq_manage",
            name: "Quản lý Data Quality Rules",
            description: "Tạo và quản lý các rule kiểm tra chất lượng dữ liệu",
            expanded: true,
            actions: ["create", "update", "view", "delete"],
            conditions: ["resource.owner_unit == user.unit"],
        },
        {
            id: "dq_notification",
            name: "Quản lý thông báo DQ",
            description: "Cấu hình và xem thông báo về chất lượng dữ liệu",
            expanded: false,
            actions: ["view", "configure"],
            conditions: [],
        },
    ],
    feature: [
        {
            id: "feature_own",
            name: "Feature của đơn vị",
            description: "Các feature do đơn vị quản lý",
            expanded: true,
            actions: ["create", "update", "view", "search", "upload", "download"],
            conditions: ["resource.owner_unit == user.unit"],
        },
        {
            id: "feature_delete",
            name: "Xóa feature",
            description: "Quyền xóa feature (yêu cầu quyền cao)",
            expanded: false,
            actions: ["delete"],
            conditions: ["resource.created_by == user.id", "user.role in ['Admin', 'Senior Manager']"],
        },
    ],
};

// Mock permissions data
const mockPermissions: Record<string, Record<string, boolean>> = {
    "txn_under_10m_approve": { "Teller": true, "Branch Manager": true, "Admin": true, "BDA": true },
    "txn_under_10m_read": { "Teller": true, "Branch Manager": true, "Risk Officer": true, "Admin": true, "BDA": true, "Viewer": true },
    "txn_under_10m_delete": { "Branch Manager": true, "Admin": true },
    "txn_10_100m_approve": { "Branch Manager": true, "Senior Manager": true, "Admin": true },
    "txn_10_100m_read": { "Branch Manager": true, "Risk Officer": true, "Senior Manager": true, "Admin": true, "BDA": true },
    "txn_over_100m_approve": { "Senior Manager": true, "Admin": true },
    "txn_over_100m_read": { "Senior Manager": true, "Risk Officer": true, "Admin": true },
};

export function PolicyMatrix() {
    const [selectedResource, setSelectedResource] = useState("transaction");
    const [ruleGroups, setRuleGroups] = useState(resourceRuleGroups[selectedResource]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState<any>(null);
    const [permissions, setPermissions] = useState(mockPermissions);
    const [hasChanges, setHasChanges] = useState(false);

    const handleResourceChange = (resource: string) => {
        setSelectedResource(resource);
        setRuleGroups(resourceRuleGroups[resource] || []);
    };

    const toggleGroup = (groupId: string) => {
        setRuleGroups(
            ruleGroups.map((g) => (g.id === groupId ? { ...g, expanded: !g.expanded } : g))
        );
    };

    const togglePermission = (ruleId: string, role: string) => {
        setPermissions({
            ...permissions,
            [ruleId]: {
                ...permissions[ruleId],
                [role]: !permissions[ruleId]?.[role],
            },
        });
        setHasChanges(true);
    };

    const openRuleDetail = (group: RuleGroup) => {
        setSelectedRule({
            name: group.name,
            description: group.description,
            resource: selectedResource,
            actions: group.actions,
            subjectType: "role",
            roles: [],
            users: [],
            conditions: group.conditions.map((cond, idx) => ({
                id: `cond_${idx}`,
                attributeGroup: cond.includes("user.") ? "user" : cond.includes("transaction.") ? "transaction" : "resource",
                attributeName: cond.split(" ")[0],
                operator: cond.includes("==") ? "==" : cond.includes(">=") ? ">=" : cond.includes("<=") ? "<=" : cond.includes(">") ? ">" : "<",
                value: cond.split(" ").slice(-1)[0],
            })),
            conditionLogic: "AND",
        });
        setIsPanelOpen(true);
    };

    const openNewRule = () => {
        setSelectedRule(null);
        setIsPanelOpen(true);
    };

    const handleSaveChanges = () => {
        console.log("Saving permissions:", permissions);
        setHasChanges(false);
        // Show success notification
        alert("Đã lưu thay đổi thành công!");
    };

    const filteredRuleGroups = ruleGroups.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Bảng quyền theo vai trò</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Quản lý quyền theo ma trận role × action. Mỗi dòng thể hiện một rule (resource set + hành động), mỗi cột là một vai trò.
                    </p>
                </div>
                <div className="flex gap-2">
                    {hasChanges && (
                        <Button onClick={handleSaveChanges} variant="default" className="shadow-lg shadow-primary/20">
                            Lưu thay đổi
                        </Button>
                    )}
                    <Button onClick={openNewRule} className="shadow-lg shadow-primary/20">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm rule
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Select value={selectedResource} onValueChange={handleResourceChange}>
                    <SelectTrigger className="w-full sm:w-[220px]">
                        <SelectValue placeholder="Chọn resource" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="transaction">transaction</SelectItem>
                        <SelectItem value="table">table (Quản lý bảng)</SelectItem>
                        <SelectItem value="sql_query">sql_query (Truy vấn SQL)</SelectItem>
                        <SelectItem value="job">job (Quản lý Job)</SelectItem>
                        <SelectItem value="data_quality">data_quality</SelectItem>
                        <SelectItem value="feature">feature (Quản lý Feature)</SelectItem>
                    </SelectContent>
                </Select>

                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm rule theo tên..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Matrix Table */}
            <div className="rounded-lg border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="text-left p-4 font-semibold text-foreground min-w-[320px] sticky left-0 bg-muted/50 z-10">
                                    Rule / Action
                                </th>
                                {mockRoleColumns.map((role) => (
                                    <th key={role} className="text-center p-4 font-semibold text-foreground min-w-[120px]">
                                        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                            {role}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRuleGroups.map((group) => (
                                <>
                                    {/* Group Header Row */}
                                    <tr key={group.id} className="border-b hover:bg-muted/30 transition-colors">
                                        <td className="p-4 sticky left-0 bg-card z-10">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0"
                                                    onClick={() => toggleGroup(group.id)}
                                                >
                                                    {group.expanded ? (
                                                        <ChevronDown className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                <div className="flex items-center gap-2 flex-1">
                                                    <button
                                                        onClick={() => openRuleDetail(group)}
                                                        className="font-semibold text-foreground hover:text-primary transition-colors text-left"
                                                    >
                                                        {group.name}
                                                    </button>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <button
                                                                    onClick={() => openRuleDetail(group)}
                                                                    className="text-muted-foreground hover:text-primary transition-colors"
                                                                >
                                                                    <Info className="h-4 w-4" />
                                                                </button>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="max-w-xs">
                                                                <p className="text-sm">{group.description}</p>
                                                                {group.conditions.length > 0 && (
                                                                    <div className="mt-2 space-y-1">
                                                                        <p className="text-xs font-semibold">Điều kiện:</p>
                                                                        {group.conditions.map((cond, idx) => (
                                                                            <p key={idx} className="text-xs font-mono text-muted-foreground">
                                                                                {cond}
                                                                            </p>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </div>
                                        </td>
                                        {mockRoleColumns.map((role) => (
                                            <td key={role} className="p-4"></td>
                                        ))}
                                    </tr>

                                    {/* Action Rows */}
                                    {group.expanded &&
                                        group.actions.map((action) => {
                                            const ruleId = `${group.id}_${action}`;
                                            return (
                                                <tr key={ruleId} className="border-b hover:bg-muted/20 transition-colors">
                                                    <td className="p-4 pl-12 sticky left-0 bg-card z-10">
                                                        <span className="text-sm text-foreground/80 font-mono font-medium">{action}</span>
                                                    </td>
                                                    {mockRoleColumns.map((role) => (
                                                        <td key={role} className="p-4 text-center">
                                                            <div className="flex justify-center">
                                                                <Checkbox
                                                                    checked={permissions[ruleId]?.[role] || false}
                                                                    onCheckedChange={() => togglePermission(ruleId, role)}
                                                                    className="h-5 w-5"
                                                                />
                                                            </div>
                                                        </td>
                                                    ))}
                                                </tr>
                                            );
                                        })}
                                </>
                            ))}

                            {/* Add New Rule Row */}
                            <tr className="hover:bg-muted/30 transition-colors">
                                <td colSpan={mockRoleColumns.length + 1} className="p-4">
                                    <button
                                        onClick={openNewRule}
                                        className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Thêm rule mới
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <RuleDetailPanel open={isPanelOpen} onOpenChange={setIsPanelOpen} rule={selectedRule} />
        </div>
    );
}
