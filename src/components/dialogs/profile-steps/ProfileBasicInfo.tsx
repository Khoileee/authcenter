import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Trash2, Info, X } from "lucide-react";
import { ProfileFormData, ProfileCondition } from "../CreateProfileDialog";

interface ProfileBasicInfoProps {
  data: ProfileFormData;
  onChange: (data: Partial<ProfileFormData>) => void;
}

export function ProfileBasicInfo({ data, onChange }: ProfileBasicInfoProps) {
  const addCondition = () => {
    const newCondition: ProfileCondition = {
      id: `cond-${Date.now()}`,
      attribute: "",
      operator: "equals",
      value: "",
    };
    onChange({ conditions: [...data.conditions, newCondition] });
  };

  const updateCondition = (id: string, updates: Partial<ProfileCondition>) => {
    const updatedConditions = data.conditions.map((cond) =>
      cond.id === id ? { ...cond, ...updates } : cond
    );
    onChange({ conditions: updatedConditions });
  };

  const removeCondition = (id: string) => {
    onChange({ conditions: data.conditions.filter((cond) => cond.id !== id) });
  };

  return (
    <div className="space-y-6">
      {/* Thông tin chung */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Thông tin chung</h3>
        <div className="space-y-4">
          {/* Tên profile */}
          <div className="space-y-2">
            <Label htmlFor="profileName">
              Tên profile <span className="text-destructive">*</span>
            </Label>
            <Input
              id="profileName"
              value={data.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="Ví dụ: BDA - TTPTDL"
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
              placeholder="Mô tả ngắn gọn về profile này..."
              className="bg-background resize-none"
              rows={3}
            />
          </div>

          {/* Trạng thái */}
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select value={data.status} onValueChange={(value) => onChange({ status: value })}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Điều kiện áp dụng */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold">Điều kiện áp dụng cho user</h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">
                Người dùng phải thỏa mãn <strong>TẤT CẢ</strong> các điều kiện sau để gán profile này (AND logic)
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Bảng điều kiện */}
        {data.conditions.length > 0 && (
          <div className="overflow-x-auto border rounded-lg mb-4 mt-4">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-3 text-left font-medium">Thuộc tính</th>
                  <th className="p-3 text-left font-medium">Toán tử</th>
                  <th className="p-3 text-left font-medium">Giá trị</th>
                  <th className="p-3 text-center font-medium w-20">Xóa</th>
                </tr>
              </thead>
              <tbody>
                {data.conditions.map((condition) => (
                  <tr key={condition.id} className="border-t">
                    <td className="p-3">
                      <Select
                        value={condition.attribute}
                        onValueChange={(value) => updateCondition(condition.id, { attribute: value })}
                      >
                        <SelectTrigger className="h-9 bg-background">
                          <SelectValue placeholder="Chọn thuộc tính" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unit">Đơn vị</SelectItem>
                          <SelectItem value="role">Vai trò</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-3">
                      <Select
                        value={condition.operator}
                        onValueChange={(value) => updateCondition(condition.id, { operator: value })}
                      >
                        <SelectTrigger className="h-9 bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equals">bằng</SelectItem>
                          <SelectItem value="in">trong danh sách</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-3">
                      {condition.attribute === "unit" && (
                        <Select
                          value={condition.value}
                          onValueChange={(value) => updateCondition(condition.id, { value })}
                        >
                          <SelectTrigger className="h-9 bg-background">
                            <SelectValue placeholder="Chọn đơn vị" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TTPTDL">TTPTDL</SelectItem>
                            <SelectItem value="IT">IT</SelectItem>
                            <SelectItem value="HR">HR</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      {condition.attribute === "role" && (
                        <Select
                          value={condition.value}
                          onValueChange={(value) => updateCondition(condition.id, { value })}
                        >
                          <SelectTrigger className="h-9 bg-background">
                            <SelectValue placeholder="Chọn vai trò" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="BDA">BDA</SelectItem>
                            <SelectItem value="Viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      {!condition.attribute && (
                        <Input
                          value={condition.value}
                          onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                          placeholder="Nhập giá trị"
                          className="h-9"
                          disabled
                        />
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeCondition(condition.id)}
                        title="Xóa"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addCondition}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Thêm điều kiện
        </Button>
      </Card>
    </div>
  );
}
