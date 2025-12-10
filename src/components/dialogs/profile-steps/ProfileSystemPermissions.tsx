import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ProfileFormData, MenuPermission } from "../CreateProfileDialog";

interface ProfileSystemPermissionsProps {
  data: ProfileFormData;
  onChange: (data: Partial<ProfileFormData>) => void;
}

// Mock menu items
const mockMenuItems: Record<string, MenuPermission[]> = {
  ticket: [
    { menuId: "ticket_list", menuName: "Danh sách Ticket", description: "Xem và quản lý ticket", canView: false, canCreate: false, canUpdate: false, canDelete: false },
    { menuId: "ticket_report", menuName: "Báo cáo Ticket", description: "Xem báo cáo và thống kê", canView: false, canCreate: false, canUpdate: false, canDelete: false },
    { menuId: "ticket_config", menuName: "Cấu hình Ticket", description: "Cấu hình hệ thống ticket", canView: false, canCreate: false, canUpdate: false, canDelete: false },
  ],
  dq: [
    { menuId: "dq_rules", menuName: "Quản lý Rules", description: "Quản lý quy tắc DQ", canView: false, canCreate: false, canUpdate: false, canDelete: false },
    { menuId: "dq_monitor", menuName: "Giám sát DQ", description: "Theo dõi chất lượng dữ liệu", canView: false, canCreate: false, canUpdate: false, canDelete: false },
    { menuId: "dq_report", menuName: "Báo cáo DQ", description: "Xem báo cáo DQ", canView: false, canCreate: false, canUpdate: false, canDelete: false },
  ],
  bi: [
    { menuId: "bi_dashboard", menuName: "Dashboard", description: "Xem dashboard BI", canView: false, canCreate: false, canUpdate: false, canDelete: false },
    { menuId: "bi_report", menuName: "Báo cáo", description: "Quản lý báo cáo", canView: false, canCreate: false, canUpdate: false, canDelete: false },
    { menuId: "bi_data", menuName: "Dữ liệu", description: "Quản lý nguồn dữ liệu", canView: false, canCreate: false, canUpdate: false, canDelete: false },
  ],
  admin: [
    { menuId: "admin_users", menuName: "Quản lý User", description: "Quản lý người dùng", canView: false, canCreate: false, canUpdate: false, canDelete: false },
    { menuId: "admin_roles", menuName: "Quản lý Roles", description: "Quản lý vai trò", canView: false, canCreate: false, canUpdate: false, canDelete: false },
    { menuId: "admin_system", menuName: "Cấu hình hệ thống", description: "Cấu hình chung", canView: false, canCreate: false, canUpdate: false, canDelete: false },
  ],
};

export function ProfileSystemPermissions({ data, onChange }: ProfileSystemPermissionsProps) {
  const [selectedSystem, setSelectedSystem] = useState("ticket");

  const currentMenus = mockMenuItems[selectedSystem] || [];

  const togglePermission = (menuId: string, field: keyof Pick<MenuPermission, "canView" | "canCreate" | "canUpdate" | "canDelete">) => {
    const existingPerms = data.systemPermissions;
    const existingPerm = existingPerms.find((p) => p.menuId === menuId);

    if (existingPerm) {
      // Update existing
      const updatedPerms = existingPerms.map((p) =>
        p.menuId === menuId ? { ...p, [field]: !p[field] } : p
      );
      onChange({ systemPermissions: updatedPerms });
    } else {
      // Add new
      const menuItem = currentMenus.find((m) => m.menuId === menuId);
      if (menuItem) {
        const newPerm = { ...menuItem, [field]: true };
        onChange({ systemPermissions: [...existingPerms, newPerm] });
      }
    }
  };

  const getPermissionValue = (menuId: string, field: keyof Pick<MenuPermission, "canView" | "canCreate" | "canUpdate" | "canDelete">) => {
    const perm = data.systemPermissions.find((p) => p.menuId === menuId);
    return perm ? perm[field] : false;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quyền hệ thống (RBAC)</h3>

        {/* Chọn hệ thống */}
        <div className="mb-6">
          <Select value={selectedSystem} onValueChange={setSelectedSystem}>
            <SelectTrigger className="w-64 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ticket">Hệ thống Ticket</SelectItem>
              <SelectItem value="dq">Hệ thống DQ</SelectItem>
              <SelectItem value="bi">Hệ thống BI</SelectItem>
              <SelectItem value="admin">Hệ thống Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bảng quyền menu */}
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-left font-medium">Menu</th>
                <th className="p-3 text-left font-medium">Mô tả</th>
                <th className="p-3 text-center font-medium">Xem / Truy cập</th>
                <th className="p-3 text-center font-medium">Tạo mới</th>
                <th className="p-3 text-center font-medium">Sửa</th>
                <th className="p-3 text-center font-medium">Xóa</th>
              </tr>
            </thead>
            <tbody>
              {currentMenus.map((menu) => (
                <tr key={menu.menuId} className="border-t hover:bg-muted/30">
                  <td className="p-3 font-medium">{menu.menuName}</td>
                  <td className="p-3 text-muted-foreground">{menu.description}</td>
                  <td className="p-3 text-center">
                    <Checkbox
                      checked={getPermissionValue(menu.menuId, "canView")}
                      onCheckedChange={() => togglePermission(menu.menuId, "canView")}
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Checkbox
                      checked={getPermissionValue(menu.menuId, "canCreate")}
                      onCheckedChange={() => togglePermission(menu.menuId, "canCreate")}
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Checkbox
                      checked={getPermissionValue(menu.menuId, "canUpdate")}
                      onCheckedChange={() => togglePermission(menu.menuId, "canUpdate")}
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Checkbox
                      checked={getPermissionValue(menu.menuId, "canDelete")}
                      onCheckedChange={() => togglePermission(menu.menuId, "canDelete")}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          💡 Đã cấu hình quyền cho <strong>{data.systemPermissions.length}</strong> menu item
        </div>
      </Card>
    </div>
  );
}
