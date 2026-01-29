import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, Plus, MoreHorizontal, Edit, Trash2, Eye, Info, 
  RotateCcw, AlertTriangle, ShieldCheck, ShieldOff, Calendar
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface ACLException {
  id: number;
  userId: number;
  username: string;
  userFullName: string;
  unit: string;
  menu: string;
  menuName: string;
  permission: string;
  permissionName: string;
  effect: "ALLOW" | "DENY";
  reason: string;
  expiresAt: string | null;
  createdBy: string;
  createdAt: string;
  status: "active" | "expired";
}

interface User {
  id: number;
  username: string;
  fullName: string;
  unit: string;
}

interface MenuGroup {
  id: string;
  name: string;
  permissions: { id: string; name: string }[];
}

// Mock data
const mockUsers: User[] = [
  { id: 1, username: "nguyenvana", fullName: "Nguyễn Văn A", unit: "TTDL-1" },
  { id: 2, username: "tranthib", fullName: "Trần Thị B", unit: "TTDL-2" },
  { id: 3, username: "lethic", fullName: "Lê Thị C", unit: "CNTT" },
  { id: 4, username: "phamvand", fullName: "Phạm Văn D", unit: "TTDL-1" },
  { id: 5, username: "hoangvane", fullName: "Hoàng Văn E", unit: "TTDL-3" },
];

const menuGroups: MenuGroup[] = [
  {
    id: "table_mgmt",
    name: "Quản lý bảng",
    permissions: [
      { id: "table_create", name: "Tạo bảng" },
      { id: "table_edit", name: "Sửa bảng" },
      { id: "table_delete", name: "Xóa bảng" },
      { id: "table_search", name: "Tìm kiếm" },
      { id: "table_view", name: "Xem chi tiết" },
      { id: "table_upload", name: "Upload metadata" },
    ],
  },
  {
    id: "sql_mgmt",
    name: "Quản lý truy vấn SQL",
    permissions: [
      { id: "sql_create", name: "Tạo truy vấn" },
      { id: "sql_edit", name: "Sửa truy vấn" },
      { id: "sql_delete", name: "Xóa truy vấn" },
      { id: "sql_clone", name: "Clone truy vấn" },
      { id: "sql_search", name: "Tìm kiếm" },
      { id: "sql_execute", name: "Thực thi" },
    ],
  },
  {
    id: "job_mgmt",
    name: "Quản lý Job",
    permissions: [
      { id: "job_create", name: "Tạo job" },
      { id: "job_edit", name: "Sửa job" },
      { id: "job_delete", name: "Xóa job" },
      { id: "job_approve", name: "Phê duyệt" },
      { id: "job_search", name: "Tìm kiếm" },
      { id: "job_execute", name: "Chạy job" },
    ],
  },
  {
    id: "dq_mgmt",
    name: "Data Quality",
    permissions: [
      { id: "dq_view", name: "Xem DQ" },
      { id: "dq_manage_rule", name: "Quản lý rule" },
      { id: "dq_manage_alert", name: "Quản lý cảnh báo" },
    ],
  },
];

const mockExceptions: ACLException[] = [
  {
    id: 1,
    userId: 1,
    username: "nguyenvana",
    userFullName: "Nguyễn Văn A",
    unit: "TTDL-1",
    menu: "job_mgmt",
    menuName: "Quản lý Job",
    permission: "job_approve",
    permissionName: "Phê duyệt",
    effect: "ALLOW",
    reason: "Được uỷ quyền phê duyệt job trong tháng 1/2024 khi trưởng nhóm đi công tác",
    expiresAt: "2024-01-31",
    createdBy: "admin",
    createdAt: "2024-01-05",
    status: "active",
  },
  {
    id: 2,
    userId: 2,
    username: "tranthib",
    userFullName: "Trần Thị B",
    unit: "TTDL-2",
    menu: "sql_mgmt",
    menuName: "Quản lý truy vấn SQL",
    permission: "sql_execute",
    permissionName: "Thực thi",
    effect: "DENY",
    reason: "Tạm khóa quyền execute SQL do vi phạm quy trình",
    expiresAt: "2024-02-15",
    createdBy: "admin",
    createdAt: "2024-01-10",
    status: "active",
  },
  {
    id: 3,
    userId: 4,
    username: "phamvand",
    userFullName: "Phạm Văn D",
    unit: "TTDL-1",
    menu: "table_mgmt",
    menuName: "Quản lý bảng",
    permission: "table_delete",
    permissionName: "Xóa bảng",
    effect: "ALLOW",
    reason: "Cần quyền xóa bảng để dọn dẹp data test",
    expiresAt: null,
    createdBy: "admin",
    createdAt: "2024-01-12",
    status: "active",
  },
];

export function ACLExceptionsTab() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [effectFilter, setEffectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [exceptions] = useState<ACLException[]>(mockExceptions);
  
  // Panel states
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<"create" | "edit" | "view">("create");
  const [selectedEx, setSelectedEx] = useState<ACLException | null>(null);
  
  // Form states
  const [formUserId, setFormUserId] = useState<number | null>(null);
  const [formMenu, setFormMenu] = useState("");
  const [formPermission, setFormPermission] = useState("");
  const [formEffect, setFormEffect] = useState<"ALLOW" | "DENY">("ALLOW");
  const [formReason, setFormReason] = useState("");
  const [formExpires, setFormExpires] = useState("");
  const [userSearchOpen, setUserSearchOpen] = useState(false);

  // Handlers
  const handleCreate = () => {
    setPanelMode("create");
    setFormUserId(null);
    setFormMenu("");
    setFormPermission("");
    setFormEffect("ALLOW");
    setFormReason("");
    setFormExpires("");
    setIsPanelOpen(true);
  };

  const handleView = (ex: ACLException) => {
    setPanelMode("view");
    setSelectedEx(ex);
    setIsPanelOpen(true);
  };

  const handleEdit = (ex: ACLException) => {
    setPanelMode("edit");
    setSelectedEx(ex);
    setFormUserId(ex.userId);
    setFormMenu(ex.menu);
    setFormPermission(ex.permission);
    setFormEffect(ex.effect);
    setFormReason(ex.reason);
    setFormExpires(ex.expiresAt || "");
    setIsPanelOpen(true);
  };

  const handleDelete = (ex: ACLException) => {
    toast({
      title: "Đã xóa",
      description: `Quyền đặc biệt cho ${ex.userFullName} đã được xóa.`,
      variant: "destructive",
    });
  };

  const handleSave = () => {
    if (!formUserId || !formMenu || !formPermission || !formReason.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    const selectedUser = mockUsers.find(u => u.id === formUserId);
    if (panelMode === "create") {
      toast({
        title: "Tạo thành công",
        description: `Đã thêm quyền ${formEffect} cho ${selectedUser?.fullName}.`,
      });
    } else {
      toast({
        title: "Cập nhật thành công",
        description: `Đã cập nhật quyền cho ${selectedUser?.fullName}.`,
      });
    }
    setIsPanelOpen(false);
  };

  const handleReset = () => {
    setSearchTerm("");
    setEffectFilter("all");
    setStatusFilter("all");
  };

  // Get permissions for selected menu
  const selectedMenuGroup = menuGroups.find(m => m.id === formMenu);
  const selectedUser = mockUsers.find(u => u.id === formUserId);

  // Filter exceptions
  const filteredExceptions = exceptions.filter(ex => {
    const matchSearch = ex.userFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       ex.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       ex.permissionName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEffect = effectFilter === "all" || ex.effect === effectFilter;
    const matchStatus = statusFilter === "all" || ex.status === statusFilter;
    return matchSearch && matchEffect && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Quyền đặc biệt (ACL)</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    ACL (Access Control List) cho phép cấp/thu hồi quyền cho từng user cụ thể,
                    ghi đè (override) quyền từ hồ sơ. DENY luôn được ưu tiên hơn ALLOW.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-muted-foreground">
            Cấp hoặc thu hồi quyền đặc biệt cho từng người dùng (ghi đè profile)
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" />
          Thêm quyền đặc biệt
        </Button>
      </div>

      {/* Warning banner */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800 dark:text-amber-200">
              Lưu ý về quyền đặc biệt
            </p>
            <ul className="text-sm text-amber-700 dark:text-amber-300 mt-1 space-y-1">
              <li>• DENY luôn được ưu tiên hơn ALLOW</li>
              <li>• Nên đặt ngày hết hạn để tránh quyền tồn đọng</li>
              <li>• Quyền đặc biệt ghi đè quyền từ hồ sơ đã gán</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 bg-card/50 border border-border/50 rounded-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo user, quyền..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background/50 border-border/50"
          />
        </div>
        <Select value={effectFilter} onValueChange={setEffectFilter}>
          <SelectTrigger className="w-32 bg-background/50 border-border/50">
            <SelectValue placeholder="Effect" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="ALLOW">ALLOW</SelectItem>
            <SelectItem value="DENY">DENY</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 bg-background/50 border-border/50">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={handleReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Làm mới
        </Button>
      </div>

      {/* Exceptions Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-semibold text-foreground">Người dùng</th>
                <th className="text-left p-4 font-semibold text-foreground">Menu</th>
                <th className="text-left p-4 font-semibold text-foreground">Quyền</th>
                <th className="text-left p-4 font-semibold text-foreground">Effect</th>
                <th className="text-left p-4 font-semibold text-foreground">Hết hạn</th>
                <th className="text-left p-4 font-semibold text-foreground">Trạng thái</th>
                <th className="text-center p-4 font-semibold text-foreground w-24">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredExceptions.map((ex) => (
                <tr key={ex.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-foreground">{ex.userFullName}</div>
                      <div className="text-sm text-muted-foreground">{ex.username} • {ex.unit}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm">{ex.menuName}</span>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline">{ex.permissionName}</Badge>
                  </td>
                  <td className="p-4">
                    <Badge className={
                      ex.effect === "ALLOW"
                        ? "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/20"
                        : "bg-red-500/15 text-red-600 hover:bg-red-500/20"
                    }>
                      {ex.effect === "ALLOW" ? (
                        <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <ShieldOff className="h-3.5 w-3.5 mr-1" />
                      )}
                      {ex.effect}
                    </Badge>
                  </td>
                  <td className="p-4">
                    {ex.expiresAt ? (
                      <div className="flex items-center gap-1.5 text-sm">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {ex.expiresAt}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Không giới hạn</span>
                    )}
                  </td>
                  <td className="p-4">
                    <Badge className={
                      ex.status === "active"
                        ? "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/20"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }>
                      {ex.status === "active" ? "Active" : "Expired"}
                    </Badge>
                  </td>
                  <td className="p-4 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(ex)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(ex)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(ex)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Side Panel */}
      <Sheet open={isPanelOpen} onOpenChange={setIsPanelOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-hidden flex flex-col">
          <SheetHeader>
            <SheetTitle>
              {panelMode === "create" ? "Thêm quyền đặc biệt" : 
               panelMode === "edit" ? "Chỉnh sửa quyền đặc biệt" : 
               "Chi tiết quyền đặc biệt"}
            </SheetTitle>
            <SheetDescription>
              {panelMode === "view" 
                ? "Thông tin chi tiết về quyền đặc biệt này"
                : "Cấu hình quyền ALLOW/DENY cho người dùng cụ thể"
              }
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="space-y-6 py-4">
              {/* View mode */}
              {panelMode === "view" && selectedEx && (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium">{selectedEx.userFullName}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedEx.username} • {selectedEx.unit}
                        </p>
                      </div>
                      <Badge className={
                        selectedEx.effect === "ALLOW"
                          ? "bg-emerald-500/15 text-emerald-600"
                          : "bg-red-500/15 text-red-600"
                      }>
                        {selectedEx.effect === "ALLOW" ? (
                          <ShieldCheck className="h-4 w-4 mr-1.5" />
                        ) : (
                          <ShieldOff className="h-4 w-4 mr-1.5" />
                        )}
                        {selectedEx.effect}
                      </Badge>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Menu</Label>
                        <p className="font-medium">{selectedEx.menuName}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Quyền</Label>
                        <p className="font-medium">{selectedEx.permissionName}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Lý do</Label>
                        <p className="text-sm">{selectedEx.reason}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">Ngày tạo</Label>
                          <p className="text-sm">{selectedEx.createdAt}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Hết hạn</Label>
                          <p className="text-sm">{selectedEx.expiresAt || "Không giới hạn"}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Tạo bởi</Label>
                        <p className="text-sm">{selectedEx.createdBy}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Create/Edit mode */}
              {panelMode !== "view" && (
                <>
                  {/* User selection */}
                  <div className="space-y-2">
                    <Label>Người dùng *</Label>
                    <Popover open={userSearchOpen} onOpenChange={setUserSearchOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={userSearchOpen}
                          className="w-full justify-between"
                          disabled={panelMode === "edit"}
                        >
                          {selectedUser 
                            ? `${selectedUser.fullName} (${selectedUser.username})`
                            : "Chọn người dùng..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0">
                        <Command>
                          <CommandInput placeholder="Tìm người dùng..." />
                          <CommandList>
                            <CommandEmpty>Không tìm thấy user.</CommandEmpty>
                            <CommandGroup>
                              {mockUsers.map((user) => (
                                <CommandItem
                                  key={user.id}
                                  value={`${user.fullName} ${user.username}`}
                                  onSelect={() => {
                                    setFormUserId(user.id);
                                    setUserSearchOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      formUserId === user.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <div>
                                    <p className="font-medium">{user.fullName}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {user.username} • {user.unit}
                                    </p>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Separator />

                  {/* Menu & Permission */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Menu *</Label>
                      <Select value={formMenu} onValueChange={(v) => {
                        setFormMenu(v);
                        setFormPermission("");
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn menu" />
                        </SelectTrigger>
                        <SelectContent>
                          {menuGroups.map(menu => (
                            <SelectItem key={menu.id} value={menu.id}>
                              {menu.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Quyền *</Label>
                      <Select 
                        value={formPermission} 
                        onValueChange={setFormPermission}
                        disabled={!formMenu}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn quyền" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedMenuGroup?.permissions.map(perm => (
                            <SelectItem key={perm.id} value={perm.id}>
                              {perm.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  {/* Effect */}
                  <div className="space-y-2">
                    <Label>Effect *</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant={formEffect === "ALLOW" ? "default" : "outline"}
                        className={formEffect === "ALLOW" 
                          ? "bg-emerald-600 hover:bg-emerald-700" 
                          : ""
                        }
                        onClick={() => setFormEffect("ALLOW")}
                      >
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        ALLOW
                      </Button>
                      <Button
                        type="button"
                        variant={formEffect === "DENY" ? "default" : "outline"}
                        className={formEffect === "DENY" 
                          ? "bg-red-600 hover:bg-red-700" 
                          : ""
                        }
                        onClick={() => setFormEffect("DENY")}
                      >
                        <ShieldOff className="h-4 w-4 mr-2" />
                        DENY
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      DENY luôn được ưu tiên hơn ALLOW từ profile
                    </p>
                  </div>

                  <Separator />

                  {/* Reason & Expiry */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Lý do *</Label>
                      <Textarea
                        value={formReason}
                        onChange={(e) => setFormReason(e.target.value)}
                        placeholder="Nhập lý do cấp/thu hồi quyền này..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Ngày hết hạn</Label>
                      <Input
                        type="date"
                        value={formExpires}
                        onChange={(e) => setFormExpires(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Để trống nếu không có thời hạn
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          {panelMode !== "view" && (
            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
              <Button variant="outline" onClick={() => setIsPanelOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleSave} className="shadow-lg shadow-primary/20">
                {panelMode === "create" ? "Thêm quyền" : "Lưu thay đổi"}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
