import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Plus, Info, RotateCcw, X,
  Settings, Database, ChevronDown, ChevronUp, Eye, Pencil, Copy, Trash2,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

// Types
interface Permission {
  id: string;
  name: string;
  description?: string;
}

interface MenuItem {
  id: string;
  name: string;
  resourceType?: string;
  permissions: Permission[];
}

interface DataCondition {
  id: string;
  resourceAttr: string;
  operator: string;
  valueType: "user_attr" | "static";
  value: string;
}

interface DataPolicy {
  resourceType: string;
  resourceName: string;
  isUnlimited: boolean;
  logic: "AND" | "OR";
  conditions: DataCondition[];
}

interface Profile {
  id: number;
  name: string;
  description: string;
  system: string;
  status: "active" | "inactive";
  systemPermissions: Record<string, string[]>;
  dataPolicies: DataPolicy[];
  createdAt: string;
  updatedAt: string;
}

// Resource attributes cho condition builder
const resourceAttributes = [
  { id: "owner_unit", label: "Đơn vị sở hữu", forResources: ["table", "sql", "job", "task", "upload", "category", "data", "migrate", "glossary", "dictionary", "news", "dq", "feature"] },
  { id: "created_by", label: "Người tạo", forResources: ["table", "sql", "job", "task", "upload", "category", "data", "migrate", "glossary", "dictionary", "news", "dq", "feature"] },
  { id: "branch", label: "Chi nhánh", forResources: ["table", "sql", "job", "data", "news"] },
  { id: "status", label: "Trạng thái", forResources: ["table", "sql", "job", "task", "upload", "category", "data", "migrate"] },
  { id: "sensitivity", label: "Độ nhạy cảm", forResources: ["table", "sql", "data", "glossary", "dictionary"] },
  { id: "category", label: "Danh mục", forResources: ["table", "sql", "feature", "news", "glossary", "dictionary"] },
];

const operators = [
  { id: "eq", label: "bằng" },
  { id: "neq", label: "khác" },
  { id: "in", label: "thuộc" },
  { id: "contains", label: "chứa" },
];

const userAttributes = [
  { id: "unit", label: "Đơn vị của người dùng" },
  { id: "branch", label: "Chi nhánh của người dùng" },
  { id: "username", label: "Tên đăng nhập" },
  { id: "role", label: "Vai trò" },
  { id: "team", label: "Nhóm/Team" },
];

// Flat list menus (không nhóm)
const menuItems: MenuItem[] = [
  {
    id: "table_mgmt",
    name: "Quản lý bảng",
    resourceType: "table",
    permissions: [
      { id: "table_create", name: "Tạo", description: "Tạo bảng dữ liệu mới" },
      { id: "table_view", name: "Xem", description: "Xem thông tin bảng" },
      { id: "table_edit", name: "Sửa", description: "Chỉnh sửa thông tin bảng" },
      { id: "table_delete", name: "Xóa", description: "Xóa bảng dữ liệu" },
      { id: "table_search", name: "Tìm kiếm", description: "Tìm kiếm bảng" },
      { id: "table_upload", name: "Upload", description: "Upload metadata" },
    ],
  },
  {
    id: "sql_mgmt",
    name: "Quản lý SQL",
    resourceType: "sql",
    permissions: [
      { id: "sql_create", name: "Tạo", description: "Tạo truy vấn SQL mới" },
      { id: "sql_view", name: "Xem", description: "Xem truy vấn" },
      { id: "sql_edit", name: "Sửa", description: "Chỉnh sửa truy vấn" },
      { id: "sql_delete", name: "Xóa", description: "Xóa truy vấn SQL" },
      { id: "sql_clone", name: "Clone", description: "Sao chép truy vấn" },
      { id: "sql_execute", name: "Thực thi", description: "Chạy truy vấn SQL" },
    ],
  },
  {
    id: "data_mgmt_menu",
    name: "Quản lý dữ liệu",
    resourceType: "data",
    permissions: [
      { id: "data_view", name: "Xem", description: "Xem dữ liệu" },
      { id: "data_edit", name: "Sửa", description: "Chỉnh sửa dữ liệu" },
      { id: "data_import", name: "Import", description: "Nhập dữ liệu" },
      { id: "data_export", name: "Export", description: "Xuất dữ liệu" },
    ],
  },
  {
    id: "category_mgmt",
    name: "Quản lý danh mục",
    resourceType: "category",
    permissions: [
      { id: "cat_create", name: "Tạo", description: "Tạo danh mục mới" },
      { id: "cat_view", name: "Xem", description: "Xem danh mục" },
      { id: "cat_edit", name: "Sửa", description: "Chỉnh sửa danh mục" },
      { id: "cat_delete", name: "Xóa", description: "Xóa danh mục" },
    ],
  },
  {
    id: "job_mgmt",
    name: "Quản lý Job",
    resourceType: "job",
    permissions: [
      { id: "job_create", name: "Tạo", description: "Tạo job mới" },
      { id: "job_view", name: "Xem", description: "Xem job" },
      { id: "job_edit", name: "Sửa", description: "Chỉnh sửa job" },
      { id: "job_delete", name: "Xóa", description: "Xóa job" },
      { id: "job_approve", name: "Phê duyệt", description: "Phê duyệt job" },
      { id: "job_execute", name: "Chạy", description: "Thực thi job" },
    ],
  },
  {
    id: "task_mgmt",
    name: "Quản lý Task",
    resourceType: "task",
    permissions: [
      { id: "task_create", name: "Tạo", description: "Tạo task mới" },
      { id: "task_view", name: "Xem", description: "Xem task" },
      { id: "task_edit", name: "Sửa", description: "Chỉnh sửa task" },
      { id: "task_delete", name: "Xóa", description: "Xóa task" },
      { id: "task_assign", name: "Phân công", description: "Phân công task" },
    ],
  },
  {
    id: "upload_mgmt",
    name: "Quản lý Upload",
    resourceType: "upload",
    permissions: [
      { id: "upload_create", name: "Upload", description: "Upload file mới" },
      { id: "upload_view", name: "Xem", description: "Xem lịch sử upload" },
      { id: "upload_delete", name: "Xóa", description: "Xóa file đã upload" },
      { id: "upload_approve", name: "Phê duyệt", description: "Phê duyệt file upload" },
    ],
  },
  {
    id: "migrate_mgmt",
    name: "Data Migrate",
    resourceType: "migrate",
    permissions: [
      { id: "migrate_create", name: "Tạo", description: "Tạo migration mới" },
      { id: "migrate_view", name: "Xem", description: "Xem migration" },
      { id: "migrate_execute", name: "Chạy", description: "Thực thi migration" },
      { id: "migrate_rollback", name: "Rollback", description: "Hoàn tác migration" },
    ],
  },
  {
    id: "glossary_mgmt",
    name: "Data Glossary",
    resourceType: "glossary",
    permissions: [
      { id: "glossary_create", name: "Tạo", description: "Tạo thuật ngữ mới" },
      { id: "glossary_view", name: "Xem", description: "Xem thuật ngữ" },
      { id: "glossary_edit", name: "Sửa", description: "Chỉnh sửa thuật ngữ" },
      { id: "glossary_delete", name: "Xóa", description: "Xóa thuật ngữ" },
      { id: "glossary_approve", name: "Phê duyệt", description: "Phê duyệt thuật ngữ" },
    ],
  },
  {
    id: "dictionary_mgmt",
    name: "Data Dictionary",
    resourceType: "dictionary",
    permissions: [
      { id: "dict_create", name: "Tạo", description: "Tạo định nghĩa mới" },
      { id: "dict_view", name: "Xem", description: "Xem Data Dictionary" },
      { id: "dict_edit", name: "Sửa", description: "Chỉnh sửa định nghĩa" },
      { id: "dict_delete", name: "Xóa", description: "Xóa định nghĩa" },
    ],
  },
  {
    id: "dq_mgmt",
    name: "Data Quality",
    resourceType: "dq",
    permissions: [
      { id: "dq_view", name: "Xem", description: "Xem báo cáo DQ" },
      { id: "dq_manage_rule", name: "Quản lý rule", description: "Tạo/sửa DQ rules" },
      { id: "dq_manage_alert", name: "Cảnh báo", description: "Cấu hình cảnh báo" },
    ],
  },
  {
    id: "feature_mgmt",
    name: "Quản lý Feature",
    resourceType: "feature",
    permissions: [
      { id: "feature_create", name: "Tạo", description: "Tạo feature mới" },
      { id: "feature_view", name: "Xem", description: "Xem feature" },
      { id: "feature_edit", name: "Sửa", description: "Chỉnh sửa feature" },
      { id: "feature_delete", name: "Xóa", description: "Xóa feature" },
      { id: "feature_upload", name: "Upload", description: "Upload feature" },
      { id: "feature_download", name: "Download", description: "Download feature" },
    ],
  },
  {
    id: "news_mgmt",
    name: "Quản lý tin tức",
    resourceType: "news",
    permissions: [
      { id: "news_create", name: "Tạo", description: "Tạo tin tức mới" },
      { id: "news_view", name: "Xem", description: "Xem tin tức" },
      { id: "news_edit", name: "Sửa", description: "Chỉnh sửa tin tức" },
      { id: "news_delete", name: "Xóa", description: "Xóa tin tức" },
      { id: "news_publish", name: "Xuất bản", description: "Xuất bản tin tức" },
    ],
  },
];

// Mock profiles
const mockProfiles: Profile[] = [
  { 
    id: 1, 
    name: "BDA Standard", 
    description: "Quyền chuẩn cho Business Data Analyst",
    system: "SQLWF",
    status: "active",
    systemPermissions: {
      "table_mgmt": ["table_create", "table_edit", "table_search", "table_view", "table_upload"],
      "sql_mgmt": ["sql_create", "sql_edit", "sql_clone", "sql_execute"],
      "job_mgmt": ["job_create", "job_view"],
    },
    dataPolicies: [
      { 
        resourceType: "table", 
        resourceName: "Bảng dữ liệu",
        isUnlimited: false, 
        logic: "AND",
        conditions: [
          { id: "1", resourceAttr: "owner_unit", operator: "eq", valueType: "user_attr", value: "unit" },
          { id: "2", resourceAttr: "created_by", operator: "eq", valueType: "user_attr", value: "username" },
        ]
      },
    ],
    createdAt: "2026-01-15",
    updatedAt: "2026-01-28",
  },
  { 
    id: 2, 
    name: "Teller Basic", 
    description: "Quyền cơ bản cho giao dịch viên",
    system: "SQLWF",
    status: "active",
    systemPermissions: {
      "table_mgmt": ["table_search", "table_view"],
      "sql_mgmt": ["sql_view"],
    },
    dataPolicies: [],
    createdAt: "2026-01-10",
    updatedAt: "2026-01-25",
  },
  { 
    id: 3, 
    name: "Admin Full Access", 
    description: "Quyền đầy đủ cho quản trị viên",
    system: "SQLWF",
    status: "active",
    systemPermissions: {
      "table_mgmt": ["table_create", "table_edit", "table_delete", "table_search", "table_view", "table_upload"],
      "sql_mgmt": ["sql_create", "sql_view", "sql_edit", "sql_delete", "sql_clone", "sql_execute"],
      "job_mgmt": ["job_create", "job_view", "job_edit", "job_delete", "job_approve", "job_execute"],
    },
    dataPolicies: [
      { resourceType: "table", resourceName: "Bảng dữ liệu", isUnlimited: true, logic: "AND", conditions: [] },
    ],
    createdAt: "2026-01-05",
    updatedAt: "2026-01-20",
  },
  { 
    id: 4, 
    name: "Viewer Only", 
    description: "Chỉ có quyền xem",
    system: "vDVS",
    status: "inactive",
    systemPermissions: {
      "table_mgmt": ["table_search", "table_view"],
      "sql_mgmt": ["sql_view"],
    },
    dataPolicies: [],
    createdAt: "2026-01-08",
    updatedAt: "2026-01-22",
  },
  { 
    id: 5, 
    name: "Data Quality Manager", 
    description: "Quản lý chất lượng dữ liệu",
    system: "SQLWF",
    status: "active",
    systemPermissions: {
      "dq_mgmt": ["dq_view", "dq_manage_rule", "dq_manage_alert"],
    },
    dataPolicies: [],
    createdAt: "2026-01-12",
    updatedAt: "2026-01-27",
  },
];

export function ProfilesTab() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [systemFilter, setSystemFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [profiles, setProfiles] = useState<Profile[]>(mockProfiles);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  // Panel states
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<"create" | "edit" | "view">("create");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState("system");
  
  // Form states
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formSystem, setFormSystem] = useState("SQLWF");
  const [formStatus, setFormStatus] = useState<"active" | "draft">("active");
  const [formPermissions, setFormPermissions] = useState<Record<string, string[]>>({});
  const [formDataPolicies, setFormDataPolicies] = useState<DataPolicy[]>([]);
  const [menuSearchTerm, setMenuSearchTerm] = useState("");
  const [expandedPolicies, setExpandedPolicies] = useState<number[]>([]);

  // Helper: Get selected resources from system permissions
  const getSelectedResources = () => {
    const resources: { type: string; name: string }[] = [];
    
    Object.keys(formPermissions).forEach(menuId => {
      if (formPermissions[menuId].length > 0) {
        const menu = menuItems.find(m => m.id === menuId);
        if (menu?.resourceType) {
          if (!resources.find(r => r.type === menu.resourceType)) {
            resources.push({
              type: menu.resourceType,
              name: menu.name,
            });
          }
        }
      }
    });
    return resources;
  };

  // Handlers
  const handleCreate = () => {
    setPanelMode("create");
    setFormName("");
    setFormDescription("");
    setFormSystem("SQLWF");
    setFormStatus("active");
    setFormPermissions({});
    setFormDataPolicies([]);
    setActiveTab("system");
    setMenuSearchTerm("");
    setIsPanelOpen(true);
  };

  const handleView = (profile: Profile) => {
    setPanelMode("view");
    setSelectedProfile(profile);
    setFormName(profile.name);
    setFormDescription(profile.description);
    setFormSystem(profile.system);
    setFormPermissions(profile.systemPermissions);
    setFormDataPolicies(profile.dataPolicies);
    setActiveTab("system");
    setMenuSearchTerm("");
    setIsPanelOpen(true);
  };

  const handleEdit = (profile: Profile) => {
    setPanelMode("edit");
    setSelectedProfile(profile);
    setFormName(profile.name);
    setFormDescription(profile.description);
    setFormSystem(profile.system);
    setFormStatus(profile.status === "active" ? "active" : "draft");
    setFormPermissions(profile.systemPermissions);
    setFormDataPolicies(profile.dataPolicies);
    setActiveTab("system");
    setMenuSearchTerm("");
    setIsPanelOpen(true);
  };

  const handleClone = (profile: Profile) => {
    toast({
      title: "Đã sao chép",
      description: `Profile "${profile.name}" đã được sao chép.`,
    });
  };

  const handleDelete = (profile: Profile) => {
    toast({
      title: "Đã xóa",
      description: `Profile "${profile.name}" đã được xóa.`,
      variant: "destructive",
    });
  };

  const handleSave = () => {
    if (!formName.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên profile",
        variant: "destructive",
      });
      return;
    }

    if (panelMode === "create") {
      toast({
        title: "Tạo thành công",
        description: `Profile "${formName}" đã được tạo.`,
      });
    } else {
      toast({
        title: "Cập nhật thành công",
        description: `Profile "${formName}" đã được cập nhật.`,
      });
    }
    setIsPanelOpen(false);
  };

  const togglePermission = (menuId: string, permId: string) => {
    if (panelMode === "view") return;
    
    setFormPermissions(prev => {
      const menuPerms = prev[menuId] || [];
      const newMenuPerms = menuPerms.includes(permId)
        ? menuPerms.filter(id => id !== permId)
        : [...menuPerms, permId];
      
      if (newMenuPerms.length === 0) {
        const { [menuId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [menuId]: newMenuPerms };
    });
  };

  const toggleAllMenuPermissions = (menuId: string, menu: MenuItem) => {
    if (panelMode === "view") return;
    
    const currentPerms = formPermissions[menuId] || [];
    const allPerms = menu.permissions.map(p => p.id);
    
    if (currentPerms.length === allPerms.length) {
      const { [menuId]: _, ...rest } = formPermissions;
      setFormPermissions(rest);
    } else {
      setFormPermissions(prev => ({ ...prev, [menuId]: allPerms }));
    }
  };

  // Data Policy handlers
  const initializeDataPolicies = () => {
    const resources = getSelectedResources();
    const existingTypes = formDataPolicies.map(p => p.resourceType);
    
    // Add new resources that don't have policies yet
    const newPolicies = [...formDataPolicies];
    resources.forEach(res => {
      if (!existingTypes.includes(res.type)) {
        newPolicies.push({
          resourceType: res.type,
          resourceName: res.name,
          isUnlimited: true,
          logic: "AND",
          conditions: [],
        });
      }
    });
    
    // Remove policies for resources no longer selected
    const filteredPolicies = newPolicies.filter(p => 
      resources.find(r => r.type === p.resourceType)
    );
    
    setFormDataPolicies(filteredPolicies);
  };

  const toggleUnlimited = (index: number) => {
    if (panelMode === "view") return;
    setFormDataPolicies(prev => prev.map((p, i) => 
      i === index ? { ...p, isUnlimited: !p.isUnlimited, conditions: p.isUnlimited ? [] : p.conditions } : p
    ));
  };

  const addCondition = (policyIndex: number) => {
    if (panelMode === "view") return;
    setFormDataPolicies(prev => prev.map((p, i) => {
      if (i !== policyIndex) return p;
      const resourceType = p.resourceType;
      const availableAttrs = resourceAttributes.filter(a => a.forResources.includes(resourceType));
      const defaultAttr = availableAttrs[0]?.id || "owner_unit";
      
      return {
        ...p,
        conditions: [...p.conditions, {
          id: Date.now().toString(),
          resourceAttr: defaultAttr,
          operator: "eq",
          valueType: "user_attr" as const,
          value: "unit",
        }]
      };
    }));
  };

  const updateCondition = (policyIndex: number, condIndex: number, field: keyof DataCondition, value: string) => {
    if (panelMode === "view") return;
    setFormDataPolicies(prev => prev.map((p, i) => {
      if (i !== policyIndex) return p;
      return {
        ...p,
        conditions: p.conditions.map((c, ci) => 
          ci === condIndex ? { ...c, [field]: value } : c
        )
      };
    }));
  };

  const removeCondition = (policyIndex: number, condIndex: number) => {
    if (panelMode === "view") return;
    setFormDataPolicies(prev => prev.map((p, i) => {
      if (i !== policyIndex) return p;
      return {
        ...p,
        conditions: p.conditions.filter((_, ci) => ci !== condIndex)
      };
    }));
  };

  // Toggle status
  const handleToggleStatus = (profile: Profile) => {
    setProfiles(prev => prev.map(p => 
      p.id === profile.id 
        ? { ...p, status: p.status === "active" ? "inactive" : "active" } 
        : p
    ));
    toast({
      title: "Đã cập nhật trạng thái",
      description: `Profile "${profile.name}" đã được ${profile.status === "active" ? "tắt" : "bật"}.`,
    });
  };

  const handleReset = () => {
    setSearchTerm("");
    setSystemFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    toast({
      title: "Đang tìm kiếm",
      description: `Tìm với từ khóa: "${searchTerm}"`,
    });
  };

  // Filter menus by search
  const filterMenus = (menus: MenuItem[]) => {
    if (!menuSearchTerm) return menus;
    return menus.filter(menu => 
      menu.name.toLowerCase().includes(menuSearchTerm.toLowerCase())
    );
  };

  // Filter profiles
  const filteredProfiles = profiles.filter(profile => {
    const matchSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       profile.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSystem = systemFilter === "all" || profile.system === systemFilter;
    const matchStatus = statusFilter === "all" || profile.status === statusFilter;
    return matchSearch && matchSystem && matchStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProfiles.length / pageSize) || 1;
  const paginatedProfiles = filteredProfiles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Danh sách Profile quyền</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    Profile quyền là gói quyền được định nghĩa sẵn, có thể gán cho nhiều người dùng.
                    Mỗi profile bao gồm quyền hệ thống và quyền dữ liệu.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-muted-foreground">
            Tạo và quản lý các gói quyền để gán cho người dùng
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" />
          Tạo profile mới
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 bg-card/50 border border-border/50 rounded-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên, mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9 bg-background/50 border-border/50"
          />
        </div>
        <Select value={systemFilter} onValueChange={setSystemFilter}>
          <SelectTrigger className="w-44 bg-background/50 border-border/50">
            <SelectValue placeholder="Hệ thống" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả hệ thống</SelectItem>
            <SelectItem value="SQLWF">SQLWF</SelectItem>
            <SelectItem value="vDVS">vDVS</SelectItem>
            <SelectItem value="VTM">VTM</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44 bg-background/50 border-border/50">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button variant="default" onClick={handleSearch} className="gap-2">
            <Search className="h-4 w-4" />
            Tìm kiếm
          </Button>
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Profiles Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border bg-muted/50">
              <TableHead className="font-semibold text-foreground/70 w-16">STT</TableHead>
              <TableHead className="font-semibold text-foreground/70">Tên profile</TableHead>
              <TableHead className="font-semibold text-foreground/70">Hệ thống</TableHead>
              <TableHead className="font-semibold text-foreground/70">Mô tả</TableHead>
              <TableHead className="font-semibold text-foreground/70 w-24">Trạng thái</TableHead>
              <TableHead className="font-semibold text-foreground/70">Ngày tạo</TableHead>
              <TableHead className="font-semibold text-foreground/70">Ngày cập nhật</TableHead>
              <TableHead className="font-semibold text-foreground/70 text-center w-36">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProfiles.length > 0 ? (
              paginatedProfiles.map((profile, idx) => (
                <TableRow key={profile.id} className="border-border transition-colors">
                  <TableCell className="py-3 text-muted-foreground">{(currentPage - 1) * pageSize + idx + 1}</TableCell>
                  <TableCell className="py-3">
                    <span className="font-medium text-foreground">{profile.name}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge variant="outline">{profile.system}</Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-sm text-muted-foreground">{profile.description}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <Switch
                      checked={profile.status === "active"}
                      onCheckedChange={() => handleToggleStatus(profile)}
                    />
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-sm text-muted-foreground">{formatDate(profile.createdAt)}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-sm text-muted-foreground">{formatDate(profile.updatedAt)}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        onClick={() => handleView(profile)}
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        onClick={() => handleEdit(profile)}
                        title="Chỉnh sửa"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        onClick={() => handleClone(profile)}
                        title="Sao chép"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(profile)}
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 pt-2">
        <div className="text-sm text-muted-foreground">
          Hiển thị {paginatedProfiles.length} trên tổng số {filteredProfiles.length} kết quả
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground px-2">
            Trang {currentPage} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Side Panel */}
      <Sheet open={isPanelOpen} onOpenChange={setIsPanelOpen}>
        <SheetContent className="w-full sm:max-w-4xl overflow-hidden flex flex-col p-0">
          {/* Header */}
          <div className="px-6 py-4 border-b bg-muted/30">
            <SheetHeader>
              <SheetTitle className="text-xl">
                {panelMode === "create" ? "Tạo profile quyền mới" : 
                 panelMode === "edit" ? "Chỉnh sửa profile" : 
                 `Chi tiết: ${selectedProfile?.name}`}
              </SheetTitle>
              <SheetDescription>
                {panelMode === "view" 
                  ? "Xem thông tin chi tiết profile quyền"
                  : "Cấu hình quyền hệ thống và quyền dữ liệu cho profile"
                }
              </SheetDescription>
            </SheetHeader>
            
            {/* Thông tin chung - layout 3 dòng */}
            <div className="space-y-3 mt-4">
              {/* Row 1: Tên profile */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs text-muted-foreground">Tên profile *</Label>
                <Input
                  id="name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ví dụ: BDA Standard"
                  disabled={panelMode === "view"}
                  className="h-9"
                />
              </div>
              {/* Row 2: Mô tả */}
              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs text-muted-foreground">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Mô tả về profile quyền này..."
                  disabled={panelMode === "view"}
                  className="resize-none"
                  rows={2}
                />
              </div>
              {/* Row 3: Hệ thống + Trạng thái */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Hệ thống</Label>
                  <Select value={formSystem} onValueChange={setFormSystem} disabled={panelMode === "view"}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SQLWF">SQLWF</SelectItem>
                      <SelectItem value="vDVS">vDVS</SelectItem>
                      <SelectItem value="VTM">VTM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Trạng thái</Label>
                  <Select 
                    value={formStatus} 
                    onValueChange={(v) => setFormStatus(v as "active" | "draft")}
                    disabled={panelMode === "view"}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => {
            setActiveTab(v);
            if (v === "data") {
              initializeDataPolicies();
            }
          }} className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 pt-4 border-b">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="system" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Quyền hệ thống
                </TabsTrigger>
                <TabsTrigger value="data" className="gap-2">
                  <Database className="h-4 w-4" />
                  Quyền dữ liệu
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab 1: Quyền hệ thống */}
            <TabsContent value="system" className="flex-1 overflow-hidden m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <div className="px-6 py-3 border-b bg-muted/20">
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm menu..."
                    value={menuSearchTerm}
                    onChange={(e) => setMenuSearchTerm(e.target.value)}
                    className="pl-9 h-8 text-sm"
                  />
                </div>
              </div>
              
              <ScrollArea className="flex-1">
                <div className="p-6">
                  <div className="border rounded-xl overflow-hidden divide-y">
                    {filterMenus(menuItems).map((menu) => {
                      const selectedPerms = formPermissions[menu.id] || [];
                      const allSelected = selectedPerms.length === menu.permissions.length;
                      const someSelected = selectedPerms.length > 0 && !allSelected;

                      return (
                        <div key={menu.id} className="bg-background">
                          {/* Menu Row */}
                          <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/20">
                            <div 
                              className="flex items-center gap-2 min-w-[180px]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Checkbox
                                checked={allSelected}
                                ref={(el) => {
                                  if (el) (el as any).indeterminate = someSelected;
                                }}
                                onCheckedChange={() => toggleAllMenuPermissions(menu.id, menu)}
                                disabled={panelMode === "view"}
                              />
                              <span className="text-sm font-medium">{menu.name}</span>
                            </div>
                            
                            {/* Permissions inline */}
                            <div className="flex-1 flex flex-wrap gap-2">
                              {menu.permissions.map((perm) => (
                                <label
                                  key={perm.id}
                                  className={`
                                    inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs cursor-pointer transition-all
                                    ${selectedPerms.includes(perm.id) 
                                      ? 'bg-primary/10 text-primary border border-primary/30' 
                                      : 'bg-muted/50 text-muted-foreground border border-transparent hover:bg-muted'
                                    }
                                    ${panelMode === "view" ? 'cursor-default' : ''}
                                  `}
                                >
                                  <Checkbox
                                    id={perm.id}
                                    checked={selectedPerms.includes(perm.id)}
                                    onCheckedChange={() => togglePermission(menu.id, perm.id)}
                                    disabled={panelMode === "view"}
                                    className="h-3 w-3"
                                  />
                                  <span>{perm.name}</span>
                                  {perm.description && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Info className="h-3 w-3 opacity-50" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="text-xs">{perm.description}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {filterMenus(menuItems).length === 0 && menuSearchTerm && (
                    <div className="text-center py-8 text-muted-foreground">
                      Không tìm thấy menu phù hợp
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Tab 2: Quyền dữ liệu */}
            <TabsContent value="data" className="flex-1 overflow-hidden m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <ScrollArea className="flex-1">
                <div className="p-6 space-y-4">
                  {formDataPolicies.length === 0 ? (
                    <div className="text-center py-12 border rounded-xl border-dashed">
                      <Database className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground mb-2">Chưa có tài nguyên nào được chọn</p>
                      <p className="text-sm text-muted-foreground">
                        Vui lòng chọn ít nhất một menu ở tab "Quyền hệ thống" trước
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setActiveTab("system")}
                      >
                        Quay lại chọn quyền
                      </Button>
                    </div>
                  ) : (
                    formDataPolicies.map((policy, pIndex) => {
                      const availableAttrs = resourceAttributes.filter(a => 
                        a.forResources.includes(policy.resourceType)
                      );

                      return (
                        <div key={pIndex} className="border rounded-xl overflow-hidden">
                          {/* Resource Header */}
                          <div 
                            className="flex items-center justify-between gap-3 p-3 bg-muted/30 cursor-pointer hover:bg-muted/40 transition-colors"
                            onClick={() => {
                              setExpandedPolicies(prev => 
                                prev.includes(pIndex) 
                                  ? prev.filter(i => i !== pIndex)
                                  : [...prev, pIndex]
                              );
                            }}
                          >
                            <div className="flex items-center gap-2">
                              {expandedPolicies.includes(pIndex) ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              )}
                              <h4 className="font-medium">{policy.resourceName}</h4>
                              {!policy.isUnlimited && policy.conditions.length > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  {policy.conditions.length} điều kiện
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <Checkbox
                                  checked={policy.isUnlimited}
                                  onCheckedChange={() => toggleUnlimited(pIndex)}
                                  disabled={panelMode === "view"}
                                />
                                <span className="text-sm">Không giới hạn</span>
                              </label>
                            </div>
                          </div>

                          {/* Conditions - only show if expanded */}
                          {!policy.isUnlimited && expandedPolicies.includes(pIndex) && (
                            <div className="p-3 space-y-2 bg-background">
                              {/* Condition rows */}
                              {policy.conditions.map((cond, cIndex) => (
                                <div key={cond.id} className="flex items-center gap-2 p-2 bg-muted/20 rounded-lg border border-border/50">
                                    <div className="flex-1 grid grid-cols-3 gap-2">
                                      {/* Resource Attribute */}
                                      <Select 
                                        value={cond.resourceAttr}
                                        onValueChange={(v) => updateCondition(pIndex, cIndex, 'resourceAttr', v)}
                                        disabled={panelMode === "view"}
                                      >
                                        <SelectTrigger className="w-full h-9">
                                          <SelectValue placeholder="Chọn trường dữ liệu" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {availableAttrs.map(attr => (
                                            <SelectItem key={attr.id} value={attr.id}>
                                              {attr.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>

                                      {/* Operator */}
                                      <Select 
                                        value={cond.operator}
                                        onValueChange={(v) => updateCondition(pIndex, cIndex, 'operator', v)}
                                        disabled={panelMode === "view"}
                                      >
                                        <SelectTrigger className="w-full h-9">
                                          <SelectValue placeholder="Chọn toán tử" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {operators.map(op => (
                                            <SelectItem key={op.id} value={op.id}>
                                              {op.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>

                                      {/* Value - always textbox */}
                                      <Input
                                        value={cond.value}
                                        onChange={(e) => updateCondition(pIndex, cIndex, 'value', e.target.value)}
                                        placeholder="Nhập giá trị"
                                        disabled={panelMode === "view"}
                                        className="h-9"
                                      />
                                    </div>

                                    {/* Remove button */}
                                    {panelMode !== "view" && (
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => removeCondition(pIndex, cIndex)}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    )}
                                </div>
                              ))}

                              {/* Add condition button */}
                              {panelMode !== "view" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-1 w-full border-dashed h-9"
                                  onClick={() => addCondition(pIndex)}
                                >
                                  <Plus className="h-3 w-3" />
                                  Thêm điều kiện
                                </Button>
                              )}

                              {policy.conditions.length === 0 && panelMode === "view" && (
                                <div className="text-center py-3 text-sm text-muted-foreground">
                                  Chưa có điều kiện nào.
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/20">
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsPanelOpen(false)}>
                {panelMode === "view" ? "Đóng" : "Hủy"}
              </Button>
              {panelMode !== "view" && (
                <Button onClick={handleSave} className="shadow-lg shadow-primary/20">
                  {panelMode === "create" ? "Tạo profile" : "Lưu thay đổi"}
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
