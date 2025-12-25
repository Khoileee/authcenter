import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, ChevronDown, ChevronRight, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

interface Permission {
    id: string;
    name: string;
    mode: "inherit" | "own" | "full";
}

interface MenuGroup {
    id: string;
    name: string;
    expanded: boolean;
    permissions: Permission[];
}

const mockMenuGroups: MenuGroup[] = [
    {
        id: "table_mgmt",
        name: "Quản lý bảng",
        expanded: true,
        permissions: [
            { id: "table_create", name: "Tạo bảng", mode: "inherit" },
            { id: "table_edit", name: "Sửa bảng", mode: "inherit" },
            { id: "table_search", name: "Tìm kiếm bảng", mode: "inherit" },
            { id: "table_view", name: "Xem thông tin bảng", mode: "inherit" },
            { id: "table_upload", name: "Upload metadata", mode: "inherit" },
        ],
    },
    {
        id: "sql_mgmt",
        name: "Quản lý truy vấn SQL",
        expanded: false,
        permissions: [
            { id: "sql_create", name: "Tạo truy vấn mới", mode: "inherit" },
            { id: "sql_search", name: "Tìm kiếm truy vấn", mode: "inherit" },
            { id: "sql_clone", name: "Clone truy vấn", mode: "inherit" },
            { id: "sql_edit", name: "Chỉnh sửa truy vấn", mode: "inherit" },
        ],
    },
    {
        id: "job_mgmt",
        name: "Quản lý Job",
        expanded: false,
        permissions: [
            { id: "job_create", name: "Tạo job", mode: "inherit" },
            { id: "job_approve", name: "Phê duyệt job", mode: "inherit" },
            { id: "job_search", name: "Tìm kiếm job", mode: "inherit" },
            { id: "job_update", name: "Cập nhật job", mode: "inherit" },
        ],
    },
    {
        id: "dq_mgmt",
        name: "Data Quality",
        expanded: false,
        permissions: [
            { id: "dq_manage", name: "Quản lý Data Quality", mode: "inherit" },
            { id: "dq_notification", name: "Quản lý thông báo", mode: "inherit" },
        ],
    },
    {
        id: "feature_mgmt",
        name: "Quản lý Feature",
        expanded: false,
        permissions: [
            { id: "feature_search", name: "Tìm kiếm feature", mode: "inherit" },
            { id: "feature_view", name: "Xem chi tiết", mode: "inherit" },
            { id: "feature_create", name: "Tạo mới", mode: "inherit" },
            { id: "feature_update", name: "Cập nhật", mode: "inherit" },
            { id: "feature_delete", name: "Xóa feature", mode: "inherit" },
            { id: "feature_upload", name: "Upload", mode: "inherit" },
            { id: "feature_download", name: "Download", mode: "inherit" },
        ],
    },
];

export function UserACLTab() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [menuGroups, setMenuGroups] = useState(mockMenuGroups);

    const handleSearch = () => {
        if (searchQuery.toLowerCase() === "khoiln1") {
            setSelectedUser({
                username: "khoiln1",
                fullName: "Lê Nhật Khôi",
                unit: "TTPTDL",
                role: "BDA",
                status: "Active",
            });

            // Load user's permissions
            setMenuGroups([
                {
                    id: "table_mgmt",
                    name: "Quản lý bảng",
                    expanded: true,
                    permissions: [
                        { id: "table_create", name: "Tạo bảng", mode: "full" },
                        { id: "table_edit", name: "Sửa bảng", mode: "own" },
                        { id: "table_search", name: "Tìm kiếm bảng", mode: "full" },
                        { id: "table_view", name: "Xem thông tin bảng", mode: "full" },
                        { id: "table_upload", name: "Upload metadata", mode: "full" },
                    ],
                },
                {
                    id: "sql_mgmt",
                    name: "Quản lý truy vấn SQL",
                    expanded: false,
                    permissions: [
                        { id: "sql_create", name: "Tạo truy vấn mới", mode: "inherit" },
                        { id: "sql_search", name: "Tìm kiếm truy vấn", mode: "inherit" },
                        { id: "sql_clone", name: "Clone truy vấn", mode: "inherit" },
                        { id: "sql_edit", name: "Chỉnh sửa truy vấn", mode: "own" },
                    ],
                },
                {
                    id: "job_mgmt",
                    name: "Quản lý Job",
                    expanded: false,
                    permissions: [
                        { id: "job_create", name: "Tạo job", mode: "inherit" },
                        { id: "job_approve", name: "Phê duyệt job", mode: "inherit" },
                        { id: "job_search", name: "Tìm kiếm job", mode: "inherit" },
                        { id: "job_update", name: "Cập nhật job", mode: "inherit" },
                    ],
                },
                {
                    id: "dq_mgmt",
                    name: "Data Quality",
                    expanded: false,
                    permissions: [
                        { id: "dq_manage", name: "Quản lý Data Quality", mode: "inherit" },
                        { id: "dq_notification", name: "Quản lý thông báo", mode: "inherit" },
                    ],
                },
                {
                    id: "feature_mgmt",
                    name: "Quản lý Feature",
                    expanded: false,
                    permissions: [
                        { id: "feature_search", name: "Tìm kiếm feature", mode: "inherit" },
                        { id: "feature_view", name: "Xem chi tiết", mode: "inherit" },
                        { id: "feature_create", name: "Tạo mới", mode: "inherit" },
                        { id: "feature_update", name: "Cập nhật", mode: "inherit" },
                        { id: "feature_delete", name: "Xóa feature", mode: "full" },
                        { id: "feature_upload", name: "Upload", mode: "inherit" },
                        { id: "feature_download", name: "Download", mode: "inherit" },
                    ],
                },
            ]);
        } else {
            // Reset if user not found
            setSelectedUser(null);
            setMenuGroups(mockMenuGroups);
        }
    };

    const toggleGroup = (groupId: string) => {
        setMenuGroups(
            menuGroups.map((g) => (g.id === groupId ? { ...g, expanded: !g.expanded } : g))
        );
    };

    const updatePermission = (groupId: string, permId: string, mode: "inherit" | "own" | "full") => {
        setMenuGroups(
            menuGroups.map((g) =>
                g.id === groupId
                    ? {
                        ...g,
                        permissions: g.permissions.map((p) =>
                            p.id === permId ? { ...p, mode } : p
                        ),
                    }
                    : g
            )
        );
    };

    const handleSave = () => {
        console.log("Save ACL:", { user: selectedUser, permissions: menuGroups });
        alert("Đã lưu quyền ACL thành công!");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold tracking-tight">Quyền theo người dùng (ACL)</h2>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                                <p className="text-sm">
                                    Quyền riêng của người dùng (ACL) có mức ưu tiên cao nhất.
                                    Chỉ các quyền được cấu hình khác "Kế thừa" mới ghi đè quyền từ vai trò hoặc nhóm động.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <p className="text-sm text-muted-foreground">
                    Quyền từ tab này sẽ được ưu tiên hơn quyền từ vai trò hoặc nhóm động.
                </p>
            </div>

            {/* Search User */}
            <Card className="p-4">
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm user theo username..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="pl-9"
                        />
                    </div>
                    <Button onClick={handleSearch}>Tìm kiếm</Button>
                </div>
            </Card>

            {/* User Info Card */}
            {selectedUser && (
                <Card className="p-4">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">User:</span>
                            <Badge variant="secondary" className="font-mono font-medium">
                                {selectedUser.username}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Đơn vị:</span>
                            <Badge variant="outline" className="font-medium">{selectedUser.unit}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Vai trò:</span>
                            <Badge variant="outline" className="font-medium">{selectedUser.role}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Trạng thái:</span>
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-none bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-200/50">
                                {selectedUser.status}
                            </span>
                        </div>
                    </div>
                </Card>
            )}

            {/* ACL Permission Matrix */}
            <Card className="overflow-hidden">
                <div className="max-h-[600px] overflow-y-auto overflow-x-auto">
                    <table className="w-full">
                        <thead className="sticky top-0 z-10 bg-card">
                            <tr className="border-b bg-muted/50">
                                <th className="text-left p-4 font-semibold text-foreground min-w-[300px] bg-muted/50">
                                    Menu / Chức năng
                                </th>
                                <th className="text-center p-4 font-semibold text-foreground w-[140px] bg-muted/50">
                                    Kế thừa
                                </th>
                                <th className="text-center p-4 font-semibold text-foreground w-[180px] whitespace-nowrap bg-muted/50">
                                    Chỉ dữ liệu sở hữu
                                </th>
                                <th className="text-center p-4 font-semibold text-foreground w-[140px] bg-muted/50">
                                    Toàn bộ
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {menuGroups.map((group) => (
                                <>
                                    {/* Group Header */}
                                    <tr key={group.id} className="border-b hover:bg-muted/30 transition-colors">
                                        <td className="p-4">
                                            <button
                                                onClick={() => toggleGroup(group.id)}
                                                className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors"
                                            >
                                                {group.expanded ? (
                                                    <ChevronDown className="h-4 w-4" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4" />
                                                )}
                                                {group.name}
                                            </button>
                                        </td>
                                        <td colSpan={3}></td>
                                    </tr>

                                    {/* Permission Rows */}
                                    {group.expanded &&
                                        group.permissions.map((perm) => (
                                            <tr key={perm.id} className="border-b hover:bg-muted/20 transition-colors">
                                                <td className="p-4 pl-12 text-sm text-foreground/80">
                                                    {perm.name}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="flex justify-center">
                                                        <Checkbox
                                                            checked={perm.mode === "inherit"}
                                                            onCheckedChange={() => updatePermission(group.id, perm.id, "inherit")}
                                                            className="h-5 w-5"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="flex justify-center">
                                                        <Checkbox
                                                            checked={perm.mode === "own"}
                                                            onCheckedChange={() => updatePermission(group.id, perm.id, "own")}
                                                            className="h-5 w-5"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="flex justify-center">
                                                        <Checkbox
                                                            checked={perm.mode === "full"}
                                                            onCheckedChange={() => updatePermission(group.id, perm.id, "full")}
                                                            className="h-5 w-5"
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Save Button */}
                <div className="p-4 border-t flex justify-end bg-background">
                    <Button onClick={handleSave} className="shadow-lg shadow-primary/20">
                        Lưu quyền ACL
                    </Button>
                </div>
            </Card>

        </div >
    );
}
