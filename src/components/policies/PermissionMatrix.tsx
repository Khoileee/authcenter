import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronRight, Search, RefreshCw, Plus } from "lucide-react";
import { useState } from "react";
import { AddUserSetPanel } from "./AddUserSetPanel";
import { AddResourceSetPanel } from "./AddResourceSetPanel";

interface ResourceAction {
    id: string;
    label: string;
    action: string;
}

interface ResourceGroup {
    id: string;
    name: string;
    expanded: boolean;
    actions: ResourceAction[];
}

// Mock roles + dynamic user sets
const initialRoles = [
    { id: "admin", name: "Admin", isDynamic: false },
    { id: "bda", name: "BDA", isDynamic: false },
    { id: "teller", name: "Teller", isDynamic: false },
    { id: "branch_manager", name: "Branch Manager", isDynamic: false },
    { id: "risk_officer", name: "Risk Officer", isDynamic: false },
    { id: "viewer", name: "Viewer", isDynamic: false },
];

// Mock resource groups
const resourceGroups: ResourceGroup[] = [
    {
        id: "table_mgmt",
        name: "Quản lý bảng",
        expanded: true,
        actions: [
            { id: "table_create", label: "Tạo bảng", action: "create" },
            { id: "table_update", label: "Sửa bảng", action: "update" },
            { id: "table_search", label: "Tìm kiếm bảng", action: "search" },
            { id: "table_view", label: "Xem thông tin bảng", action: "view" },
            { id: "table_upload_metadata", label: "Upload metadata", action: "upload_metadata" },
        ],
    },
    {
        id: "sql_mgmt",
        name: "Quản lý truy vấn SQL",
        expanded: true,
        actions: [
            { id: "sql_create", label: "Tạo truy vấn", action: "create" },
            { id: "sql_search", label: "Tìm kiếm truy vấn", action: "search" },
            { id: "sql_clone", label: "Nhân bản truy vấn", action: "clone" },
            { id: "sql_update", label: "Sửa truy vấn", action: "update" },
        ],
    },
    {
        id: "job_mgmt",
        name: "Quản lý Job",
        expanded: true,
        actions: [
            { id: "job_create", label: "Tạo job", action: "create" },
            { id: "job_approve", label: "Phê duyệt job", action: "approve" },
            { id: "job_search", label: "Tìm kiếm job", action: "search" },
            { id: "job_update", label: "Sửa job", action: "update" },
        ],
    },
    {
        id: "dq_mgmt",
        name: "Data Quality",
        expanded: false,
        actions: [
            { id: "dq_view", label: "Xem DQ", action: "view" },
            { id: "dq_manage_rule", label: "Quản lý rule DQ", action: "manage_rule" },
            { id: "dq_manage_alert", label: "Quản lý cảnh báo DQ", action: "manage_alert" },
        ],
    },
    {
        id: "feature_mgmt",
        name: "Quản lý Feature",
        expanded: false,
        actions: [
            { id: "feature_view", label: "Xem feature", action: "view" },
            { id: "feature_create", label: "Tạo feature", action: "create" },
            { id: "feature_update", label: "Sửa feature", action: "update" },
            { id: "feature_delete", label: "Xóa feature", action: "delete" },
            { id: "feature_upload", label: "Upload feature", action: "upload" },
            { id: "feature_download", label: "Download feature", action: "download" },
        ],
    },
];

// Mock permissions
const mockPermissions: Record<string, Record<string, boolean>> = {
    table_create: { admin: true, bda: true, teller: false },
    table_update: { admin: true, bda: true, teller: false },
    table_search: { admin: true, bda: true, teller: true, viewer: true },
    table_view: { admin: true, bda: true, teller: true, viewer: true },
    sql_create: { admin: true, bda: true },
    sql_search: { admin: true, bda: true, teller: true, viewer: true },
    job_approve: { admin: true, branch_manager: true },
};

export function PermissionMatrix() {
    const [roles, setRoles] = useState(initialRoles);
    const [groups, setGroups] = useState(resourceGroups);
    const [permissions, setPermissions] = useState(mockPermissions);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedResource, setSelectedResource] = useState("all");
    const [isUserSetPanelOpen, setIsUserSetPanelOpen] = useState(false);
    const [isResourceSetPanelOpen, setIsResourceSetPanelOpen] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const toggleGroup = (groupId: string) => {
        setGroups(groups.map((g) => (g.id === groupId ? { ...g, expanded: !g.expanded } : g)));
    };

    const togglePermission = (actionId: string, roleId: string) => {
        setPermissions({
            ...permissions,
            [actionId]: {
                ...permissions[actionId],
                [roleId]: !permissions[actionId]?.[roleId],
            },
        });
        setHasChanges(true);
    };

    const handleSaveChanges = () => {
        console.log("Saving permissions:", permissions);
        setHasChanges(false);
        alert("Đã lưu thay đổi thành công!");
    };

    const handleRefresh = () => {
        console.log("Refreshing...");
    };

    const filteredGroups = groups.filter((group) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex items-center gap-3">
                <Select value={selectedResource} onValueChange={setSelectedResource}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Loại tài nguyên" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="transaction">transaction</SelectItem>
                        <SelectItem value="table">table</SelectItem>
                        <SelectItem value="job">job</SelectItem>
                        <SelectItem value="feature">feature</SelectItem>
                        <SelectItem value="sql">sql</SelectItem>
                        <SelectItem value="data-quality">data-quality</SelectItem>
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

                <Button variant="ghost" size="icon" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4" />
                </Button>

                {hasChanges && (
                    <Button onClick={handleSaveChanges} className="shadow-lg shadow-primary/20">
                        Lưu thay đổi
                    </Button>
                )}
            </div>

            {/* Permission Matrix */}
            <div className="rounded-lg border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="sticky top-0 z-10 bg-card">
                            <tr className="border-b bg-muted/50">
                                <th className="text-left p-4 font-semibold text-foreground min-w-[300px] sticky left-0 bg-muted/50 z-10">
                                    Tài nguyên / Chức năng
                                </th>
                                {/* Role Columns */}
                                {roles.map((role) => (
                                    <th key={role.id} className="text-center p-4 font-semibold text-foreground min-w-[120px] bg-muted/50">
                                        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                            {role.name}
                                            {role.isDynamic && (
                                                <span className="ml-1 text-xs opacity-70">(dynamic)</span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                                {/* Add User Set Button */}
                                <th className="text-center p-4 min-w-[180px] bg-muted/50">
                                    <button
                                        onClick={() => setIsUserSetPanelOpen(true)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-dashed border-primary/30 text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Thêm nhóm người dùng
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGroups.map((group) => (
                                <>
                                    {/* Group Header */}
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
                                                <span className="font-semibold text-foreground">{group.name}</span>
                                            </div>
                                        </td>
                                        {roles.map((role) => (
                                            <td key={role.id} className="p-3"></td>
                                        ))}
                                        <td></td>
                                    </tr>

                                    {/* Action Rows */}
                                    {group.expanded &&
                                        group.actions.map((action) => (
                                            <tr key={action.id} className="border-b hover:bg-muted/20 transition-colors">
                                                <td className="p-4 pl-12 text-sm text-foreground/80 sticky left-0 bg-card z-10">
                                                    {action.label}
                                                </td>
                                                {roles.map((role) => (
                                                    <td key={role.id} className="p-3 text-center">
                                                        <div className="flex justify-center">
                                                            <Checkbox
                                                                checked={permissions[action.id]?.[role.id] || false}
                                                                onCheckedChange={() => togglePermission(action.id, role.id)}
                                                                className="h-5 w-5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                                            />
                                                        </div>
                                                    </td>
                                                ))}
                                                <td></td>
                                            </tr>
                                        ))}
                                </>
                            ))}

                            {/* Add Resource Set Row */}
                            <tr className="hover:bg-muted/30 transition-colors">
                                <td colSpan={roles.length + 2} className="p-4">
                                    <button
                                        onClick={() => setIsResourceSetPanelOpen(true)}
                                        className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Thêm tài nguyên (Resource Set)
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Side Panels */}
            <AddUserSetPanel open={isUserSetPanelOpen} onOpenChange={setIsUserSetPanelOpen} />
            <AddResourceSetPanel open={isResourceSetPanelOpen} onOpenChange={setIsResourceSetPanelOpen} />
        </div>
    );
}
