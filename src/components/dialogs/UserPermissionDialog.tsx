import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Plus, Trash2, Check, ChevronsUpDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserSystemPermissions } from "./user-permission-steps/UserSystemPermissions";
import { UserDataPermissions } from "./user-permission-steps/UserDataPermissions";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  unit: string;
  roles: string[];
  status: string;
}

interface UserPermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

interface SystemBlock {
  id: string;
  systemId: string;
  systemName: string;
  systemPermissions: any[];
  dataPermissions: any[];
}

// Mock profiles - in reality this would be filtered by API based on user's unit/role
const mockProfiles = [
  {
    id: "profile_1",
    name: "BDA - Toàn quyền",
    description: "Profile đầy đủ quyền cho Business Data Analyst",
    conditions: "Đơn vị = TTPTDL; Vai trò = BDA",
  },
  {
    id: "profile_2",
    name: "Data Viewer - Chỉ đọc",
    description: "Chỉ có quyền xem dữ liệu, không chỉnh sửa",
    conditions: "Đơn vị = TTPTDL; Vai trò = Viewer",
  },
  {
    id: "profile_3",
    name: "Admin - Full Access",
    description: "Toàn quyền quản trị hệ thống",
    conditions: "Vai trò = Admin",
  },
  {
    id: "profile_4",
    name: "DQ Manager - Quản lý DQ",
    description: "Quyền quản lý Data Quality Rules và Reports",
    conditions: "Đơn vị = TTPTDL; Vai trò = DQ Manager",
  },
  {
    id: "profile_5",
    name: "BI Analyst - Phân tích BI",
    description: "Quyền tạo và chỉnh sửa Dashboard, Reports",
    conditions: "Đơn vị = BI Team; Vai trò = Analyst",
  },
  {
    id: "profile_6",
    name: "Ticket Support - Hỗ trợ",
    description: "Quyền xử lý và phản hồi tickets",
    conditions: "Vai trò = Support",
  },
  {
    id: "profile_7",
    name: "Developer - SQL Access",
    description: "Quyền truy cập SQLWF và query database",
    conditions: "Vai trò = Developer",
  },
];

const mockSystems = [
  { id: "ticket", name: "Hệ thống Ticket" },
  { id: "dq", name: "Hệ thống DQ" },
  { id: "bi", name: "Hệ thống BI" },
  { id: "admin", name: "Hệ thống Admin" },
  { id: "sqlwf", name: "SQLWF" },
  { id: "dashboard", name: "Dashboard Visualize" },
];

export function UserPermissionDialog({ open, onOpenChange, user }: UserPermissionDialogProps) {
  const { toast } = useToast();
  const [permissionMode, setPermissionMode] = useState<"profile" | "custom">("profile");
  const [selectedProfile, setSelectedProfile] = useState<string>("");
  const [profileComboOpen, setProfileComboOpen] = useState(false);
  const [systemBlocks, setSystemBlocks] = useState<SystemBlock[]>([]);

  const handleSubmit = () => {
    if (permissionMode === "profile") {
      console.log("Assign profile:", selectedProfile, "to user:", user?.id);
      toast({
        title: "Phân quyền thành công",
        description: `Đã gán profile cho người dùng ${user?.name}`,
      });
    } else {
      console.log("Assign custom permissions:", systemBlocks, "to user:", user?.id);
      toast({
        title: "Phân quyền thành công",
        description: `Đã cấu hình quyền chi tiết cho người dùng ${user?.name}`,
      });
    }
    onOpenChange(false);
  };

  const addSystemBlock = (systemId: string) => {
    const system = mockSystems.find((s) => s.id === systemId);
    if (!system) return;

    const newBlock: SystemBlock = {
      id: `system-${Date.now()}`,
      systemId: system.id,
      systemName: system.name,
      systemPermissions: [],
      dataPermissions: [
        {
          id: `rule-${Date.now()}`,
          resourceId: "",
          resourceName: "",
          applyScope: "all",
          conditions: [],
          actions: [],
        },
      ],
    };

    setSystemBlocks([...systemBlocks, newBlock]);
  };

  const removeSystemBlock = (blockId: string) => {
    setSystemBlocks(systemBlocks.filter((b) => b.id !== blockId));
  };

  const updateSystemBlock = (blockId: string, updates: Partial<SystemBlock>) => {
    setSystemBlocks(systemBlocks.map((b) => (b.id === blockId ? { ...b, ...updates } : b)));
  };

  const isValid = () => {
    if (permissionMode === "profile") {
      return selectedProfile !== "";
    } else {
      return systemBlocks.length > 0;
    }
  };

  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-6xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">Phân quyền cho người dùng</SheetTitle>
          <SheetDescription>
            Gán quyền theo profile hoặc tự cấu hình chi tiết
          </SheetDescription>
        </SheetHeader>

        {/* User Info Header */}
        <Card className="mt-6 p-4 bg-muted/30">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Họ tên – Username</p>
              <p className="font-medium">{user.name} – {user.username}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Đơn vị</p>
              <p className="font-medium">{user.unit}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vai trò</p>
              <div className="flex gap-1 flex-wrap mt-1">
                {user.roles.map((role) => (
                  <Badge key={role} variant="secondary" className="font-normal">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Trạng thái tài khoản</p>
              {user.status === "active" ? (
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-none bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-200/50 mt-1">
                  Hoạt động
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-slate-100 text-slate-500 hover:bg-slate-200 mt-1">
                  Ngừng hoạt động
                </span>
              )}
            </div>
          </div>
        </Card>

        {/* Permission Mode Selection */}
        <div className="mt-6">
          <RadioGroup value={permissionMode} onValueChange={(value) => setPermissionMode(value as "profile" | "custom")}>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="profile" id="mode-profile" />
                <Label htmlFor="mode-profile" className="cursor-pointer font-medium">
                  Phân quyền theo Profile
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="mode-custom" />
                <Label htmlFor="mode-custom" className="cursor-pointer font-medium">
                  Phân quyền thủ công
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Content based on mode */}
        <div className="py-6">
          {permissionMode === "profile" ? (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold">Chọn Profile quyền</h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">
                      Chỉ hiển thị các profile mà người dùng thỏa mãn TẤT CẢ điều kiện
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-select">
                  Profile <span className="text-destructive">*</span>
                </Label>
                <Popover open={profileComboOpen} onOpenChange={setProfileComboOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={profileComboOpen}
                      className="w-full justify-between bg-background"
                    >
                      {selectedProfile ? (
                        <div className="text-left">
                          <div className="font-medium">{mockProfiles.find((p) => p.id === selectedProfile)?.name}</div>
                          <div className="text-xs text-muted-foreground">{mockProfiles.find((p) => p.id === selectedProfile)?.description}</div>
                        </div>
                      ) : (
                        "Chọn profile quyền"
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Tìm kiếm profile..." />
                      <CommandList>
                        <CommandEmpty>Không tìm thấy profile.</CommandEmpty>
                        <CommandGroup>
                          {mockProfiles.map((profile) => (
                            <CommandItem
                              key={profile.id}
                              value={profile.name + " " + profile.description}
                              onSelect={() => {
                                setSelectedProfile(profile.id);
                                setProfileComboOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedProfile === profile.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="py-1">
                                <div className="font-medium">{profile.name}</div>
                                <div className="text-xs text-muted-foreground">{profile.description}</div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {selectedProfile && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Điều kiện áp dụng:</strong>{" "}
                    {mockProfiles.find((p) => p.id === selectedProfile)?.conditions}
                  </p>
                </div>
              )}
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Add System Button */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Cấu hình quyền theo hệ thống</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105">
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm hệ thống
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[250px] p-0" align="end">
                    <Command>
                      <CommandInput placeholder="Tìm hệ thống..." />
                      <CommandList>
                        <CommandEmpty>Không tìm thấy hệ thống.</CommandEmpty>
                        <CommandGroup>
                          {mockSystems
                            .filter((sys) => !systemBlocks.some((b) => b.systemId === sys.id))
                            .map((system) => (
                              <CommandItem
                                key={system.id}
                                value={system.name}
                                onSelect={() => {
                                  addSystemBlock(system.id);
                                }}
                              >
                                {system.name}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* System Blocks */}
              {systemBlocks.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">
                  <p>Chưa có hệ thống nào được thêm</p>
                  <p className="text-sm mt-2">Sử dụng dropdown "Thêm hệ thống" ở trên để bắt đầu</p>
                </Card>
              ) : (
                systemBlocks.map((block) => (
                  <Card key={block.id} className="p-6 border-2">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold">{block.systemName}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeSystemBlock(block.id)}
                        title="Xóa hệ thống"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <Tabs defaultValue="system" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="system">Quyền hệ thống</TabsTrigger>
                        <TabsTrigger value="data">Quyền dữ liệu (ABAC)</TabsTrigger>
                      </TabsList>

                      <TabsContent value="system" className="mt-6">
                        <UserSystemPermissions
                          systemId={block.systemId}
                          permissions={block.systemPermissions}
                          onChange={(perms) => updateSystemBlock(block.id, { systemPermissions: perms })}
                        />
                      </TabsContent>

                      <TabsContent value="data" className="mt-6">
                        <UserDataPermissions
                          systemId={block.systemId}
                          dataPermissions={block.dataPermissions}
                          onChange={(perms) => updateSystemBlock(block.id, { dataPermissions: perms })}
                        />
                      </TabsContent>
                    </Tabs>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setPermissionMode("profile");
              setSelectedProfile("");
              setProfileComboOpen(false);
              setSystemBlocks([]);
            }}
          >
            Hủy
          </Button>
          <Button
            type="button"
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
