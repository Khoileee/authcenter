import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, Plus, Minus, ChevronDown, Trash2, Settings, Database
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Types
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  unit: string;
  roles: string[];
  status: string;
}

interface Permission {
  id: string;
  name: string;
}

interface MenuItem {
  id: string;
  name: string;
  permissions: Permission[];
}

interface Profile {
  id: string;
  code: string;
  name: string;
  systemId: string;
  permissions: Record<string, string[]>;
}

interface DataCondition {
  id: string;
  attribute: string;
  operator: string;
  value: string;
}

interface DataPolicy {
  id: string;
  resourceType: string;
  isUnlimited: boolean;
  logic: "AND" | "OR";
  conditions: DataCondition[];
}

interface SystemConfig {
  systemId: string;
  profileId?: string;
  customPermissions?: Record<string, string[]>;
  hybridAdjustments?: Array<{ permissionId: string; actionType: "grant" | "revoke" }>;
  dataPolicies?: DataPolicy[];
}

interface UserPermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

// Mock systems - Fintech/AI/AML related
const mockSystems = [
  { id: "sqlwf", name: "SQLWF - Data Workflow" },
  { id: "vdvs", name: "vDVS - Data Validation" },
  { id: "vtm", name: "VTM - Transaction Monitor" },
  { id: "aml", name: "AML - Anti Money Laundering" },
  { id: "kyc", name: "KYC - Know Your Customer" },
  { id: "fraud", name: "Fraud Detection System" },
  { id: "scoring", name: "Credit Scoring Engine" },
  { id: "aiplatform", name: "AI/ML Platform" },
  { id: "datalake", name: "Enterprise Data Lake" },
  { id: "reporting", name: "BI & Reporting" },
  { id: "ekyc", name: "eKYC Verification" },
  { id: "riskengine", name: "Risk Assessment Engine" },
];

// Mock profiles per system
const mockProfiles: Profile[] = [
  // SQLWF profiles
  { id: "sqlwf_bda", code: "BDA_STD", name: "BDA Standard", systemId: "sqlwf", permissions: { "table_mgmt": ["table_create", "table_view", "table_edit"], "sql_mgmt": ["sql_create", "sql_view", "sql_execute"] } },
  { id: "sqlwf_viewer", code: "VIEWER", name: "Data Viewer", systemId: "sqlwf", permissions: { "table_mgmt": ["table_view"], "sql_mgmt": ["sql_view"] } },
  { id: "sqlwf_admin", code: "ADMIN", name: "Full Admin", systemId: "sqlwf", permissions: { "table_mgmt": ["table_create", "table_view", "table_edit", "table_delete"], "sql_mgmt": ["sql_create", "sql_view", "sql_edit", "sql_delete", "sql_execute"] } },
  // vDVS profiles
  { id: "vdvs_operator", code: "OPERATOR", name: "DQ Operator", systemId: "vdvs", permissions: { "dq_mgmt": ["dq_view", "dq_execute"] } },
  { id: "vdvs_manager", code: "MANAGER", name: "DQ Manager", systemId: "vdvs", permissions: { "dq_mgmt": ["dq_view", "dq_execute", "dq_manage_rule"] } },
  // VTM profiles
  { id: "vtm_monitor", code: "MONITOR", name: "Transaction Monitor", systemId: "vtm", permissions: { "txn_mgmt": ["txn_view", "txn_search"] } },
  { id: "vtm_analyst", code: "ANALYST", name: "Transaction Analyst", systemId: "vtm", permissions: { "txn_mgmt": ["txn_view", "txn_search", "txn_analyze", "txn_export"] } },
  // AML profiles
  { id: "aml_officer", code: "OFFICER", name: "AML Officer", systemId: "aml", permissions: { "alert_mgmt": ["alert_view", "alert_investigate"], "case_mgmt": ["case_view"] } },
  { id: "aml_manager", code: "MANAGER", name: "AML Manager", systemId: "aml", permissions: { "alert_mgmt": ["alert_view", "alert_investigate", "alert_escalate"], "case_mgmt": ["case_view", "case_create", "case_close"] } },
  // KYC profiles
  { id: "kyc_verifier", code: "VERIFIER", name: "KYC Verifier", systemId: "kyc", permissions: { "kyc_mgmt": ["kyc_view", "kyc_verify"] } },
  { id: "kyc_approver", code: "APPROVER", name: "KYC Approver", systemId: "kyc", permissions: { "kyc_mgmt": ["kyc_view", "kyc_verify", "kyc_approve", "kyc_reject"] } },
  // Fraud profiles
  { id: "fraud_analyst", code: "ANALYST", name: "Fraud Analyst", systemId: "fraud", permissions: { "fraud_mgmt": ["fraud_view", "fraud_investigate"] } },
  // Scoring profiles
  { id: "scoring_user", code: "USER", name: "Scoring User", systemId: "scoring", permissions: { "score_mgmt": ["score_view", "score_request"] } },
  // AI Platform profiles
  { id: "ai_scientist", code: "SCIENTIST", name: "Data Scientist", systemId: "aiplatform", permissions: { "model_mgmt": ["model_view", "model_train", "model_deploy"] } },
  { id: "ai_engineer", code: "ENGINEER", name: "ML Engineer", systemId: "aiplatform", permissions: { "model_mgmt": ["model_view", "model_deploy", "model_monitor"] } },
  // Data Lake profiles
  { id: "lake_analyst", code: "ANALYST", name: "Data Analyst", systemId: "datalake", permissions: { "lake_mgmt": ["lake_read", "lake_query"] } },
  // Reporting profiles
  { id: "report_viewer", code: "VIEWER", name: "Report Viewer", systemId: "reporting", permissions: { "report_mgmt": ["report_view"] } },
  { id: "report_creator", code: "CREATOR", name: "Report Creator", systemId: "reporting", permissions: { "report_mgmt": ["report_view", "report_create", "report_edit"] } },
  // eKYC profiles
  { id: "ekyc_operator", code: "OPERATOR", name: "eKYC Operator", systemId: "ekyc", permissions: { "ekyc_mgmt": ["ekyc_view", "ekyc_process"] } },
  // Risk Engine profiles
  { id: "risk_analyst", code: "ANALYST", name: "Risk Analyst", systemId: "riskengine", permissions: { "risk_mgmt": ["risk_view", "risk_assess"] } },
];

// Menu items per system (simplified)
const menuItemsBySystem: Record<string, MenuItem[]> = {
  sqlwf: [
    { id: "table_mgmt", name: "Quản lý bảng", permissions: [{ id: "table_create", name: "Tạo" }, { id: "table_view", name: "Xem" }, { id: "table_edit", name: "Sửa" }, { id: "table_delete", name: "Xóa" }] },
    { id: "sql_mgmt", name: "Quản lý SQL", permissions: [{ id: "sql_create", name: "Tạo" }, { id: "sql_view", name: "Xem" }, { id: "sql_edit", name: "Sửa" }, { id: "sql_delete", name: "Xóa" }, { id: "sql_execute", name: "Thực thi" }] },
    { id: "job_mgmt", name: "Quản lý Job", permissions: [{ id: "job_create", name: "Tạo" }, { id: "job_view", name: "Xem" }, { id: "job_execute", name: "Chạy" }] },
  ],
  vdvs: [
    { id: "dq_mgmt", name: "Data Quality", permissions: [{ id: "dq_view", name: "Xem" }, { id: "dq_execute", name: "Thực thi" }, { id: "dq_manage_rule", name: "Quản lý Rule" }] },
  ],
  vtm: [
    { id: "txn_mgmt", name: "Giao dịch", permissions: [{ id: "txn_view", name: "Xem" }, { id: "txn_search", name: "Tìm kiếm" }, { id: "txn_analyze", name: "Phân tích" }, { id: "txn_export", name: "Xuất" }] },
  ],
  aml: [
    { id: "alert_mgmt", name: "Cảnh báo AML", permissions: [{ id: "alert_view", name: "Xem" }, { id: "alert_investigate", name: "Điều tra" }, { id: "alert_escalate", name: "Escalate" }] },
    { id: "case_mgmt", name: "Case Management", permissions: [{ id: "case_view", name: "Xem" }, { id: "case_create", name: "Tạo" }, { id: "case_close", name: "Đóng" }] },
  ],
  kyc: [
    { id: "kyc_mgmt", name: "KYC", permissions: [{ id: "kyc_view", name: "Xem" }, { id: "kyc_verify", name: "Xác minh" }, { id: "kyc_approve", name: "Phê duyệt" }, { id: "kyc_reject", name: "Từ chối" }] },
  ],
  fraud: [
    { id: "fraud_mgmt", name: "Fraud Detection", permissions: [{ id: "fraud_view", name: "Xem" }, { id: "fraud_investigate", name: "Điều tra" }, { id: "fraud_block", name: "Block" }] },
  ],
  scoring: [
    { id: "score_mgmt", name: "Credit Scoring", permissions: [{ id: "score_view", name: "Xem" }, { id: "score_request", name: "Yêu cầu" }, { id: "score_override", name: "Override" }] },
  ],
  aiplatform: [
    { id: "model_mgmt", name: "ML Models", permissions: [{ id: "model_view", name: "Xem" }, { id: "model_train", name: "Train" }, { id: "model_deploy", name: "Deploy" }, { id: "model_monitor", name: "Monitor" }] },
  ],
  datalake: [
    { id: "lake_mgmt", name: "Data Lake", permissions: [{ id: "lake_read", name: "Đọc" }, { id: "lake_write", name: "Ghi" }, { id: "lake_query", name: "Query" }] },
  ],
  reporting: [
    { id: "report_mgmt", name: "Báo cáo", permissions: [{ id: "report_view", name: "Xem" }, { id: "report_create", name: "Tạo" }, { id: "report_edit", name: "Sửa" }, { id: "report_share", name: "Chia sẻ" }] },
  ],
  ekyc: [
    { id: "ekyc_mgmt", name: "eKYC", permissions: [{ id: "ekyc_view", name: "Xem" }, { id: "ekyc_process", name: "Xử lý" }, { id: "ekyc_approve", name: "Phê duyệt" }] },
  ],
  riskengine: [
    { id: "risk_mgmt", name: "Risk Assessment", permissions: [{ id: "risk_view", name: "Xem" }, { id: "risk_assess", name: "Đánh giá" }, { id: "risk_config", name: "Cấu hình" }] },
  ],
};

// Resource types per system for data permissions
const resourceTypesBySystem: Record<string, Array<{ id: string; name: string }>> = {
  sqlwf: [{ id: "table", name: "Bảng dữ liệu" }, { id: "sql", name: "Truy vấn SQL" }, { id: "job", name: "Job" }],
  vdvs: [{ id: "dq_rule", name: "DQ Rule" }, { id: "dq_result", name: "Kết quả DQ" }],
  vtm: [{ id: "transaction", name: "Giao dịch" }],
  aml: [{ id: "alert", name: "Cảnh báo" }, { id: "case", name: "Case" }],
  kyc: [{ id: "customer", name: "Khách hàng" }, { id: "document", name: "Hồ sơ" }],
  fraud: [{ id: "fraud_case", name: "Case Fraud" }],
  scoring: [{ id: "score_request", name: "Yêu cầu chấm điểm" }],
  aiplatform: [{ id: "model", name: "Model" }, { id: "dataset", name: "Dataset" }],
  datalake: [{ id: "data_asset", name: "Data Asset" }],
  reporting: [{ id: "report", name: "Báo cáo" }, { id: "dashboard", name: "Dashboard" }],
  ekyc: [{ id: "ekyc_request", name: "Yêu cầu eKYC" }],
  riskengine: [{ id: "risk_assessment", name: "Đánh giá rủi ro" }],
};

// Resource attributes for conditions
const resourceAttributes = [
  { id: "owner_unit", label: "Đơn vị sở hữu" },
  { id: "created_by", label: "Người tạo" },
  { id: "branch", label: "Chi nhánh" },
  { id: "status", label: "Trạng thái" },
];

// Operators for conditions
const operators = [
  { id: "eq", label: "bằng" },
  { id: "neq", label: "khác" },
  { id: "in", label: "thuộc" },
];

// User attributes for condition values
const userAttributes = [
  { id: "unit", label: "Đơn vị của user" },
  { id: "branch", label: "Chi nhánh của user" },
  { id: "username", label: "Username" },
];

type PermissionMode = "profile" | "custom" | "hybrid";

export function UserPermissionDialog({ open, onOpenChange, user }: UserPermissionDialogProps) {
  const { toast } = useToast();
  
  // Mode selection
  const [permissionMode, setPermissionMode] = useState<PermissionMode>("profile");
  
  // System configs for each mode - stores multiple systems
  const [systemConfigs, setSystemConfigs] = useState<SystemConfig[]>([]);
  
  // UI state
  const [menuSearchTerm, setMenuSearchTerm] = useState("");
  const [systemPopoverOpen, setSystemPopoverOpen] = useState(false);
  const [profilePopovers, setProfilePopovers] = useState<Record<string, boolean>>({});

  // Reset state when dialog opens/closes or mode changes
  useEffect(() => {
    if (open) {
      setPermissionMode("profile");
      setSystemConfigs([]);
      setMenuSearchTerm("");
      setSystemPopoverOpen(false);
      setProfilePopovers({});
    }
  }, [open]);

  // Get selected system IDs
  const getSelectedSystemIds = () => systemConfigs.map(c => c.systemId);

  // Get available systems (not yet selected)
  const getAvailableSystems = () => mockSystems.filter(s => !getSelectedSystemIds().includes(s.id));

  // Get profiles for a specific system
  const getProfilesForSystem = (systemId: string) => mockProfiles.filter(p => p.systemId === systemId);

  // Get system name by ID
  const getSystemName = (systemId: string) => mockSystems.find(s => s.id === systemId)?.name || systemId;

  // Get profile by ID
  const getProfileById = (profileId: string) => mockProfiles.find(p => p.id === profileId);

  // Add a new system
  const addSystem = (systemId: string) => {
    const newConfig: SystemConfig = { systemId };
    setSystemConfigs(prev => [...prev, newConfig]);
    setSystemPopoverOpen(false);
  };

  // Remove a system
  const removeSystem = (systemId: string) => {
    setSystemConfigs(prev => prev.filter(c => c.systemId !== systemId));
  };

  // Update system config
  const updateSystemConfig = (systemId: string, updates: Partial<SystemConfig>) => {
    setSystemConfigs(prev => prev.map(c => c.systemId === systemId ? { ...c, ...updates } : c));
  };

  // Toggle permission for custom mode
  const toggleCustomPermission = (systemId: string, menuId: string, permId: string) => {
    const config = systemConfigs.find(c => c.systemId === systemId);
    if (!config) return;

    const currentPerms = config.customPermissions || {};
    const menuPerms = currentPerms[menuId] || [];
    const newMenuPerms = menuPerms.includes(permId)
      ? menuPerms.filter(id => id !== permId)
      : [...menuPerms, permId];

    const newCustomPerms = { ...currentPerms };
    if (newMenuPerms.length === 0) {
      delete newCustomPerms[menuId];
    } else {
      newCustomPerms[menuId] = newMenuPerms;
    }

    updateSystemConfig(systemId, { customPermissions: newCustomPerms });
  };

  // Toggle permission for hybrid mode
  const toggleHybridPermission = (systemId: string, permId: string) => {
    const config = systemConfigs.find(c => c.systemId === systemId);
    if (!config || !config.profileId) return;

    const profile = getProfileById(config.profileId);
    if (!profile) return;

    const isInBase = Object.values(profile.permissions).some(perms => perms.includes(permId));
    const adjustments = config.hybridAdjustments || [];
    const currentAdj = adjustments.find(a => a.permissionId === permId);

    let newAdjustments = adjustments.filter(a => a.permissionId !== permId);

    if (isInBase) {
      if (currentAdj?.actionType !== "revoke") {
        newAdjustments.push({ permissionId: permId, actionType: "revoke" });
      }
    } else {
      if (currentAdj?.actionType !== "grant") {
        newAdjustments.push({ permissionId: permId, actionType: "grant" });
      }
    }

    updateSystemConfig(systemId, { hybridAdjustments: newAdjustments });
  };

  // Check if permission is selected in hybrid mode
  const isHybridPermissionSelected = (config: SystemConfig, permId: string): boolean => {
    if (!config.profileId) return false;
    const profile = getProfileById(config.profileId);
    if (!profile) return false;

    const isInBase = Object.values(profile.permissions).some(perms => perms.includes(permId));
    const adj = config.hybridAdjustments?.find(a => a.permissionId === permId);

    if (isInBase) return adj?.actionType !== "revoke";
    return adj?.actionType === "grant";
  };

  // Get adjustment status
  const getAdjustmentStatus = (config: SystemConfig, permId: string): "grant" | "revoke" | null => {
    return config.hybridAdjustments?.find(a => a.permissionId === permId)?.actionType || null;
  };

  // Filter menus by search
  const filterMenus = (menus: MenuItem[]) => {
    if (!menuSearchTerm) return menus;
    return menus.filter(m => m.name.toLowerCase().includes(menuSearchTerm.toLowerCase()));
  };

  // Validation
  const isValid = () => {
    if (systemConfigs.length === 0) return false;
    
    switch (permissionMode) {
      case "profile":
        return systemConfigs.every(c => c.profileId);
      case "custom":
        return systemConfigs.every(c => c.customPermissions && Object.keys(c.customPermissions).length > 0);
      case "hybrid":
        return systemConfigs.every(c => c.profileId);
      default:
        return false;
    }
  };

  // Submit handler
  const handleSubmit = () => {
    console.log("Submit:", { mode: permissionMode, configs: systemConfigs, userId: user?.id });
    toast({
      title: "Phân quyền thành công",
      description: `Đã cấu hình quyền trên ${systemConfigs.length} hệ thống cho ${user?.name}`,
    });
    onOpenChange(false);
  };

  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-4xl overflow-hidden flex flex-col p-0">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-muted/30">
          <SheetHeader>
            <SheetTitle className="text-xl">Phân quyền cho người dùng</SheetTitle>
            <SheetDescription>
              Cấu hình quyền truy cập cho {user.name}
            </SheetDescription>
          </SheetHeader>
          
          {/* User Info - Compact */}
          <div className="flex items-center gap-4 mt-3 p-2 bg-background rounded-lg border">
            <div className="flex-1 grid grid-cols-4 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">User:</span>{" "}
                <span className="font-medium">{user.username}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Đơn vị:</span>{" "}
                <span className="font-medium">{user.unit}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Vai trò:</span>{" "}
                {user.roles.slice(0, 2).map((role) => (
                  <Badge key={role} variant="secondary" className="font-normal text-xs">
                    {role}
                  </Badge>
                ))}
                {user.roles.length > 2 && <span className="text-xs text-muted-foreground">+{user.roles.length - 2}</span>}
              </div>
              <div>
                <Badge 
                  variant={user.status === "active" ? "default" : "secondary"}
                  className={user.status === "active" ? "bg-emerald-500/15 text-emerald-600" : ""}
                >
                  {user.status === "active" ? "Hoạt động" : "Ngừng HĐ"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="mt-3">
            <RadioGroup 
              value={permissionMode} 
              onValueChange={(v) => {
                setPermissionMode(v as PermissionMode);
                setSystemConfigs([]); // Reset when changing mode
              }}
              className="grid grid-cols-3 gap-2"
            >
              <label className={cn(
                "flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all text-sm",
                permissionMode === "profile" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              )}>
                <RadioGroupItem value="profile" id="mode-profile" />
                <span className="font-medium">Theo Profile</span>
              </label>
              
              <label className={cn(
                "flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all text-sm",
                permissionMode === "custom" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              )}>
                <RadioGroupItem value="custom" id="mode-custom" />
                <span className="font-medium">Tùy chỉnh thủ công</span>
              </label>
              
              <label className={cn(
                "flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all text-sm",
                permissionMode === "hybrid" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              )}>
                <RadioGroupItem value="hybrid" id="mode-hybrid" />
                <span className="font-medium">Profile + Tùy chỉnh</span>
              </label>
            </RadioGroup>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-4">
            {/* Add System Button */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground">
                {systemConfigs.length === 0 ? "Chọn hệ thống để bắt đầu" : `Đã chọn ${systemConfigs.length} hệ thống`}
              </h3>
              <Popover open={systemPopoverOpen} onOpenChange={setSystemPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button size="sm" disabled={getAvailableSystems().length === 0}>
                    <Plus className="h-4 w-4 mr-1" />
                    Thêm hệ thống
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="end">
                  <Command>
                    <CommandInput placeholder="Tìm hệ thống..." />
                    <CommandList>
                      <CommandEmpty>Không tìm thấy.</CommandEmpty>
                      <CommandGroup>
                        {getAvailableSystems().map((sys) => (
                          <CommandItem
                            key={sys.id}
                            value={sys.name}
                            onSelect={() => addSystem(sys.id)}
                          >
                            {sys.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Empty State */}
            {systemConfigs.length === 0 && (
              <Card className="p-8 text-center text-muted-foreground border-dashed">
                <p>Chưa có hệ thống nào được chọn</p>
                <p className="text-sm mt-1">Nhấn "Thêm hệ thống" để bắt đầu cấu hình quyền</p>
              </Card>
            )}

            {/* System Cards */}
            {systemConfigs.map((config) => {
              const menus = menuItemsBySystem[config.systemId] || [];
              const profiles = getProfilesForSystem(config.systemId);
              const selectedProfile = config.profileId ? getProfileById(config.profileId) : null;

              return (
                <Card key={config.systemId} className="overflow-hidden">
                  {/* System Header */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-b">
                    <Badge variant="outline" className="font-semibold text-sm">
                      {getSystemName(config.systemId)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeSystem(config.systemId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="p-4">
                    {/* ===== MODE: PROFILE ===== */}
                    {permissionMode === "profile" && (
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1.5 block">Chọn Profile</Label>
                        <Popover 
                          open={profilePopovers[config.systemId]} 
                          onOpenChange={(open) => setProfilePopovers(prev => ({ ...prev, [config.systemId]: open }))}
                        >
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-between bg-background">
                              {selectedProfile ? selectedProfile.name : "Chọn profile..."}
                              <ChevronDown className="h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                              <CommandInput placeholder="Tìm profile..." />
                              <CommandList>
                                <CommandEmpty>Không có profile.</CommandEmpty>
                                <CommandGroup>
                                  {profiles.map((profile) => (
                                    <CommandItem
                                      key={profile.id}
                                      value={profile.name}
                                      onSelect={() => {
                                        updateSystemConfig(config.systemId, { profileId: profile.id });
                                        setProfilePopovers(prev => ({ ...prev, [config.systemId]: false }));
                                      }}
                                    >
                                      {profile.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}

                    {/* ===== MODE: CUSTOM ===== */}
                    {permissionMode === "custom" && (
                      <Tabs defaultValue="system" className="flex-1 flex flex-col">
                        <TabsList className="grid w-full grid-cols-2 mb-3">
                          <TabsTrigger value="system" className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Quyền hệ thống
                          </TabsTrigger>
                          <TabsTrigger value="data" className="flex items-center gap-2">
                            <Database className="h-4 w-4" />
                            Quyền dữ liệu
                          </TabsTrigger>
                        </TabsList>

                        {/* Tab: Quyền hệ thống */}
                        <TabsContent value="system" className="mt-0 space-y-3">
                          {/* Search */}
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Tìm menu..."
                              value={menuSearchTerm}
                              onChange={(e) => setMenuSearchTerm(e.target.value)}
                              className="pl-9 h-8 text-sm"
                            />
                          </div>

                          {/* Permission List */}
                          <div className="border rounded-lg overflow-hidden divide-y">
                            {filterMenus(menus).map((menu) => {
                              const selectedPerms = config.customPermissions?.[menu.id] || [];
                              const allSelected = selectedPerms.length === menu.permissions.length;
                              const someSelected = selectedPerms.length > 0 && !allSelected;

                              return (
                                <div key={menu.id} className="flex items-center gap-3 px-3 py-2 hover:bg-muted/20">
                                  <div className="flex items-center gap-2 min-w-[140px]">
                                    <Checkbox
                                      checked={allSelected}
                                      ref={(el) => {
                                        if (el) (el as unknown as { indeterminate: boolean }).indeterminate = someSelected;
                                      }}
                                      onCheckedChange={() => {
                                        const allPerms = menu.permissions.map(p => p.id);
                                        const newCustomPerms = { ...(config.customPermissions || {}) };
                                        if (allSelected) {
                                          delete newCustomPerms[menu.id];
                                        } else {
                                          newCustomPerms[menu.id] = allPerms;
                                        }
                                        updateSystemConfig(config.systemId, { customPermissions: newCustomPerms });
                                      }}
                                    />
                                    <span className="text-sm font-medium">{menu.name}</span>
                                  </div>
                                  
                                  <div className="flex-1 flex flex-wrap gap-1.5">
                                    {menu.permissions.map((perm) => (
                                      <label
                                        key={perm.id}
                                        className={cn(
                                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs cursor-pointer transition-all",
                                          selectedPerms.includes(perm.id) 
                                            ? 'bg-primary/10 text-primary border border-primary/30' 
                                            : 'bg-muted/50 text-muted-foreground border border-transparent hover:bg-muted'
                                        )}
                                      >
                                        <Checkbox
                                          checked={selectedPerms.includes(perm.id)}
                                          onCheckedChange={() => toggleCustomPermission(config.systemId, menu.id, perm.id)}
                                          className="h-3 w-3"
                                        />
                                        <span>{perm.name}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </TabsContent>

                        {/* Tab: Quyền dữ liệu */}
                        <TabsContent value="data" className="mt-0 space-y-3">
                          {/* Resource Types for this system */}
                          {(resourceTypesBySystem[config.systemId] || []).map((resourceType) => {
                            const policy = config.dataPolicies?.find(p => p.resourceType === resourceType.id);
                            const isUnlimited = policy?.isUnlimited ?? true;
                            const conditions = policy?.conditions || [];

                            return (
                              <div key={resourceType.id} className="border rounded-lg overflow-hidden">
                                {/* Resource Header */}
                                <div className="flex items-center justify-between gap-3 p-3 bg-muted/30">
                                  <h4 className="font-medium text-sm">{resourceType.name}</h4>
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <Checkbox
                                      checked={isUnlimited}
                                      onCheckedChange={(checked) => {
                                        const newPolicies = [...(config.dataPolicies || [])];
                                        const policyIndex = newPolicies.findIndex(p => p.resourceType === resourceType.id);
                                        if (policyIndex >= 0) {
                                          newPolicies[policyIndex] = { ...newPolicies[policyIndex], isUnlimited: !!checked };
                                        } else {
                                          newPolicies.push({
                                            id: `policy_${resourceType.id}`,
                                            resourceType: resourceType.id,
                                            isUnlimited: !!checked,
                                            logic: "AND",
                                            conditions: []
                                          });
                                        }
                                        updateSystemConfig(config.systemId, { dataPolicies: newPolicies });
                                      }}
                                    />
                                    <span className="text-xs">Không giới hạn</span>
                                  </label>
                                </div>

                                {/* Conditions - only show if not unlimited */}
                                {!isUnlimited && (
                                  <div className="p-3 space-y-2 bg-background">
                                    {conditions.map((cond, cIndex) => (
                                      <div key={cond.id} className="flex items-center gap-2 p-2 bg-muted/20 rounded-lg border border-border/50">
                                        <div className="flex-1 grid grid-cols-3 gap-2">
                                          {/* Resource Attribute */}
                                          <Select 
                                            value={cond.attribute}
                                            onValueChange={(v) => {
                                              const newPolicies = [...(config.dataPolicies || [])];
                                              const policyIndex = newPolicies.findIndex(p => p.resourceType === resourceType.id);
                                              if (policyIndex >= 0) {
                                                newPolicies[policyIndex].conditions[cIndex].attribute = v;
                                                updateSystemConfig(config.systemId, { dataPolicies: newPolicies });
                                              }
                                            }}
                                          >
                                            <SelectTrigger className="w-full h-8 text-xs">
                                              <SelectValue placeholder="Trường dữ liệu" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {resourceAttributes.map(attr => (
                                                <SelectItem key={attr.id} value={attr.id}>
                                                  {attr.label}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>

                                          {/* Operator */}
                                          <Select 
                                            value={cond.operator}
                                            onValueChange={(v) => {
                                              const newPolicies = [...(config.dataPolicies || [])];
                                              const policyIndex = newPolicies.findIndex(p => p.resourceType === resourceType.id);
                                              if (policyIndex >= 0) {
                                                newPolicies[policyIndex].conditions[cIndex].operator = v;
                                                updateSystemConfig(config.systemId, { dataPolicies: newPolicies });
                                              }
                                            }}
                                          >
                                            <SelectTrigger className="w-full h-8 text-xs">
                                              <SelectValue placeholder="Toán tử" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {operators.map(op => (
                                                <SelectItem key={op.id} value={op.id}>
                                                  {op.label}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>

                                          {/* Value */}
                                          <Select 
                                            value={cond.value}
                                            onValueChange={(v) => {
                                              const newPolicies = [...(config.dataPolicies || [])];
                                              const policyIndex = newPolicies.findIndex(p => p.resourceType === resourceType.id);
                                              if (policyIndex >= 0) {
                                                newPolicies[policyIndex].conditions[cIndex].value = v;
                                                updateSystemConfig(config.systemId, { dataPolicies: newPolicies });
                                              }
                                            }}
                                          >
                                            <SelectTrigger className="w-full h-8 text-xs">
                                              <SelectValue placeholder="Giá trị" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {userAttributes.map(attr => (
                                                <SelectItem key={attr.id} value={attr.id}>
                                                  {attr.label}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        {/* Delete condition */}
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                          onClick={() => {
                                            const newPolicies = [...(config.dataPolicies || [])];
                                            const policyIndex = newPolicies.findIndex(p => p.resourceType === resourceType.id);
                                            if (policyIndex >= 0) {
                                              newPolicies[policyIndex].conditions.splice(cIndex, 1);
                                              updateSystemConfig(config.systemId, { dataPolicies: newPolicies });
                                            }
                                          }}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}

                                    {/* Add condition button */}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full text-xs h-8"
                                      onClick={() => {
                                        const newPolicies = [...(config.dataPolicies || [])];
                                        const policyIndex = newPolicies.findIndex(p => p.resourceType === resourceType.id);
                                        if (policyIndex >= 0) {
                                          newPolicies[policyIndex].conditions.push({
                                            id: `cond_${Date.now()}`,
                                            attribute: "",
                                            operator: "eq",
                                            value: ""
                                          });
                                        } else {
                                          newPolicies.push({
                                            id: `policy_${resourceType.id}`,
                                            resourceType: resourceType.id,
                                            isUnlimited: false,
                                            logic: "AND",
                                            conditions: [{
                                              id: `cond_${Date.now()}`,
                                              attribute: "",
                                              operator: "eq",
                                              value: ""
                                            }]
                                          });
                                        }
                                        updateSystemConfig(config.systemId, { dataPolicies: newPolicies });
                                      }}
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Thêm điều kiện
                                    </Button>
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          {(resourceTypesBySystem[config.systemId] || []).length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">Hệ thống này chưa có tài nguyên nào</p>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    )}

                    {/* ===== MODE: HYBRID ===== */}
                    {permissionMode === "hybrid" && (
                      <Tabs defaultValue="system" className="flex-1 flex flex-col">
                        <TabsList className="grid w-full grid-cols-2 mb-3">
                          <TabsTrigger value="system" className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Quyền hệ thống
                          </TabsTrigger>
                          <TabsTrigger value="data" className="flex items-center gap-2">
                            <Database className="h-4 w-4" />
                            Quyền dữ liệu
                          </TabsTrigger>
                        </TabsList>

                        {/* Tab: Quyền hệ thống */}
                        <TabsContent value="system" className="mt-0 space-y-3">
                          {/* Profile Selection */}
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1.5 block">Profile base</Label>
                            <Popover 
                              open={profilePopovers[config.systemId]} 
                              onOpenChange={(open) => setProfilePopovers(prev => ({ ...prev, [config.systemId]: open }))}
                            >
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between bg-background">
                                  {selectedProfile ? selectedProfile.name : "Chọn profile base..."}
                                  <ChevronDown className="h-4 w-4 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                <Command>
                                  <CommandInput placeholder="Tìm profile..." />
                                  <CommandList>
                                    <CommandEmpty>Không có profile.</CommandEmpty>
                                    <CommandGroup>
                                      {profiles.map((profile) => (
                                        <CommandItem
                                          key={profile.id}
                                          value={profile.name}
                                          onSelect={() => {
                                            updateSystemConfig(config.systemId, { 
                                              profileId: profile.id,
                                              hybridAdjustments: [] 
                                            });
                                            setProfilePopovers(prev => ({ ...prev, [config.systemId]: false }));
                                          }}
                                        >
                                          {profile.name}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>

                          {/* Permission Adjustments */}
                          {config.profileId && (
                            <>
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="Tìm menu..."
                                  value={menuSearchTerm}
                                  onChange={(e) => setMenuSearchTerm(e.target.value)}
                                  className="pl-9 h-8 text-sm"
                                />
                              </div>

                              <div className="border rounded-lg overflow-hidden divide-y">
                                {filterMenus(menus).map((menu) => (
                                  <div key={menu.id} className="flex items-center gap-3 px-3 py-2 hover:bg-muted/20">
                                    <span className="text-sm font-medium min-w-[140px]">{menu.name}</span>
                                    
                                    <div className="flex-1 flex flex-wrap gap-1.5">
                                      {menu.permissions.map((perm) => {
                                        const isSelected = isHybridPermissionSelected(config, perm.id);
                                        const adjStatus = getAdjustmentStatus(config, perm.id);

                                        return (
                                          <label
                                            key={perm.id}
                                            className={cn(
                                              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs cursor-pointer transition-all",
                                              adjStatus === "grant" 
                                                ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-300' 
                                                : adjStatus === "revoke"
                                                ? 'bg-red-500/10 text-red-600 border border-red-200 line-through'
                                                : isSelected
                                                ? 'bg-primary/10 text-primary border border-primary/30' 
                                                : 'bg-muted/50 text-muted-foreground border border-transparent hover:bg-muted'
                                            )}
                                          >
                                            <Checkbox
                                              checked={isSelected}
                                              onCheckedChange={() => toggleHybridPermission(config.systemId, perm.id)}
                                              className="h-3 w-3"
                                            />
                                            <span>{perm.name}</span>
                                            {adjStatus === "grant" && <Plus className="h-3 w-3" />}
                                            {adjStatus === "revoke" && <Minus className="h-3 w-3" />}
                                          </label>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Adjustment count */}
                              {(config.hybridAdjustments?.length || 0) > 0 && (
                                <div className="flex gap-3 text-xs text-muted-foreground">
                                  <span className="text-emerald-600">
                                    +{config.hybridAdjustments?.filter(a => a.actionType === "grant").length || 0} thêm
                                  </span>
                                  <span className="text-red-500">
                                    -{config.hybridAdjustments?.filter(a => a.actionType === "revoke").length || 0} bớt
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                        </TabsContent>

                        {/* Tab: Quyền dữ liệu */}
                        <TabsContent value="data" className="mt-0 space-y-3">
                          {/* Resource Types for this system */}
                          {(resourceTypesBySystem[config.systemId] || []).map((resourceType) => {
                            const policy = config.dataPolicies?.find(p => p.resourceType === resourceType.id);
                            const isUnlimited = policy?.isUnlimited ?? true;
                            const conditions = policy?.conditions || [];

                            return (
                              <div key={resourceType.id} className="border rounded-lg overflow-hidden">
                                {/* Resource Header */}
                                <div className="flex items-center justify-between gap-3 p-3 bg-muted/30">
                                  <h4 className="font-medium text-sm">{resourceType.name}</h4>
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <Checkbox
                                      checked={isUnlimited}
                                      onCheckedChange={(checked) => {
                                        const newPolicies = [...(config.dataPolicies || [])];
                                        const policyIndex = newPolicies.findIndex(p => p.resourceType === resourceType.id);
                                        if (policyIndex >= 0) {
                                          newPolicies[policyIndex] = { ...newPolicies[policyIndex], isUnlimited: !!checked };
                                        } else {
                                          newPolicies.push({
                                            id: `policy_${resourceType.id}`,
                                            resourceType: resourceType.id,
                                            isUnlimited: !!checked,
                                            logic: "AND",
                                            conditions: []
                                          });
                                        }
                                        updateSystemConfig(config.systemId, { dataPolicies: newPolicies });
                                      }}
                                    />
                                    <span className="text-xs">Không giới hạn</span>
                                  </label>
                                </div>

                                {/* Conditions - only show if not unlimited */}
                                {!isUnlimited && (
                                  <div className="p-3 space-y-2 bg-background">
                                    {conditions.map((cond, cIndex) => (
                                      <div key={cond.id} className="flex items-center gap-2 p-2 bg-muted/20 rounded-lg border border-border/50">
                                        <div className="flex-1 grid grid-cols-3 gap-2">
                                          {/* Resource Attribute */}
                                          <Select 
                                            value={cond.attribute}
                                            onValueChange={(v) => {
                                              const newPolicies = [...(config.dataPolicies || [])];
                                              const policyIndex = newPolicies.findIndex(p => p.resourceType === resourceType.id);
                                              if (policyIndex >= 0) {
                                                newPolicies[policyIndex].conditions[cIndex].attribute = v;
                                                updateSystemConfig(config.systemId, { dataPolicies: newPolicies });
                                              }
                                            }}
                                          >
                                            <SelectTrigger className="w-full h-8 text-xs">
                                              <SelectValue placeholder="Trường dữ liệu" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {resourceAttributes.map(attr => (
                                                <SelectItem key={attr.id} value={attr.id}>
                                                  {attr.label}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>

                                          {/* Operator */}
                                          <Select 
                                            value={cond.operator}
                                            onValueChange={(v) => {
                                              const newPolicies = [...(config.dataPolicies || [])];
                                              const policyIndex = newPolicies.findIndex(p => p.resourceType === resourceType.id);
                                              if (policyIndex >= 0) {
                                                newPolicies[policyIndex].conditions[cIndex].operator = v;
                                                updateSystemConfig(config.systemId, { dataPolicies: newPolicies });
                                              }
                                            }}
                                          >
                                            <SelectTrigger className="w-full h-8 text-xs">
                                              <SelectValue placeholder="Toán tử" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {operators.map(op => (
                                                <SelectItem key={op.id} value={op.id}>
                                                  {op.label}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>

                                          {/* Value */}
                                          <Select 
                                            value={cond.value}
                                            onValueChange={(v) => {
                                              const newPolicies = [...(config.dataPolicies || [])];
                                              const policyIndex = newPolicies.findIndex(p => p.resourceType === resourceType.id);
                                              if (policyIndex >= 0) {
                                                newPolicies[policyIndex].conditions[cIndex].value = v;
                                                updateSystemConfig(config.systemId, { dataPolicies: newPolicies });
                                              }
                                            }}
                                          >
                                            <SelectTrigger className="w-full h-8 text-xs">
                                              <SelectValue placeholder="Giá trị" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {userAttributes.map(attr => (
                                                <SelectItem key={attr.id} value={attr.id}>
                                                  {attr.label}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        {/* Delete condition */}
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                          onClick={() => {
                                            const newPolicies = [...(config.dataPolicies || [])];
                                            const policyIndex = newPolicies.findIndex(p => p.resourceType === resourceType.id);
                                            if (policyIndex >= 0) {
                                              newPolicies[policyIndex].conditions.splice(cIndex, 1);
                                              updateSystemConfig(config.systemId, { dataPolicies: newPolicies });
                                            }
                                          }}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}

                                    {/* Add condition button */}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full text-xs h-8"
                                      onClick={() => {
                                        const newPolicies = [...(config.dataPolicies || [])];
                                        const policyIndex = newPolicies.findIndex(p => p.resourceType === resourceType.id);
                                        if (policyIndex >= 0) {
                                          newPolicies[policyIndex].conditions.push({
                                            id: `cond_${Date.now()}`,
                                            attribute: "",
                                            operator: "eq",
                                            value: ""
                                          });
                                        } else {
                                          newPolicies.push({
                                            id: `policy_${resourceType.id}`,
                                            resourceType: resourceType.id,
                                            isUnlimited: false,
                                            logic: "AND",
                                            conditions: [{
                                              id: `cond_${Date.now()}`,
                                              attribute: "",
                                              operator: "eq",
                                              value: ""
                                            }]
                                          });
                                        }
                                        updateSystemConfig(config.systemId, { dataPolicies: newPolicies });
                                      }}
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Thêm điều kiện
                                    </Button>
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          {(resourceTypesBySystem[config.systemId] || []).length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">Hệ thống này chưa có tài nguyên nào</p>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/20">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isValid()}
            className="shadow-lg shadow-primary/20"
          >
            Lưu phân quyền
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
