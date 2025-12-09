import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export interface AttributeConfig {
  id: string;
  columnName: string;
  displayName: string;
  dataType: string;
  useForPermission: boolean;
}

export interface Step2CombinedData {
  datasource: string;
  table: string;
  attributes: AttributeConfig[];
}

interface Step2DataSourceAttributesProps {
  data: Step2CombinedData;
  onChange: (data: Partial<Step2CombinedData>) => void;
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

export function Step2DataSourceAttributes({ data, onChange }: Step2DataSourceAttributesProps) {
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
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <h3 className="text-lg font-semibold">Bước 2: Nguồn dữ liệu & Thuộc tính</h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">
                Cấu hình ánh xạ tài nguyên với bảng trong database và chọn các cột để sử dụng làm điều kiện phân quyền (ABAC)
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Datasource */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="datasource">
            Datasource / Kết nối DB <span className="text-destructive">*</span>
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Chọn từ danh sách kết nối hệ thống đã cấu hình</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Select value={data.datasource} onValueChange={(value) => onChange({ datasource: value })}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Chọn kết nối database" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fintech_dw">FintechDW (Data Warehouse)</SelectItem>
            <SelectItem value="operational_db">OperationalDB (Production)</SelectItem>
            <SelectItem value="dq_repository">DQ_Repository</SelectItem>
            <SelectItem value="ticket_db">TicketDB</SelectItem>
            <SelectItem value="admin_db">AdminDB</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tên bảng */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="table">
            Tên bảng / View <span className="text-destructive">*</span>
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Chọn bảng hoặc view từ datasource</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Select 
          value={data.table} 
          onValueChange={handleTableChange}
          disabled={!data.datasource}
        >
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Chọn bảng hoặc view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="features">features</SelectItem>
            <SelectItem value="dashboards">dashboards</SelectItem>
            <SelectItem value="tickets">tickets</SelectItem>
            <SelectItem value="data_quality_rules">data_quality_rules</SelectItem>
            <SelectItem value="reports">reports</SelectItem>
          </SelectContent>
        </Select>
        {!data.datasource && (
          <p className="text-xs text-muted-foreground text-amber-600">
            Vui lòng chọn datasource trước
          </p>
        )}
      </div>

      {/* Bảng thuộc tính */}
      {data.attributes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5">
            <Label className="text-base font-semibold">Thuộc tính của bảng</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">
                  💡 Tip: Chỉ tick "Dùng cho phân quyền" cho những cột thực sự cần thiết để tránh phức tạp hóa quá trình cấu hình sau này.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-3 text-left font-medium">Tên trường</th>
                  <th className="p-3 text-left font-medium">Kiểu dữ liệu</th>
                  <th className="p-3 text-left font-medium">Tên hiển thị</th>
                  <th className="p-3 text-center font-medium">
                    Dùng cho<br/>phân quyền?
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.attributes.map((attr) => (
                  <tr key={attr.id} className="border-t hover:bg-muted/30">
                    {/* Tên trường - read only */}
                    <td className="p-3">
                      <span className="font-mono text-xs text-muted-foreground">
                        {attr.columnName}
                      </span>
                    </td>

                    {/* Kiểu dữ liệu - combobox */}
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

                    {/* Tên hiển thị - editable */}
                    <td className="p-3">
                      <Input
                        value={attr.displayName}
                        onChange={(e) => updateAttribute(attr.id, { displayName: e.target.value })}
                        className="h-8 text-xs"
                      />
                    </td>

                    {/* Dùng cho phân quyền - checkbox */}
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
      )}

      {!data.table && data.datasource && (
        <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
          <p className="text-sm text-muted-foreground">
            ℹ️ Vui lòng chọn bảng để hiển thị danh sách thuộc tính
          </p>
        </div>
      )}
    </div>
  );
}
