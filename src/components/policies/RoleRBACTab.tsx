import { PermissionMatrix } from "./PermissionMatrix";

export function RoleRBACTab() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Ma trận phân quyền</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Quản lý quyền theo ma trận role × resource. Tick checkbox để cấp quyền, bỏ tick để thu quyền.
                </p>
            </div>

            {/* Permission Matrix */}
            <PermissionMatrix />
        </div>
    );
}
