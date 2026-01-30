// Shared Actions data - dùng chung cho ActionsTab và CreateResourceForm

export interface ActionDefinition {
  id: number;
  code: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  status: "active" | "inactive";
  usageCount: number;
  createdAt: string;
}

export const ACTION_CATEGORIES = [
  { value: "CRUD", label: "CRUD (Thêm/Sửa/Xóa)" },
  { value: "List", label: "Danh sách/Tìm kiếm" },
  { value: "Workflow", label: "Workflow (Duyệt/Từ chối)" },
  { value: "Execute", label: "Thực thi" },
  { value: "Data", label: "Xuất/Nhập dữ liệu" },
  { value: "Collaborate", label: "Cộng tác" },
  { value: "Admin", label: "Quản trị" },
];

export const ACTION_ICONS = [
  "Plus", "Eye", "Pencil", "Trash2", "List", "Search", "Filter",
  "CheckCircle", "XCircle", "Send", "Ban", "Play", "Square", "Clock",
  "Download", "Upload", "Copy", "Share2", "UserPlus", "MessageSquare",
  "Settings", "Shield", "History"
];

// Master list of all available actions
export const SYSTEM_ACTIONS: ActionDefinition[] = [
  // CRUD Actions
  { id: 1, code: "create", name: "Tạo mới", description: "Tạo mới một đối tượng/bản ghi", category: "CRUD", icon: "Plus", status: "active", usageCount: 45, createdAt: "2025-01-15" },
  { id: 2, code: "read", name: "Xem", description: "Xem chi tiết một đối tượng/bản ghi", category: "CRUD", icon: "Eye", status: "active", usageCount: 52, createdAt: "2025-01-15" },
  { id: 3, code: "update", name: "Cập nhật", description: "Chỉnh sửa một đối tượng/bản ghi", category: "CRUD", icon: "Pencil", status: "active", usageCount: 48, createdAt: "2025-01-15" },
  { id: 4, code: "delete", name: "Xóa", description: "Xóa một đối tượng/bản ghi", category: "CRUD", icon: "Trash2", status: "active", usageCount: 35, createdAt: "2025-01-15" },
  
  // List/Search Actions
  { id: 5, code: "list", name: "Xem danh sách", description: "Xem danh sách các đối tượng", category: "List", icon: "List", status: "active", usageCount: 50, createdAt: "2025-01-15" },
  { id: 6, code: "search", name: "Tìm kiếm", description: "Tìm kiếm đối tượng theo điều kiện", category: "List", icon: "Search", status: "active", usageCount: 42, createdAt: "2025-01-15" },
  { id: 7, code: "filter", name: "Lọc dữ liệu", description: "Áp dụng bộ lọc trên danh sách", category: "List", icon: "Filter", status: "active", usageCount: 38, createdAt: "2025-01-15" },
  
  // Workflow Actions
  { id: 8, code: "approve", name: "Phê duyệt", description: "Phê duyệt yêu cầu/đối tượng", category: "Workflow", icon: "CheckCircle", status: "active", usageCount: 28, createdAt: "2025-01-16" },
  { id: 9, code: "reject", name: "Từ chối", description: "Từ chối yêu cầu/đối tượng", category: "Workflow", icon: "XCircle", status: "active", usageCount: 25, createdAt: "2025-01-16" },
  { id: 10, code: "submit", name: "Gửi duyệt", description: "Gửi yêu cầu để phê duyệt", category: "Workflow", icon: "Send", status: "active", usageCount: 30, createdAt: "2025-01-16" },
  { id: 11, code: "cancel", name: "Hủy", description: "Hủy yêu cầu/đối tượng", category: "Workflow", icon: "Ban", status: "active", usageCount: 20, createdAt: "2025-01-16" },
  
  // Execute Actions
  { id: 12, code: "execute", name: "Thực thi", description: "Chạy/thực thi một job hoặc task", category: "Execute", icon: "Play", status: "active", usageCount: 22, createdAt: "2025-01-17" },
  { id: 13, code: "stop", name: "Dừng", description: "Dừng việc thực thi", category: "Execute", icon: "Square", status: "active", usageCount: 15, createdAt: "2025-01-17" },
  { id: 14, code: "schedule", name: "Lên lịch", description: "Đặt lịch chạy tự động", category: "Execute", icon: "Clock", status: "active", usageCount: 18, createdAt: "2025-01-17" },
  
  // Export/Import Actions
  { id: 15, code: "export", name: "Xuất dữ liệu", description: "Xuất dữ liệu ra file (Excel, CSV...)", category: "Data", icon: "Download", status: "active", usageCount: 32, createdAt: "2025-01-18" },
  { id: 16, code: "import", name: "Nhập dữ liệu", description: "Nhập dữ liệu từ file", category: "Data", icon: "Upload", status: "active", usageCount: 25, createdAt: "2025-01-18" },
  { id: 17, code: "clone", name: "Sao chép", description: "Tạo bản sao của đối tượng", category: "Data", icon: "Copy", status: "active", usageCount: 20, createdAt: "2025-01-18" },
  
  // Share/Collaborate Actions
  { id: 18, code: "share", name: "Chia sẻ", description: "Chia sẻ với người dùng khác", category: "Collaborate", icon: "Share2", status: "active", usageCount: 15, createdAt: "2025-01-19" },
  { id: 19, code: "assign", name: "Gán/Phân công", description: "Gán đối tượng cho người khác xử lý", category: "Collaborate", icon: "UserPlus", status: "active", usageCount: 22, createdAt: "2025-01-19" },
  { id: 20, code: "comment", name: "Bình luận", description: "Thêm comment/ghi chú", category: "Collaborate", icon: "MessageSquare", status: "active", usageCount: 18, createdAt: "2025-01-19" },
  
  // Admin Actions
  { id: 21, code: "configure", name: "Cấu hình", description: "Cấu hình thiết lập hệ thống", category: "Admin", icon: "Settings", status: "active", usageCount: 10, createdAt: "2025-01-20" },
  { id: 22, code: "manage_permission", name: "Phân quyền", description: "Quản lý quyền truy cập", category: "Admin", icon: "Shield", status: "active", usageCount: 8, createdAt: "2025-01-20" },
  { id: 23, code: "audit", name: "Xem audit log", description: "Xem lịch sử thay đổi", category: "Admin", icon: "History", status: "active", usageCount: 12, createdAt: "2025-01-20" },
];

// Helper function to get actions by category
export function getActionsByCategory(category: string): ActionDefinition[] {
  return SYSTEM_ACTIONS.filter(a => a.category === category && a.status === "active");
}

// Helper function to get active actions only
export function getActiveActions(): ActionDefinition[] {
  return SYSTEM_ACTIONS.filter(a => a.status === "active");
}

// Helper function to get actions grouped by category
export function getActionsGroupedByCategory(): Record<string, ActionDefinition[]> {
  return SYSTEM_ACTIONS.reduce((acc, action) => {
    if (action.status === "active") {
      if (!acc[action.category]) {
        acc[action.category] = [];
      }
      acc[action.category].push(action);
    }
    return acc;
  }, {} as Record<string, ActionDefinition[]>);
}
