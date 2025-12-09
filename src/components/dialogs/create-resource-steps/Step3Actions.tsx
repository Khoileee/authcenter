import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

export interface ActionConfig {
  id: string;
  code: string;
  name: string;
  description: string;
  isStandard: boolean;
}

export interface Step3Data {
  actions: ActionConfig[];
}

interface Step3ActionsProps {
  data: Step3Data;
  onChange: (data: Partial<Step3Data>) => void;
}

// Standard actions gợi ý
const standardActions = [
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

export function Step3Actions({ data, onChange }: Step3ActionsProps) {
  const [customAction, setCustomAction] = useState({ code: "", name: "", description: "" });

  const toggleStandardAction = (actionCode: string) => {
    const exists = data.actions.find((a) => a.code === actionCode);
    if (exists) {
      // Remove
      onChange({
        actions: data.actions.filter((a) => a.code !== actionCode),
      });
    } else {
      // Add
      const standard = standardActions.find((a) => a.code === actionCode);
      if (standard) {
        onChange({
          actions: [
            ...data.actions,
            {
              id: `action-${Date.now()}-${actionCode}`,
              code: standard.code,
              name: standard.name,
              description: standard.description,
              isStandard: true,
            },
          ],
        });
      }
    }
  };

  const addCustomAction = () => {
    if (!customAction.code || !customAction.name) {
      return;
    }

    const newAction: ActionConfig = {
      id: `action-${Date.now()}-custom`,
      code: customAction.code.toLowerCase().replace(/[^a-z0-9_]/g, ""),
      name: customAction.name,
      description: customAction.description,
      isStandard: false,
    };

    onChange({
      actions: [...data.actions, newAction],
    });

    setCustomAction({ code: "", name: "", description: "" });
  };

  const removeAction = (id: string) => {
    onChange({
      actions: data.actions.filter((a) => a.id !== id),
    });
  };

  const updateAction = (id: string, updates: Partial<ActionConfig>) => {
    onChange({
      actions: data.actions.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <h3 className="text-lg font-semibold">Bước 3: Hành động hỗ trợ</h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">
                Chọn các hành động (actions) mà tài nguyên này hỗ trợ. Mỗi action sẽ được dùng để cấu hình phân quyền chi tiết.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Standard Actions */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <Label className="text-base font-semibold">Hành động chuẩn</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Chọn các hành động phổ biến từ danh sách dưới đây</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {standardActions.map((action) => {
            const isSelected = data.actions.some((a) => a.code === action.code);
            return (
              <div
                key={action.code}
                className={`flex items-start space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary/5 border-primary"
                    : "bg-background border-border hover:bg-muted/50"
                }`}
                onClick={() => toggleStandardAction(action.code)}
              >
                <Checkbox checked={isSelected} className="mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-primary">{action.code}</span>
                    <span className="font-medium text-sm">{action.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Actions */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <Label className="text-base font-semibold">Hành động tùy chỉnh</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Thêm các hành động đặc thù cho tài nguyên này</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="p-4 bg-muted/30 rounded-lg border space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="customCode" className="text-xs">
                Action code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="customCode"
                placeholder="Ví dụ: assign, review"
                value={customAction.code}
                onChange={(e) =>
                  setCustomAction({
                    ...customAction,
                    code: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                  })
                }
                className="font-mono text-sm h-9"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customName" className="text-xs">
                Tên hiển thị <span className="text-destructive">*</span>
              </Label>
              <Input
                id="customName"
                placeholder="Ví dụ: Gán nhiệm vụ"
                value={customAction.name}
                onChange={(e) => setCustomAction({ ...customAction, name: e.target.value })}
                className="h-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customDesc" className="text-xs">
              Mô tả
            </Label>
            <Textarea
              id="customDesc"
              placeholder="Mô tả chi tiết về hành động này..."
              value={customAction.description}
              onChange={(e) => setCustomAction({ ...customAction, description: e.target.value })}
              className="resize-none"
              rows={2}
            />
          </div>

          <Button
            type="button"
            onClick={addCustomAction}
            size="sm"
            disabled={!customAction.code || !customAction.name}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm hành động
          </Button>
        </div>

        {/* List of custom actions */}
        {data.actions.filter((a) => !a.isStandard).length > 0 && (
          <div className="space-y-2 mt-4">
            <Label className="text-sm">Hành động đã thêm:</Label>
            <div className="space-y-2">
              {data.actions
                .filter((a) => !a.isStandard)
                .map((action) => (
                  <div
                    key={action.id}
                    className="flex items-center gap-3 p-3 bg-background rounded-lg border"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-primary">{action.code}</span>
                        <span className="font-medium text-sm">{action.name}</span>
                      </div>
                      {action.description && (
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAction(action.id)}
                      className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium">
              Tổng số hành động đã chọn: <span className="text-primary">{data.actions.length}</span>
            </p>
            {data.actions.length === 0 && (
              <p className="text-xs text-destructive mt-1">
                ⚠️ Bạn phải chọn ít nhất 1 hành động để tiếp tục
              </p>
            )}
            {data.actions.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                ✓ Bạn có thể hoàn tất và tạo tài nguyên
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
