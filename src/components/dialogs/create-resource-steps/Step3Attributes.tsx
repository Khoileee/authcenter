import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface AttributeConfig {
  id: string;
  columnName: string;
  displayName: string;
  dataType: string;
  useForPermission: boolean;
  specialRole: string;
}

export interface Step3Data {
  attributes: AttributeConfig[];
}

interface Step3AttributesProps {
  data: Step3Data;
  onChange: (data: Partial<Step3Data>) => void;
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

export function Step3Attributes({ data, onChange }: Step3AttributesProps) {
  // Initialize attributes nếu chưa có
  if (data.attributes.length === 0 && mockColumns.length > 0) {
    const initialAttributes: AttributeConfig[] = mockColumns.map((col, idx) => ({
      id: `attr-${idx}`,
      columnName: col.name,
      displayName: col.name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      dataType: col.type,
      useForPermission: false,
      specialRole: "none",
    }));
    onChange({ attributes: initialAttributes });
  }

  const updateAttribute = (id: string, updates: Partial<AttributeConfig>) => {
    const updatedAttributes = data.attributes.map((attr) =>
      attr.id === id ? { ...attr, ...updates } : attr
    );
    onChange({ attributes: updatedAttributes });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Bước 3: Thuộc tính dùng cho phân quyền</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Cấu hình các cột từ bảng dữ liệu để sử dụng làm điều kiện phân quyền (ABAC)
        </p>
      </div>

      {data.attributes.length === 0 ? (
        <div className="p-6 bg-muted/50 rounded-lg border border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            ℹ️ Không có cột nào từ bảng dữ liệu. Bước này sẽ được bỏ qua nếu bạn không chọn database ở Bước 2.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-3 text-left font-medium">Cột DB</th>
                  <th className="p-3 text-left font-medium">Kiểu dữ liệu</th>
                  <th className="p-3 text-left font-medium">Tên hiển thị</th>
                  <th className="p-3 text-center font-medium">Dùng cho<br/>phân quyền?</th>
                  <th className="p-3 text-left font-medium">Vai trò đặc biệt</th>
                </tr>
              </thead>
              <tbody>
                {data.attributes.map((attr) => (
                  <tr key={attr.id} className="border-t hover:bg-muted/30">
                    {/* Cột DB - read only */}
                    <td className="p-3">
                      <span className="font-mono text-xs text-muted-foreground">
                        {attr.columnName}
                      </span>
                    </td>

                    {/* Kiểu dữ liệu - read only */}
                    <td className="p-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                        {attr.dataType}
                      </span>
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

                    {/* Vai trò đặc biệt */}
                    <td className="p-3">
                      <Select
                        value={attr.specialRole}
                        onValueChange={(value) => updateAttribute(attr.id, { specialRole: value })}
                        disabled={!attr.useForPermission}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">(none)</SelectItem>
                          <SelectItem value="owner_unit_field">owner_unit_field</SelectItem>
                          <SelectItem value="responsible_unit_field">responsible_unit_field</SelectItem>
                          <SelectItem value="created_by_field">created_by_field</SelectItem>
                          <SelectItem value="value_field">value_field</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground italic">
            💡 Tip: Chỉ tick "Dùng cho phân quyền" cho những cột thực sự cần thiết để tránh phức tạp hóa quá trình cấu hình sau này.
          </p>
        </div>
      )}
    </div>
  );
}
