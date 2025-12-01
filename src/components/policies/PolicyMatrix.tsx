import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronRight, Plus, Search } from "lucide-react";
import { useState } from "react";
import { RuleDetailPanel } from "./RuleDetailPanel";

interface RuleGroup {
    id: string;
    name: string;
    expanded: boolean;
    actions: string[];
}

const mockRoleColumns = ["Admin", "Teller", "Branch Manager", "Risk Officer", "Senior Manager"];

const mockRuleGroups: RuleGroup[] = [
    {
        id: "txn_under_10m",
        name: "Giao dịch dưới 10 triệu",
        expanded: true,
        actions: ["approve", "read", "delete"],
    },
    {
        id: "txn_10_100m",
        name: "Giao dịch 10-100 triệu (cùng chi nhánh)",
        expanded: true,
        actions: ["approve", "read", "delete"],
    },
    {
        id: "txn_over_100m",
        name: "Giao dịch trên 100 triệu (rủi ro cao)",
        expanded: false,
        actions: ["approve", "read"],
    },
];

// Mock permissions data
const mockPermissions: Record<string, Record<string, boolean>> = {
    "txn_under_10m_approve": { "Teller": true, "Branch Manager": true, "Admin": true },
    "txn_under_10m_read": { "Teller": true, "Branch Manager": true, "Risk Officer": true, "Admin": true },
    "txn_10_100m_approve": { "Branch Manager": true, "Admin": true },
    "txn_10_100m_read": { "Branch Manager": true, "Risk Officer": true, "Admin": true },
    "txn_over_100m_approve": { "Senior Manager": true, "Admin": true },
    "txn_over_100m_read": { "Senior Manager": true, "Risk Officer": true, "Admin": true },
};

export function PolicyMatrix() {
    const [ruleGroups, setRuleGroups] = useState(mockRuleGroups);
    const [selectedResource, setSelectedResource] = useState("transaction");
    const [searchQuery, setSearchQuery] = useState("");
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState<any>(null);
    const [permissions, setPermissions] = useState(mockPermissions);

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
    };

    const openRuleDetail = (group: RuleGroup) => {
        setSelectedRule({
            name: group.name,
            description: "",
            resource: selectedResource,
            actions: group.actions,
            subjectType: "role",
            roles: [],
            users: [],
            conditions: [],
            conditionLogic: "AND",
        });
        setIsPanelOpen(true);
    };

    const openNewRule = () => {
        setSelectedRule(null);
        setIsPanelOpen(true);
    };

    return (
        <div className="space-y-4">
            {/* Header & Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Bảng quyền giao dịch (Policy Editor)</h2>
                    <p className="text-sm text-muted-foreground mt-1">Quản lý quyền theo ma trận role × action</p>
                </div>
                <Button onClick={openNewRule} className="shadow-lg shadow-primary/20">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm rule
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <Select value={selectedResource} onValueChange={setSelectedResource}>
                    <SelectTrigger className="w-full sm:w-[200px] bg-background/50">
                        <SelectValue placeholder="Filter resource" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="transaction">transaction</SelectItem>
                        <SelectItem value="account">account</SelectItem>
                        <SelectItem value="customer">customer</SelectItem>
                        <SelectItem value="data_quality">data_quality</SelectItem>
                    </SelectContent>
                </Select>

                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm rule theo tên..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-background/50"
                    />
                </div>
            </div>

            {/* Policy Matrix Table */}
            <div className="rounded-lg border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="text-left p-4 font-semibold min-w-[300px] sticky left-0 bg-muted/50 z-10">
                                    Rule / Action
                                </th>
                                {mockRoleColumns.map((role) => (
                                    <th key={role} className="text-center p-4 font-semibold min-w-[120px]">
                                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                                            {role}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {ruleGroups.map((group) => (
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
                                                <button
                                                    onClick={() => openRuleDetail(group)}
                                                    className="font-medium hover:text-primary transition-colors text-left"
                                                >
                                                    {group.name}
                                                </button>
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
                                                        <span className="text-sm text-muted-foreground font-mono">{action}</span>
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
                                        className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
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

            {/* Rule Detail Panel */}
            <RuleDetailPanel open={isPanelOpen} onOpenChange={setIsPanelOpen} rule={selectedRule} />
        </div>
    );
}
