import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface AttributeConfig {
  id: string;
  columnName: string;
  displayName: string;
  dataType: string;
  useForPermission: boolean;
}

export interface ActionConfig {
  code: string;
  name: string;
  description: string;
}

export interface ResourceFormData {
  resourceName: string;
  description: string;
  datasource: string;
  schema: string;
  table: string;
  attributes: AttributeConfig[];
}

interface CreateResourceFormProps {
  data: ResourceFormData;
  onChange: (data: Partial<ResourceFormData>) => void;
}

// Mock data - giả lập danh sách cột từ DB
const mockColumns = [
  { name: "feature_id", type: "number" },
  { name: "feature_code", type: "text" },
  { name: "feature_name", type: "text" },
  { name: "owner_unit", type: "text" },
  { name: "responsible_unit", type: "text" },
  { name: "created_by", type: "text" },
  { name: "status", type: "text" },
  { name: "created_at", type: "datetime" },
  { name: "updated_at", type: "datetime" },
];

const dataTypes = [
  "text",
  "number",
  "bigint",
  "decimal",
  "boolean",
  "datetime",
  "date",
  "time",
  "json",
  "uuid",
];

// Mock actions - load từ hệ thống
const systemActions: ActionConfig[] = [
  { code: "view", name: "Xem chi tiết", description: "Quyền xem thông tin chi tiết" },
  { code: "list", name: "Xem danh sách", description: "Quyền xem danh sách và tìm kiếm" },
  { code: "create", name: "Tạo mới", description: "Quyền tạo bản ghi mới" },
  { code: "update", name: "Cập nhật", description: "Quyền chỉnh sửa thông tin" },
  { code: "delete", name: "Xóa", description: "Quyền xóa bản ghi" },
  { code: "approve", name: "Phê duyệt", description: "Quyền phê duyệt hoặc từ chối" },
  { code: "upload", name: "Upload", description: "Quyền upload file/metadata" },
  { code: "download", name: "Download", description: "Quyền tải xuống" },
  { code: "export", name: "Export", description: "Quyền xuất dữ liệu" },
];

export function CreateResourceForm({ data, onChange }: CreateResourceFormProps) {
  // Initialize attributes khi chọn table
  const handleTableChange = (table: string) => {
    onChange({ table });
    
    // Load attributes từ table
    if (table && data.attributes.length === 0) {
      const initialAttributes: AttributeConfig[] = mockColumns.map((col, idx) => ({
        id: `attr-${idx}`,
        columnName: col.name,
        displayName: col.name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        dataType: col.type,
        useForPermission: false,
      }));
      onChange({ attributes: initialAttributes });
    }
  };

  const updateAttribute = (id: string, updates: Partial<AttributeConfig>) => {
    const updatedAttributes = data.attributes.map((attr) =>
      attr.id === id ? { ...attr, ...updates } : attr
    );
    onChange({ attributes: updatedAttributes });
  };

  return (
    <div className="space-y-8">
      {/* Bước 1 — Thông tin tài nguyên */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold">1. Thông tin tài nguyên</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">
                  Thông tin cơ bản để định danh và mô tả tài nguyên
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="space-y-4">
            {/* Tên tài nguyên */}
            <div className="space-y-2">
              <Label htmlFor="resourceName">
                Tên tài nguyên <span className="text-destructive">*</span>
              </Label>
              <Input
                id="resourceName"
                value={data.resourceName}
                onChange={(e) => onChange({ resourceName: e.target.value })}
                placeholder="Ví dụ: Danh sách ticket eTicket"
                className="bg-background"
              />
            </div>

            {/* Mô tả */}
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={(e) => onChange({ description: e.target.value })}
                placeholder="Ví dụ: Danh sách ticket trong hệ thống eTicket – dùng để phân quyền theo đơn vị sở hữu, người tạo, đơn vị phụ trách..."
                className="bg-background resize-none"
                rows={3}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Bước 2 — Chọn nguồn dữ liệu */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold">2. Chọn nguồn dữ liệu</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">
                  Chọn database và bảng dữ liệu cần ánh xạ làm tài nguyên
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Datasource */}
            <div className="space-y-2">
              <Label htmlFor="datasource">
                Datasource <span className="text-destructive">*</span>
              </Label>
              <Select value={data.datasource} onValueChange={(value) => onChange({ datasource: value })}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Chọn kết nối DB" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fintech_dw">FintechDW</SelectItem>
                  <SelectItem value="operational_db">OperationalDB</SelectItem>
                  <SelectItem value="dq_repository">DQ_Repository</SelectItem>
                  <SelectItem value="ticket_db">TicketDB</SelectItem>
                  <SelectItem value="admin_db">AdminDB</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Schema */}
            <div className="space-y-2">
              <Label htmlFor="schema">
                Schema <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={data.schema} 
                onValueChange={(value) => onChange({ schema: value })}
                disabled={!data.datasource}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Chọn schema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dbo">dbo</SelectItem>
                  <SelectItem value="system">system</SelectItem>
                  <SelectItem value="dm">dm</SelectItem>
                  <SelectItem value="ods">ods</SelectItem>
                  <SelectItem value="staging">staging</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="space-y-2">
              <Label htmlFor="table">
                Tên bảng / View <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={data.table} 
                onValueChange={handleTableChange}
                disabled={!data.schema}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Chọn bảng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="features">features</SelectItem>
                  <SelectItem value="dashboards">dashboards</SelectItem>
                  <SelectItem value="tickets">tickets</SelectItem>
                  <SelectItem value="data_quality_rules">data_quality_rules</SelectItem>
                  <SelectItem value="reports">reports</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Bước 3 — Thuộc tính phân quyền */}
      {data.attributes.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold">3. Thuộc tính phân quyền (Mapping cột)</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">
                    Chọn các cột sử dụng làm điều kiện phân quyền ABAC
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-3 text-left font-medium">Tên cột (DB)</th>
                    <th className="p-3 text-left font-medium">Kiểu dữ liệu</th>
                    <th className="p-3 text-left font-medium">Tên hiển thị</th>
                    <th className="p-3 text-center font-medium">Dùng cho<br/>phân quyền?</th>
                  </tr>
                </thead>
                <tbody>
                  {data.attributes.map((attr) => (
                    <tr key={attr.id} className="border-t hover:bg-muted/30">
                      <td className="p-3">
                        <span className="font-mono text-xs text-muted-foreground">
                          {attr.columnName}
                        </span>
                      </td>

                      <td className="p-3">
                        <Select
                          value={attr.dataType}
                          onValueChange={(value) => updateAttribute(attr.id, { dataType: value })}
                        >
                          <SelectTrigger className="h-8 text-xs w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {dataTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>

                      <td className="p-3">
                        <Input
                          value={attr.displayName}
                          onChange={(e) => updateAttribute(attr.id, { displayName: e.target.value })}
                          className="h-8 text-xs"
                        />
                      </td>

                      <td className="p-3 text-center">
                        <Checkbox
                          checked={attr.useForPermission}
                          onCheckedChange={(checked) =>
                            updateAttribute(attr.id, { useForPermission: !!checked })
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
