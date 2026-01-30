import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, Plus, RotateCcw, ChevronDown, ChevronRight, Eye, Pencil, Trash2,
  ChevronLeft, ChevronRight as ChevronRightIcon, ChevronsLeft, ChevronsRight, Building2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Types
interface Unit {
  id: number;
  code: string;
  name: string;
  description: string;
  parentId: number | null;
  level: number;
  createdAt: string;
  createdBy: string;
  status: "active" | "inactive";
  children?: Unit[];
}

// Mock data với cấu trúc cây
const mockUnits: Unit[] = [
  {
    id: 1,
    code: "#HE170471",
    name: "Tổng Công ty Dịch vụ số Viettel",
    description: "Tổng công ty cung cấp các dịch vụ số của Viettel",
    parentId: null,
    level: 0,
    createdAt: "2025-07-20 19:00:20",
    createdBy: "Nguyễn Văn Admin",
    status: "active",
  },
  {
    id: 2,
    code: "#HE170471",
    name: "Trung tâm thanh toán số",
    description: "Trung tâm phụ trách các dịch vụ thanh toán số",
    parentId: 1,
    level: 1,
    createdAt: "2025-07-20 19:00:20",
    createdBy: "Trần Thị Manager",
    status: "active",
  },
  {
    id: 3,
    code: "#HE170471",
    name: "Trung tâm tài chính số",
    description: "Trung tâm quản lý tài chính và kế toán số",
    parentId: 1,
    level: 1,
    createdAt: "2025-07-20 19:00:20",
    createdBy: "Lê Văn CFO",
    status: "active",
  },
  {
    id: 4,
    code: "#HE170471",
    name: "Trung tâm công nghệ",
    description: "Trung tâm phát triển công nghệ và hạ tầng",
    parentId: 1,
    level: 1,
    createdAt: "2025-07-20 19:00:20",
    createdBy: "Phạm Văn CTO",
    status: "active",
  },
  {
    id: 5,
    code: "#HE170471",
    name: "Trung tâm phân tích dữ liệu",
    description: "Trung tâm phân tích và xử lý dữ liệu",
    parentId: 1,
    level: 1,
    createdAt: "2025-07-20 19:00:20",
    createdBy: "Hoàng Thị Data",
    status: "active",
  },
  {
    id: 6,
    code: "#HE170471",
    name: "Phòng PTDLCS",
    description: "Phòng Phát triển Dữ liệu Chuyên sâu",
    parentId: 5,
    level: 2,
    createdAt: "2025-07-20 19:00:20",
    createdBy: "Nguyễn Văn Dev",
    status: "active",
  },
  {
    id: 7,
    code: "#HE170471",
    name: "Phòng KTDL",
    description: "Phòng Kỹ thuật Dữ liệu",
    parentId: 5,
    level: 2,
    createdAt: "2025-07-20 19:00:20",
    createdBy: "Trần Thị Engineer",
    status: "active",
  },
  {
    id: 8,
    code: "#HE170471",
    name: "Phòng Hạ tầng dữ liệu",
    description: "Phòng quản lý hạ tầng dữ liệu",
    parentId: 5,
    level: 2,
    createdAt: "2025-07-20 19:00:20",
    createdBy: "Lê Văn Infra",
    status: "active",
  },
  {
    id: 9,
    code: "#HE170471",
    name: "Trung tâm Kinh doanh quốc tế",
    description: "Trung tâm kinh doanh và phát triển thị trường quốc tế",
    parentId: 1,
    level: 1,
    createdAt: "2025-07-20 19:00:20",
    createdBy: "Vũ Thị Business",
    status: "active",
  },
  {
    id: 10,
    code: "#HE170471",
    name: "Bộ phận phát triển sản phẩm",
    description: "Bộ phận nghiên cứu và phát triển sản phẩm mới",
    parentId: 9,
    level: 2,
    createdAt: "2025-07-20 19:00:20",
    createdBy: "Đỗ Văn Product",
    status: "active",
  },
  {
    id: 11,
    code: "#HE170471",
    name: "Bộ phận kinh doanh",
    description: "Bộ phận kinh doanh và bán hàng",
    parentId: 9,
    level: 2,
    createdAt: "2025-07-20 19:00:20",
    createdBy: "Mai Thị Sales",
    status: "active",
  },
  {
    id: 12,
    code: "#HE170471",
    name: "Phòng Marketing",
    description: "Phòng tiếp thị và truyền thông",
    parentId: 4,
    level: 2,
    createdAt: "2025-07-20 19:00:20",
    createdBy: "Hoàng Văn Marketing",
    status: "active",
  },
];

// Helper: Build tree structure
const buildTree = (units: Unit[], parentId: number | null = null): Unit[] => {
  return units
    .filter(unit => unit.parentId === parentId)
    .map(unit => ({
      ...unit,
      children: buildTree(units, unit.id),
    }));
};

// Helper: Flatten tree with visibility
const flattenTree = (units: Unit[], expandedIds: Set<number>, level = 0): Unit[] => {
  const result: Unit[] = [];
  units.forEach(unit => {
    result.push({ ...unit, level });
    if (unit.children && unit.children.length > 0 && expandedIds.has(unit.id)) {
      result.push(...flattenTree(unit.children, expandedIds, level + 1));
    }
  });
  return result;
};

// Helper: Get all parent units for dropdown
const getParentOptions = (units: Unit[], excludeId?: number): { value: string; label: string; level: number }[] => {
  const options: { value: string; label: string; level: number }[] = [];
  
  const traverse = (unitList: Unit[], level: number) => {
    unitList.forEach(unit => {
      if (unit.id !== excludeId) {
        options.push({
          value: unit.id.toString(),
          label: "—".repeat(level) + " " + unit.name,
          level,
        });
        if (unit.children) {
          traverse(unit.children, level + 1);
        }
      }
    });
  };
  
  const tree = buildTree(units);
  traverse(tree, 0);
  return options;
};

// Helper: Check if unit has children
const hasChildren = (unitId: number, units: Unit[]): boolean => {
  return units.some(u => u.parentId === unitId);
};

export function UnitsTab() {
  const { toast } = useToast();
  const [units, setUnits] = useState<Unit[]>(mockUnits);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  // Expanded rows for tree
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set([1, 5, 9]));
  
  // Selected rows for bulk actions
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  
  // Panel states
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<"create" | "edit" | "view">("create");
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  
  // Form states
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formParentId, setFormParentId] = useState<string>("none");
  const [formStatus, setFormStatus] = useState<"active" | "inactive">("active");

  // Build tree and flatten
  const tree = buildTree(units);
  
  // Filter units
  const filteredUnits = units.filter(unit => {
    const matchSearch = unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       unit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       unit.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || unit.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Flatten for display
  const displayUnits = flattenTree(buildTree(filteredUnits), expandedIds);
  
  // Pagination
  const totalPages = Math.ceil(displayUnits.length / pageSize) || 1;
  const paginatedUnits = displayUnits.slice(
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
    setCurrentPage(1);
  };

  const toggleExpand = (unitId: number) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(unitId)) {
        newSet.delete(unitId);
      } else {
        newSet.add(unitId);
      }
      return newSet;
    });
  };

  const toggleSelect = (unitId: number) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(unitId)) {
        newSet.delete(unitId);
      } else {
        newSet.add(unitId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedUnits.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedUnits.map(u => u.id)));
    }
  };

  const handleCreate = () => {
    setPanelMode("create");
    setSelectedUnit(null);
    setFormName("");
    setFormCode("");
    setFormDescription("");
    setFormParentId("none");
    setFormStatus("active");
    setIsPanelOpen(true);
  };

  const handleView = (unit: Unit) => {
    setPanelMode("view");
    setSelectedUnit(unit);
    setFormName(unit.name);
    setFormCode(unit.code);
    setFormDescription(unit.description);
    setFormParentId(unit.parentId?.toString() || "none");
    setFormStatus(unit.status);
    setIsPanelOpen(true);
  };

  const handleEdit = (unit: Unit) => {
    setPanelMode("edit");
    setSelectedUnit(unit);
    setFormName(unit.name);
    setFormCode(unit.code);
    setFormDescription(unit.description);
    setFormParentId(unit.parentId?.toString() || "none");
    setFormStatus(unit.status);
    setIsPanelOpen(true);
  };

  const handleDelete = (unit: Unit) => {
    if (hasChildren(unit.id, units)) {
      toast({
        title: "Không thể xóa",
        description: "Đơn vị này có đơn vị con. Vui lòng xóa đơn vị con trước.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Đã xóa",
      description: `Đơn vị "${unit.name}" đã được xóa.`,
      variant: "destructive",
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    toast({
      title: "Đã xóa",
      description: `Đã xóa ${selectedIds.size} đơn vị.`,
      variant: "destructive",
    });
    setSelectedIds(new Set());
  };

  const handleAddChild = (parentUnit: Unit) => {
    setPanelMode("create");
    setSelectedUnit(null);
    setFormName("");
    setFormCode("");
    setFormDescription("");
    setFormParentId(parentUnit.id.toString());
    setFormStatus("active");
    setIsPanelOpen(true);
  };

  const handleToggleStatus = (unit: Unit) => {
    setUnits(prev => prev.map(u => 
      u.id === unit.id 
        ? { ...u, status: u.status === "active" ? "inactive" : "active" }
        : u
    ));
    toast({
      title: "Đã cập nhật trạng thái",
      description: `Đơn vị "${unit.name}" đã được ${unit.status === "active" ? "tắt" : "bật"}.`,
    });
  };

  const handleSave = () => {
    if (!formName.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên đơn vị",
        variant: "destructive",
      });
      return;
    }

    if (panelMode === "create") {
      toast({
        title: "Tạo thành công",
        description: `Đơn vị "${formName}" đã được tạo.`,
      });
    } else {
      toast({
        title: "Cập nhật thành công",
        description: `Đơn vị "${formName}" đã được cập nhật.`,
      });
    }
    setIsPanelOpen(false);
  };

  // Format date
  const formatDate = (dateStr: string) => {
    return dateStr;
  };

  // Get parent name
  const getParentName = (parentId: number | null) => {
    if (!parentId) return "—";
    const parent = units.find(u => u.id === parentId);
    return parent?.name || "—";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Danh sách đơn vị</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Quản lý cấu trúc tổ chức đơn vị theo cấp bậc
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <Button variant="destructive" onClick={handleBulkDelete} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Xóa ({selectedIds.size})
            </Button>
          )}
          <Button onClick={handleCreate} className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" />
            Thêm đơn vị
          </Button>
        </div>
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

      {/* Units Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border bg-muted/50">
              <TableHead className="font-semibold text-foreground/70 w-12">
                <Checkbox 
                  checked={selectedIds.size === paginatedUnits.length && paginatedUnits.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="font-semibold text-foreground/70">Tên đơn vị</TableHead>
              <TableHead className="font-semibold text-foreground/70 w-32">Mã đơn vị</TableHead>
              <TableHead className="font-semibold text-foreground/70">Mô tả</TableHead>
              <TableHead className="font-semibold text-foreground/70 w-44">Ngày tạo</TableHead>
              <TableHead className="font-semibold text-foreground/70 w-36">Người tạo</TableHead>
              <TableHead className="font-semibold text-foreground/70 w-24">Trạng thái</TableHead>
              <TableHead className="font-semibold text-foreground/70 text-center w-32">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUnits.length > 0 ? (
              paginatedUnits.map((unit) => (
                <TableRow key={unit.id} className="border-border transition-colors">
                  <TableCell className="py-3">
                    <Checkbox 
                      checked={selectedIds.has(unit.id)}
                      onCheckedChange={() => toggleSelect(unit.id)}
                    />
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1" style={{ paddingLeft: `${unit.level * 24}px` }}>
                      {hasChildren(unit.id, filteredUnits) ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleExpand(unit.id)}
                        >
                          {expandedIds.has(unit.id) ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      ) : (
                        <span className="w-6" />
                      )}
                      <span className="font-medium text-foreground">{unit.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-sm text-muted-foreground font-mono">{unit.code}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-sm text-muted-foreground">{unit.description}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-sm text-muted-foreground">{formatDate(unit.createdAt)}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-sm text-muted-foreground">{unit.createdBy}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <Switch
                      checked={unit.status === "active"}
                      onCheckedChange={() => handleToggleStatus(unit)}
                    />
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        onClick={() => handleAddChild(unit)}
                        title="Thêm đơn vị con"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        onClick={() => handleEdit(unit)}
                        title="Chỉnh sửa"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(unit)}
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
          Hiển thị {paginatedUnits.length} trên tổng số {displayUnits.length} kết quả
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
            <ChevronRightIcon className="h-4 w-4" />
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
        <SheetContent className="w-full sm:max-w-lg overflow-hidden flex flex-col p-0">
          {/* Header */}
          <div className="px-6 py-4 border-b bg-muted/30">
            <SheetHeader>
              <SheetTitle className="text-xl">
                {panelMode === "create" ? "Thêm đơn vị mới" : 
                 panelMode === "edit" ? "Chỉnh sửa đơn vị" : 
                 `Chi tiết: ${selectedUnit?.name}`}
              </SheetTitle>
              <SheetDescription>
                {panelMode === "view" 
                  ? "Xem thông tin chi tiết đơn vị"
                  : "Nhập thông tin đơn vị"
                }
              </SheetDescription>
            </SheetHeader>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-auto px-6 py-4 space-y-4">
            {/* Tên đơn vị */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm">Tên đơn vị <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Nhập tên đơn vị..."
                disabled={panelMode === "view"}
              />
            </div>

            {/* Mã đơn vị */}
            <div className="space-y-1.5">
              <Label htmlFor="code" className="text-sm">Mã đơn vị</Label>
              <Input
                id="code"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                placeholder="Tự động sinh nếu để trống..."
                disabled={panelMode === "view"}
              />
            </div>

            {/* Đơn vị cha */}
            <div className="space-y-1.5">
              <Label className="text-sm">Đơn vị cha</Label>
              <Select 
                value={formParentId} 
                onValueChange={setFormParentId}
                disabled={panelMode === "view"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn đơn vị cha..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Không có (Đơn vị gốc) —</SelectItem>
                  {getParentOptions(units, selectedUnit?.id).map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mô tả */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-sm">Mô tả</Label>
              <Textarea
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Nhập mô tả đơn vị..."
                disabled={panelMode === "view"}
                rows={3}
              />
            </div>

            {/* Trạng thái */}
            <div className="flex items-center justify-between py-2">
              <Label className="text-sm">Trạng thái hoạt động</Label>
              <Switch
                checked={formStatus === "active"}
                onCheckedChange={(checked) => setFormStatus(checked ? "active" : "inactive")}
                disabled={panelMode === "view"}
              />
            </div>

            {/* View mode: Additional info */}
            {panelMode === "view" && selectedUnit && (
              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ngày tạo:</span>
                  <span>{selectedUnit.createdAt}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Người tạo:</span>
                  <span>{selectedUnit.createdBy}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Đơn vị cha:</span>
                  <span>{getParentName(selectedUnit.parentId)}</span>
                </div>
              </div>
            )}
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
