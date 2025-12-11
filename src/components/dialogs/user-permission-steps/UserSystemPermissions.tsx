import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface MenuPermission {
  menuId: string;
  menuName: string;
  description: string;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

interface UserSystemPermissionsProps {
  systemId: string;
  permissions: any[];
  onChange: (permissions: any[]) => void;
}

// Mock menu items per system
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
  sqlwf: [
    { menuId: "sqlwf_query", menuName: "SQL Query", description: "Chạy truy vấn SQL", canView: false, canCreate: false, canUpdate: false, canDelete: false },
    { menuId: "sqlwf_history", menuName: "Lịch sử Query", description: "Xem lịch sử truy vấn", canView: false, canCreate: false, canUpdate: false, canDelete: false },
  ],
  dashboard: [
    { menuId: "dash_view", menuName: "Xem Dashboard", description: "Xem các dashboard", canView: false, canCreate: false, canUpdate: false, canDelete: false },
    { menuId: "dash_edit", menuName: "Chỉnh sửa Dashboard", description: "Tạo và chỉnh sửa dashboard", canView: false, canCreate: false, canUpdate: false, canDelete: false },
  ],
};

export function UserSystemPermissions({ systemId, permissions, onChange }: UserSystemPermissionsProps) {
  const currentMenus = mockMenuItems[systemId] || [];

  const togglePermission = (menuId: string, field: keyof Pick<MenuPermission, "canView" | "canCreate" | "canUpdate" | "canDelete">) => {
    const existingPerm = permissions.find((p) => p.menuId === menuId);

    if (existingPerm) {
      // Update existing
      const updatedPerms = permissions.map((p) =>
        p.menuId === menuId ? { ...p, [field]: !p[field] } : p
      );
      onChange(updatedPerms);
    } else {
      // Add new
      const menuItem = currentMenus.find((m) => m.menuId === menuId);
      if (menuItem) {
        const newPerm = { ...menuItem, [field]: true };
        onChange([...permissions, newPerm]);
      }
    }
  };

  const getPermissionValue = (menuId: string, field: keyof Pick<MenuPermission, "canView" | "canCreate" | "canUpdate" | "canDelete">) => {
    const perm = permissions.find((p) => p.menuId === menuId);
    return perm ? perm[field] : false;
  };

  return (
    <div className="space-y-4">
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

      <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
        💡 Đã cấu hình quyền cho <strong>{permissions.length}</strong> menu item
      </div>
    </div>
  );
}
