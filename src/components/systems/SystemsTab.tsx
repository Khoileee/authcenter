import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Plus, RotateCcw, Eye, Pencil, Trash2, RefreshCw,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Server, Database, Globe, Key, CheckCircle2, XCircle, AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Types
interface System {
  id: number;
  code: string;
  name: string;
  description: string;
  type: "web" | "api" | "mobile" | "desktop";
  // Connection info
  host: string;
  port: number;
  protocol: "http" | "https";
  basePath: string;
  // Database info
  dbType: "postgresql" | "mysql" | "oracle" | "sqlserver" | "mongodb";
  dbHost: string;
  dbPort: number;
  dbName: string;
  // Auth info
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  authEndpoint?: string;
  // Status
  status: "active" | "inactive";
  connectionStatus: "connected" | "disconnected" | "error";
  lastSync: string;
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  resourceCount: number;
  userCount: number;
}

// Mock data
const mockSystems: System[] = [
  {
    id: 1,
    code: "SQLWF",
    name: "SQL Workflow",
    description: "Hệ thống quản lý workflow và truy vấn SQL",
    type: "web",
    host: "sqlwf.viettel.vn",
    port: 443,
    protocol: "https",
    basePath: "/api/v1",
    dbType: "postgresql",
    dbHost: "db-sqlwf.viettel.vn",
    dbPort: 5432,
    dbName: "sqlwf_prod",
    apiKey: "sk-xxxxx-xxxxx",
    clientId: "sqlwf-client",
    clientSecret: "••••••••",
    authEndpoint: "/oauth/token",
    status: "active",
    connectionStatus: "connected",
    lastSync: "2026-01-29 10:30:00",
    createdAt: "2025-06-15",
    updatedAt: "2026-01-29",
    createdBy: "Admin",
    resourceCount: 45,
    userCount: 120,
  },
  {
    id: 2,
    code: "vDVS",
    name: "Viettel Data Virtualization",
    description: "Hệ thống ảo hóa và quản lý dữ liệu tập trung",
    type: "web",
    host: "vdvs.viettel.vn",
    port: 443,
    protocol: "https",
    basePath: "/api/v2",
    dbType: "oracle",
    dbHost: "db-vdvs.viettel.vn",
    dbPort: 1521,
    dbName: "VDVS_PROD",
    apiKey: "sk-yyyyy-yyyyy",
    clientId: "vdvs-client",
    clientSecret: "••••••••",
    authEndpoint: "/auth/token",
    status: "active",
    connectionStatus: "connected",
    lastSync: "2026-01-29 09:15:00",
    createdAt: "2025-03-20",
    updatedAt: "2026-01-28",
    createdBy: "Admin",
    resourceCount: 78,
    userCount: 250,
  },
  {
    id: 3,
    code: "VTM",
    name: "Viettel Ticket Management",
    description: "Hệ thống quản lý ticket và hỗ trợ khách hàng",
    type: "web",
    host: "vtm.viettel.vn",
    port: 8443,
    protocol: "https",
    basePath: "/api",
    dbType: "mysql",
    dbHost: "db-vtm.viettel.vn",
    dbPort: 3306,
    dbName: "vtm_production",
    apiKey: "sk-zzzzz-zzzzz",
    clientId: "vtm-client",
    clientSecret: "••••••••",
    authEndpoint: "/oauth2/token",
    status: "active",
    connectionStatus: "error",
    lastSync: "2026-01-28 14:00:00",
    createdAt: "2025-01-10",
    updatedAt: "2026-01-27",
    createdBy: "Admin",
    resourceCount: 32,
    userCount: 85,
  },
  {
    id: 4,
    code: "DQ",
    name: "Data Quality Platform",
    description: "Nền tảng quản lý và kiểm soát chất lượng dữ liệu",
    type: "api",
    host: "dq-api.viettel.vn",
    port: 443,
    protocol: "https",
    basePath: "/v1",
    dbType: "postgresql",
    dbHost: "db-dq.viettel.vn",
    dbPort: 5432,
    dbName: "dq_master",
    apiKey: "sk-aaaaa-aaaaa",
    clientId: "dq-service",
    clientSecret: "••••••••",
    authEndpoint: "/auth/oauth/token",
    status: "inactive",
    connectionStatus: "disconnected",
    lastSync: "2026-01-20 08:00:00",
    createdAt: "2025-08-01",
    updatedAt: "2026-01-20",
    createdBy: "Admin",
    resourceCount: 28,
    userCount: 45,
  },
  {
    id: 5,
    code: "ANALYTICS",
    name: "Analytics Dashboard",
    description: "Hệ thống phân tích và báo cáo dữ liệu",
    type: "web",
    host: "analytics.viettel.vn",
    port: 443,
    protocol: "https",
    basePath: "/api/v1",
    dbType: "mongodb",
    dbHost: "mongo-analytics.viettel.vn",
    dbPort: 27017,
    dbName: "analytics_db",
    apiKey: "sk-bbbbb-bbbbb",
    clientId: "analytics-app",
    clientSecret: "••••••••",
    authEndpoint: "/api/auth",
    status: "active",
    connectionStatus: "connected",
    lastSync: "2026-01-29 11:00:00",
    createdAt: "2025-09-15",
    updatedAt: "2026-01-29",
    createdBy: "Admin",
    resourceCount: 15,
    userCount: 180,
  },
];

const systemTypes = [
  { value: "web", label: "Web Application" },
  { value: "api", label: "API Service" },
  { value: "mobile", label: "Mobile App" },
  { value: "desktop", label: "Desktop App" },
];

const dbTypes = [
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
  { value: "oracle", label: "Oracle" },
  { value: "sqlserver", label: "SQL Server" },
  { value: "mongodb", label: "MongoDB" },
];

export function SystemsTab() {
  const { toast } = useToast();
  const [systems, setSystems] = useState<System[]>(mockSystems);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  // Panel states
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<"create" | "edit" | "view">("create");
  const [selectedSystem, setSelectedSystem] = useState<System | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  
  // Form states - General
  const [formCode, setFormCode] = useState("");
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formType, setFormType] = useState<string>("web");
  const [formStatus, setFormStatus] = useState<"active" | "inactive">("active");
  
  // Form states - Connection
  const [formHost, setFormHost] = useState("");
  const [formPort, setFormPort] = useState("");
  const [formProtocol, setFormProtocol] = useState<"http" | "https">("https");
  const [formBasePath, setFormBasePath] = useState("/api/v1");
  
  // Form states - Database
  const [formDbType, setFormDbType] = useState<string>("postgresql");
  const [formDbHost, setFormDbHost] = useState("");
  const [formDbPort, setFormDbPort] = useState("");
  const [formDbName, setFormDbName] = useState("");
  
  // Form states - Auth
  const [formApiKey, setFormApiKey] = useState("");
  const [formClientId, setFormClientId] = useState("");
  const [formClientSecret, setFormClientSecret] = useState("");
  const [formAuthEndpoint, setFormAuthEndpoint] = useState("/oauth/token");

  // Filter systems
  const filteredSystems = systems.filter(system => {
    const matchSearch = system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       system.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       system.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || system.status === statusFilter;
    const matchType = typeFilter === "all" || system.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredSystems.length / pageSize) || 1;
  const paginatedSystems = filteredSystems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handlers
  const handleSearch = () => {
    setCurrentPage(1);
    toast({
      title: "Đang tìm kiếm",
      description: `Tìm với từ khóa: "${searchTerm}"`,
    });
  };

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
    setCurrentPage(1);
  };

  const resetForm = () => {
    setFormCode("");
    setFormName("");
    setFormDescription("");
    setFormType("web");
    setFormStatus("active");
    setFormHost("");
    setFormPort("");
    setFormProtocol("https");
    setFormBasePath("/api/v1");
    setFormDbType("postgresql");
    setFormDbHost("");
    setFormDbPort("");
    setFormDbName("");
    setFormApiKey("");
    setFormClientId("");
    setFormClientSecret("");
    setFormAuthEndpoint("/oauth/token");
  };

  const loadFormFromSystem = (system: System) => {
    setFormCode(system.code);
    setFormName(system.name);
    setFormDescription(system.description);
    setFormType(system.type);
    setFormStatus(system.status);
    setFormHost(system.host);
    setFormPort(system.port.toString());
    setFormProtocol(system.protocol);
    setFormBasePath(system.basePath);
    setFormDbType(system.dbType);
    setFormDbHost(system.dbHost);
    setFormDbPort(system.dbPort.toString());
    setFormDbName(system.dbName);
    setFormApiKey(system.apiKey || "");
    setFormClientId(system.clientId || "");
    setFormClientSecret(system.clientSecret || "");
    setFormAuthEndpoint(system.authEndpoint || "");
  };

  const handleCreate = () => {
    setPanelMode("create");
    setSelectedSystem(null);
    resetForm();
    setActiveTab("general");
    setIsPanelOpen(true);
  };

  const handleView = (system: System) => {
    setPanelMode("view");
    setSelectedSystem(system);
    loadFormFromSystem(system);
    setActiveTab("general");
    setIsPanelOpen(true);
  };

  const handleEdit = (system: System) => {
    setPanelMode("edit");
    setSelectedSystem(system);
    loadFormFromSystem(system);
    setActiveTab("general");
    setIsPanelOpen(true);
  };

  const handleDelete = (system: System) => {
    toast({
      title: "Đã xóa",
      description: `Hệ thống "${system.name}" đã được xóa.`,
      variant: "destructive",
    });
  };

  const handleToggleStatus = (system: System) => {
    setSystems(prev => prev.map(s => 
      s.id === system.id 
        ? { ...s, status: s.status === "active" ? "inactive" : "active" }
        : s
    ));
    toast({
      title: "Đã cập nhật trạng thái",
      description: `Hệ thống "${system.name}" đã được ${system.status === "active" ? "tắt" : "bật"}.`,
    });
  };

  const handleTestConnection = (system: System) => {
    toast({
      title: "Đang kiểm tra kết nối...",
      description: `Kiểm tra kết nối tới ${system.host}:${system.port}`,
    });
    // Simulate connection test
    setTimeout(() => {
      toast({
        title: "Kết nối thành công",
        description: `Hệ thống "${system.name}" đang hoạt động bình thường.`,
      });
    }, 1500);
  };

  const handleSyncResources = (system: System) => {
    toast({
      title: "Đang đồng bộ...",
      description: `Đồng bộ tài nguyên từ ${system.name}`,
    });
  };

  const handleSave = () => {
    if (!formCode.trim() || !formName.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mã và tên hệ thống",
        variant: "destructive",
      });
      return;
    }

    if (panelMode === "create") {
      toast({
        title: "Tạo thành công",
        description: `Hệ thống "${formName}" đã được tạo.`,
      });
    } else {
      toast({
        title: "Cập nhật thành công",
        description: `Hệ thống "${formName}" đã được cập nhật.`,
      });
    }
    setIsPanelOpen(false);
  };

  // Helpers
  const getConnectionStatusBadge = (status: System["connectionStatus"]) => {
    switch (status) {
      case "connected":
        return (
          <Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 border-emerald-200/50">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Đã kết nối
          </Badge>
        );
      case "disconnected":
        return (
          <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200">
            <XCircle className="h-3 w-3 mr-1" />
            Ngắt kết nối
          </Badge>
        );
      case "error":
        return (
          <Badge variant="outline" className="bg-red-500/15 text-red-600 border-red-200/50">
            <AlertCircle className="h-3 w-3 mr-1" />
            Lỗi
          </Badge>
        );
    }
  };

  const getTypeBadge = (type: System["type"]) => {
    const colors: Record<string, string> = {
      web: "bg-blue-500/15 text-blue-600 border-blue-200/50",
      api: "bg-purple-500/15 text-purple-600 border-purple-200/50",
      mobile: "bg-orange-500/15 text-orange-600 border-orange-200/50",
      desktop: "bg-gray-500/15 text-gray-600 border-gray-200/50",
    };
    const labels: Record<string, string> = {
      web: "Web",
      api: "API",
      mobile: "Mobile",
      desktop: "Desktop",
    };
    return (
      <Badge variant="outline" className={colors[type]}>
        {labels[type]}
      </Badge>
    );
  };

  const formatDate = (dateStr: string) => {
    return dateStr;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold tracking-tight">Danh sách hệ thống</h2>
          <p className="text-sm text-muted-foreground">
            Quản lý các hệ thống được tích hợp vào Auth Center
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" />
          Thêm hệ thống
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 bg-card/50 border border-border/50 rounded-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên, mã, mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9 bg-background/50 border-border/50"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40 bg-background/50 border-border/50">
            <SelectValue placeholder="Loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            {systemTypes.map(t => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
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

      {/* Systems Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border bg-muted/50">
              <TableHead className="font-semibold text-foreground/70 w-16">STT</TableHead>
              <TableHead className="font-semibold text-foreground/70 w-28">Mã</TableHead>
              <TableHead className="font-semibold text-foreground/70">Tên hệ thống</TableHead>
              <TableHead className="font-semibold text-foreground/70 w-24">Loại</TableHead>
              <TableHead className="font-semibold text-foreground/70 w-32">Kết nối</TableHead>
              <TableHead className="font-semibold text-foreground/70 w-28 text-center">Tài nguyên</TableHead>
              <TableHead className="font-semibold text-foreground/70 w-28 text-center">Người dùng</TableHead>
              <TableHead className="font-semibold text-foreground/70 w-24">Trạng thái</TableHead>
              <TableHead className="font-semibold text-foreground/70 text-center w-36">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSystems.length > 0 ? (
              paginatedSystems.map((system, idx) => (
                <TableRow key={system.id} className="border-border transition-colors">
                  <TableCell className="py-3 text-muted-foreground">
                    {(currentPage - 1) * pageSize + idx + 1}
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="font-mono text-sm font-medium text-primary">{system.code}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="space-y-1">
                      <span className="font-medium text-foreground">{system.name}</span>
                      <p className="text-xs text-muted-foreground truncate max-w-xs">{system.description}</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    {getTypeBadge(system.type)}
                  </TableCell>
                  <TableCell className="py-3">
                    {getConnectionStatusBadge(system.connectionStatus)}
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <span className="text-sm font-medium">{system.resourceCount}</span>
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <span className="text-sm font-medium">{system.userCount}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <Switch
                      checked={system.status === "active"}
                      onCheckedChange={() => handleToggleStatus(system)}
                    />
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        onClick={() => handleView(system)}
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        onClick={() => handleEdit(system)}
                        title="Chỉnh sửa"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-600/10"
                        onClick={() => handleTestConnection(system)}
                        title="Kiểm tra kết nối"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(system)}
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
                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
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
          Hiển thị {paginatedSystems.length} trên tổng số {filteredSystems.length} kết quả
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
        <SheetContent className="w-full sm:max-w-2xl overflow-hidden flex flex-col p-0">
          {/* Header */}
          <div className="px-6 py-4 border-b bg-muted/30">
            <SheetHeader>
              <SheetTitle className="text-xl">
                {panelMode === "create" ? "Thêm hệ thống mới" : 
                 panelMode === "edit" ? "Chỉnh sửa hệ thống" : 
                 `Chi tiết: ${selectedSystem?.name}`}
              </SheetTitle>
              <SheetDescription>
                {panelMode === "view" 
                  ? "Xem thông tin chi tiết hệ thống"
                  : "Cấu hình thông tin kết nối hệ thống"
                }
              </SheetDescription>
            </SheetHeader>
          </div>

          {/* Form Content with Tabs */}
          <div className="flex-1 overflow-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="px-6 pt-4 border-b">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="general" className="gap-2">
                    <Server className="h-4 w-4" />
                    Thông tin
                  </TabsTrigger>
                  <TabsTrigger value="connection" className="gap-2">
                    <Globe className="h-4 w-4" />
                    Kết nối
                  </TabsTrigger>
                  <TabsTrigger value="database" className="gap-2">
                    <Database className="h-4 w-4" />
                    Database
                  </TabsTrigger>
                  <TabsTrigger value="auth" className="gap-2">
                    <Key className="h-4 w-4" />
                    Xác thực
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-auto p-6">
                {/* Tab 1: General Info */}
                <TabsContent value="general" className="mt-0 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="code" className="text-sm">Mã hệ thống <span className="text-destructive">*</span></Label>
                      <Input
                        id="code"
                        value={formCode}
                        onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                        placeholder="VD: SQLWF"
                        disabled={panelMode === "view"}
                        className="font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm">Loại hệ thống</Label>
                      <Select value={formType} onValueChange={setFormType} disabled={panelMode === "view"}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {systemTypes.map(t => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-sm">Tên hệ thống <span className="text-destructive">*</span></Label>
                    <Input
                      id="name"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="VD: SQL Workflow"
                      disabled={panelMode === "view"}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="description" className="text-sm">Mô tả</Label>
                    <Textarea
                      id="description"
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Mô tả chi tiết về hệ thống..."
                      disabled={panelMode === "view"}
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <Label className="text-sm">Trạng thái hoạt động</Label>
                    <Switch
                      checked={formStatus === "active"}
                      onCheckedChange={(checked) => setFormStatus(checked ? "active" : "inactive")}
                      disabled={panelMode === "view"}
                    />
                  </div>

                  {panelMode === "view" && selectedSystem && (
                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Trạng thái kết nối:</span>
                        {getConnectionStatusBadge(selectedSystem.connectionStatus)}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Đồng bộ lần cuối:</span>
                        <span>{selectedSystem.lastSync}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Số tài nguyên:</span>
                        <span>{selectedSystem.resourceCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Số người dùng:</span>
                        <span>{selectedSystem.userCount}</span>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Tab 2: Connection */}
                <TabsContent value="connection" className="mt-0 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm">Protocol</Label>
                      <Select value={formProtocol} onValueChange={(v: "http" | "https") => setFormProtocol(v)} disabled={panelMode === "view"}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="https">HTTPS</SelectItem>
                          <SelectItem value="http">HTTP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5 col-span-2">
                      <Label htmlFor="host" className="text-sm">Host / Domain</Label>
                      <Input
                        id="host"
                        value={formHost}
                        onChange={(e) => setFormHost(e.target.value)}
                        placeholder="api.example.com"
                        disabled={panelMode === "view"}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="port" className="text-sm">Port</Label>
                      <Input
                        id="port"
                        type="number"
                        value={formPort}
                        onChange={(e) => setFormPort(e.target.value)}
                        placeholder="443"
                        disabled={panelMode === "view"}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="basePath" className="text-sm">Base Path</Label>
                      <Input
                        id="basePath"
                        value={formBasePath}
                        onChange={(e) => setFormBasePath(e.target.value)}
                        placeholder="/api/v1"
                        disabled={panelMode === "view"}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                    <Label className="text-sm text-muted-foreground">URL Preview</Label>
                    <code className="block text-sm font-mono text-primary break-all">
                      {formProtocol}://{formHost || "example.com"}{formPort ? `:${formPort}` : ""}{formBasePath}
                    </code>
                  </div>

                  {panelMode !== "view" && (
                    <Button variant="outline" className="w-full gap-2" onClick={() => toast({ title: "Đang kiểm tra..." })}>
                      <RefreshCw className="h-4 w-4" />
                      Kiểm tra kết nối
                    </Button>
                  )}
                </TabsContent>

                {/* Tab 3: Database */}
                <TabsContent value="database" className="mt-0 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm">Loại Database</Label>
                    <Select value={formDbType} onValueChange={setFormDbType} disabled={panelMode === "view"}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {dbTypes.map(t => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5 col-span-2">
                      <Label htmlFor="dbHost" className="text-sm">Database Host</Label>
                      <Input
                        id="dbHost"
                        value={formDbHost}
                        onChange={(e) => setFormDbHost(e.target.value)}
                        placeholder="db.example.com"
                        disabled={panelMode === "view"}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="dbPort" className="text-sm">Port</Label>
                      <Input
                        id="dbPort"
                        type="number"
                        value={formDbPort}
                        onChange={(e) => setFormDbPort(e.target.value)}
                        placeholder="5432"
                        disabled={panelMode === "view"}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="dbName" className="text-sm">Database Name</Label>
                    <Input
                      id="dbName"
                      value={formDbName}
                      onChange={(e) => setFormDbName(e.target.value)}
                      placeholder="my_database"
                      disabled={panelMode === "view"}
                    />
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                    <Label className="text-sm text-muted-foreground">Connection String Preview</Label>
                    <code className="block text-sm font-mono text-primary break-all">
                      {formDbType}://{formDbHost || "host"}{formDbPort ? `:${formDbPort}` : ""}/{formDbName || "database"}
                    </code>
                  </div>
                </TabsContent>

                {/* Tab 4: Authentication */}
                <TabsContent value="auth" className="mt-0 space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="apiKey" className="text-sm">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={formApiKey}
                      onChange={(e) => setFormApiKey(e.target.value)}
                      placeholder="sk-xxxxx-xxxxx"
                      disabled={panelMode === "view"}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="clientId" className="text-sm">Client ID</Label>
                      <Input
                        id="clientId"
                        value={formClientId}
                        onChange={(e) => setFormClientId(e.target.value)}
                        placeholder="my-client-id"
                        disabled={panelMode === "view"}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="clientSecret" className="text-sm">Client Secret</Label>
                      <Input
                        id="clientSecret"
                        type="password"
                        value={formClientSecret}
                        onChange={(e) => setFormClientSecret(e.target.value)}
                        placeholder="••••••••"
                        disabled={panelMode === "view"}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="authEndpoint" className="text-sm">Auth Endpoint</Label>
                    <Input
                      id="authEndpoint"
                      value={formAuthEndpoint}
                      onChange={(e) => setFormAuthEndpoint(e.target.value)}
                      placeholder="/oauth/token"
                      disabled={panelMode === "view"}
                    />
                  </div>

                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-sm text-amber-700">
                      <strong>Lưu ý:</strong> Thông tin xác thực được mã hóa và lưu trữ an toàn. 
                      Không chia sẻ API Key và Client Secret với người khác.
                    </p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Footer */}
          {panelMode !== "view" && (
            <SheetFooter className="px-6 py-4 border-t bg-muted/30">
              <div className="flex gap-2 w-full">
                <Button variant="outline" onClick={() => setIsPanelOpen(false)} className="flex-1">
                  Hủy
                </Button>
                <Button onClick={handleSave} className="flex-1">
                  {panelMode === "create" ? "Tạo mới" : "Lưu thay đổi"}
                </Button>
              </div>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
