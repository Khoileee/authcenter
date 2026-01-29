import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, MoreHorizontal, Edit, Eye, Info, RotateCcw,
  ChevronDown, ChevronRight, Users, ShieldCheck
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

// Types
interface Profile {
  id: number;
  name: string;
  description: string;
  system: string;
}

interface UserPermission {
  id: number;
  username: string;
  fullName: string;
  email: string;
  unit: string;
  position: string;
  profiles: Profile[];
  status: "active" | "inactive";
  lastUpdated: string;
}

// Mock profiles for selection
const availableProfiles: Profile[] = [
  { id: 1, name: "BDA Standard", description: "Quyền chuẩn cho Business Data Analyst", system: "SQLWF" },
  { id: 2, name: "Teller Basic", description: "Quyền cơ bản cho giao dịch viên", system: "SQLWF" },
  { id: 3, name: "Admin Full Access", description: "Quyền đầy đủ cho quản trị viên", system: "SQLWF" },
  { id: 4, name: "Viewer Only", description: "Chỉ có quyền xem", system: "SQLWF" },
  { id: 5, name: "BDA Advanced", description: "Quyền nâng cao cho BDA", system: "SQLWF" },
];

// Mock users
const mockUsers: UserPermission[] = [
  {
    id: 1,
    username: "nguyenvana",
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@viettel.com.vn",
    unit: "TTDL-1",
    position: "Business Analyst",
    profiles: [availableProfiles[0], availableProfiles[4]],
    status: "active",
    lastUpdated: "2024-01-15",
  },
  {
    id: 2,
    username: "tranthib",
    fullName: "Trần Thị B",
    email: "tranthib@viettel.com.vn",
    unit: "TTDL-2",
    position: "Giao dịch viên",
    profiles: [availableProfiles[1]],
    status: "active",
    lastUpdated: "2024-01-10",
  },
  {
    id: 3,
    username: "lethic",
    fullName: "Lê Thị C",
    email: "lethic@viettel.com.vn",
    unit: "CNTT",
    position: "System Admin",
    profiles: [availableProfiles[2]],
    status: "active",
    lastUpdated: "2024-01-20",
  },
  {
    id: 4,
    username: "phamvand",
    fullName: "Phạm Văn D",
    email: "phamvand@viettel.com.vn",
    unit: "TTDL-1",
    position: "Data Analyst",
    profiles: [availableProfiles[0]],
    status: "active",
    lastUpdated: "2024-01-12",
  },
  {
    id: 5,
    username: "hoangvane",
    fullName: "Hoàng Văn E",
    email: "hoangvane@viettel.com.vn",
    unit: "TTDL-3",
    position: "Nhân viên",
    profiles: [availableProfiles[3]],
    status: "inactive",
    lastUpdated: "2024-01-05",
  },
];

// Mock aggregated permissions (simulating UNION of profiles)
const mockAggregatedPermissions = {
  "table_mgmt": {
    name: "Quản lý bảng",
    permissions: ["Tạo bảng", "Sửa bảng", "Tìm kiếm", "Xem chi tiết", "Upload metadata"],
  },
  "sql_mgmt": {
    name: "Quản lý truy vấn SQL",
    permissions: ["Tạo truy vấn", "Sửa truy vấn", "Clone truy vấn", "Tìm kiếm", "Thực thi"],
  },
  "job_mgmt": {
    name: "Quản lý Job",
    permissions: ["Tạo job", "Tìm kiếm"],
  },
};

export function UserPermissionsTab() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [unitFilter, setUnitFilter] = useState("all");
  const [profileFilter, setProfileFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [users] = useState<UserPermission[]>(mockUsers);
  
  // Panel states
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<"edit" | "view">("view");
  const [selectedUser, setSelectedUser] = useState<UserPermission | null>(null);
  
  // Form states
  const [selectedProfiles, setSelectedProfiles] = useState<number[]>([]);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["table_mgmt"]);

  // Handlers
  const handleView = (user: UserPermission) => {
    setPanelMode("view");
    setSelectedUser(user);
    setSelectedProfiles(user.profiles.map(p => p.id));
    setExpandedMenus(Object.keys(mockAggregatedPermissions));
    setIsPanelOpen(true);
  };

  const handleEdit = (user: UserPermission) => {
    setPanelMode("edit");
    setSelectedUser(user);
    setSelectedProfiles(user.profiles.map(p => p.id));
    setIsPanelOpen(true);
  };

  const handleSave = () => {
    if (selectedProfiles.length === 0) {
      toast({
        title: "Cảnh báo",
        description: "User cần có ít nhất 1 hồ sơ quyền",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Cập nhật thành công",
      description: `Đã cập nhật hồ sơ quyền cho ${selectedUser?.fullName}.`,
    });
    setIsPanelOpen(false);
  };

  const toggleProfile = (profileId: number) => {
    setSelectedProfiles(prev => 
      prev.includes(profileId) 
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    );
  };

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleReset = () => {
    setSearchTerm("");
    setUnitFilter("all");
    setProfileFilter("all");
    setStatusFilter("all");
  };

  // Get unique units
  const units = [...new Set(users.map(u => u.unit))];

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchUnit = unitFilter === "all" || user.unit === unitFilter;
    const matchProfile = profileFilter === "all" || 
                        user.profiles.some(p => p.id.toString() === profileFilter);
    const matchStatus = statusFilter === "all" || user.status === statusFilter;
    return matchSearch && matchUnit && matchProfile && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Phân quyền người dùng</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    Gán các hồ sơ quyền cho từng người dùng. Mỗi user có thể có nhiều hồ sơ, 
                    quyền sẽ được UNION (hợp nhất).
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-muted-foreground">
            Gán hồ sơ quyền cho từng người dùng trong hệ thống
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 bg-card/50 border border-border/50 rounded-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên, username, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background/50 border-border/50"
          />
        </div>
        <Select value={unitFilter} onValueChange={setUnitFilter}>
          <SelectTrigger className="w-36 bg-background/50 border-border/50">
            <SelectValue placeholder="Đơn vị" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {units.map(unit => (
              <SelectItem key={unit} value={unit}>{unit}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={profileFilter} onValueChange={setProfileFilter}>
          <SelectTrigger className="w-40 bg-background/50 border-border/50">
            <SelectValue placeholder="Hồ sơ quyền" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {availableProfiles.map(profile => (
              <SelectItem key={profile.id} value={profile.id.toString()}>
                {profile.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 bg-background/50 border-border/50">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={handleReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Làm mới
        </Button>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-semibold text-foreground">Người dùng</th>
                <th className="text-left p-4 font-semibold text-foreground">Đơn vị</th>
                <th className="text-left p-4 font-semibold text-foreground">Chức vụ</th>
                <th className="text-left p-4 font-semibold text-foreground">Hồ sơ quyền</th>
                <th className="text-left p-4 font-semibold text-foreground">Trạng thái</th>
                <th className="text-left p-4 font-semibold text-foreground">Cập nhật</th>
                <th className="text-center p-4 font-semibold text-foreground w-24">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{user.fullName}</div>
                        <div className="text-sm text-muted-foreground">{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm">{user.unit}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm">{user.position}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {user.profiles.slice(0, 2).map(profile => (
                        <Badge key={profile.id} variant="secondary" className="text-xs">
                          {profile.name}
                        </Badge>
                      ))}
                      {user.profiles.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.profiles.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={
                      user.status === "active" 
                        ? "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/20"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }>
                      {user.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">{user.lastUpdated}</span>
                  </td>
                  <td className="p-4 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(user)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Xem quyền tổng hợp
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(user)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa hồ sơ
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
        <SheetContent className="w-full sm:max-w-2xl overflow-hidden flex flex-col">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
              {selectedUser?.fullName}
            </SheetTitle>
            <SheetDescription>
              {panelMode === "view" 
                ? "Xem quyền tổng hợp từ các hồ sơ đã gán"
                : "Chỉnh sửa danh sách hồ sơ quyền cho người dùng"
              }
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="space-y-6 py-4">
              {/* User Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div>
                  <Label className="text-xs text-muted-foreground">Username</Label>
                  <p className="font-medium">{selectedUser?.username}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedUser?.email}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Đơn vị</Label>
                  <p className="font-medium">{selectedUser?.unit}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Chức vụ</Label>
                  <p className="font-medium">{selectedUser?.position}</p>
                </div>
              </div>

              <Separator />

              {/* Profile Assignment (Edit mode) */}
              {panelMode === "edit" && (
                <>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Gán hồ sơ quyền
                    </h3>
                    <div className="space-y-2 pl-4">
                      {availableProfiles.map(profile => (
                        <div 
                          key={profile.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedProfiles.includes(profile.id)
                              ? "bg-primary/5 border-primary/30"
                              : "hover:bg-muted/30"
                          }`}
                          onClick={() => toggleProfile(profile.id)}
                        >
                          <Checkbox 
                            checked={selectedProfiles.includes(profile.id)}
                            onCheckedChange={() => toggleProfile(profile.id)}
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{profile.name}</div>
                            <div className="text-xs text-muted-foreground">{profile.description}</div>
                          </div>
                          <Badge variant="outline" className="text-xs">{profile.system}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Assigned Profiles (View mode) */}
              {panelMode === "view" && (
                <>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Hồ sơ đã gán
                    </h3>
                    <div className="flex flex-wrap gap-2 pl-4">
                      {selectedUser?.profiles.map(profile => (
                        <Badge key={profile.id} variant="secondary" className="px-3 py-1">
                          <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                          {profile.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Aggregated Permissions (View mode) */}
              {panelMode === "view" && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Quyền tổng hợp
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      (UNION từ các hồ sơ)
                    </span>
                  </h3>
                  <div className="space-y-2 pl-4">
                    {Object.entries(mockAggregatedPermissions).map(([menuId, menu]) => {
                      const isExpanded = expandedMenus.includes(menuId);
                      return (
                        <div key={menuId} className="border rounded-lg overflow-hidden">
                          <div 
                            className="flex items-center gap-2 p-3 bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => toggleMenu(menuId)}
                          >
                            <button className="p-0.5">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                            </button>
                            <span className="font-medium text-sm flex-1">{menu.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {menu.permissions.length} quyền
                            </Badge>
                          </div>
                          {isExpanded && (
                            <div className="p-3 pt-2 space-y-1.5 bg-background">
                              {menu.permissions.map((perm, idx) => (
                                <div key={idx} className="flex items-center gap-2 pl-6 text-sm">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                  {perm}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Data Scope */}
                  <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                          Quyền dữ liệu: Theo đơn vị
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                          User có thể xem dữ liệu thuộc đơn vị {selectedUser?.unit}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          {panelMode === "edit" && (
            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
              <Button variant="outline" onClick={() => setIsPanelOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleSave} className="shadow-lg shadow-primary/20">
                Lưu thay đổi
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
