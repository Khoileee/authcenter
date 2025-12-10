import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { DataPermissionRule, ABACCondition } from "../CreateProfileDialog";

interface AddDataPermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (rule: DataPermissionRule) => void;
  initialData: DataPermissionRule | null;
}

// Mock resources
const mockResources = [
  { id: "res_1", name: "Tickets", attributes: ["owner_unit", "responsible_unit", "created_by", "status"] },
  { id: "res_2", name: "DQ_Rules", attributes: ["owner_unit", "created_by", "rule_type"] },
  { id: "res_3", name: "Features", attributes: ["owner_unit", "feature_group", "status"] },
];

// Mock actions per resource
const mockActions = [
  { code: "view", name: "Xem chi tiết" },
  { code: "list", name: "Xem danh sách" },
  { code: "update", name: "Cập nhật" },
  { code: "delete", name: "Xóa" },
  { code: "export", name: "Xuất dữ liệu" },
];

export function AddDataPermissionDialog({ open, onOpenChange, onSave, initialData }: AddDataPermissionDialogProps) {
  const [resourceId, setResourceId] = useState("");
  const [applyScope, setApplyScope] = useState<"all" | "conditions">("all");
  const [conditions, setConditions] = useState<ABACCondition[]>([]);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setResourceId(initialData.resourceId);
      setApplyScope(initialData.applyScope);
      setConditions(initialData.conditions);
      setSelectedActions(initialData.actions);
    } else {
      setResourceId("");
      setApplyScope("all");
      setConditions([]);
      setSelectedActions([]);
    }
  }, [initialData, open]);

  const selectedResource = mockResources.find((r) => r.id === resourceId);

  const addCondition = () => {
    const newCondition: ABACCondition = {
      id: `cond-${Date.now()}`,
      attribute: "",
      operator: "equals",
      value: "",
    };
    setConditions([...conditions, newCondition]);
  };

  const updateCondition = (id: string, updates: Partial<ABACCondition>) => {
    setConditions(conditions.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter((c) => c.id !== id));
  };

  const toggleAction = (code: string) => {
    if (selectedActions.includes(code)) {
      setSelectedActions(selectedActions.filter((a) => a !== code));
    } else {
      setSelectedActions([...selectedActions, code]);
    }
  };

  const handleSave = () => {
    if (!resourceId || selectedActions.length === 0) return;

    const rule: DataPermissionRule = {
      id: initialData?.id || `rule-${Date.now()}`,
      resourceId,
      resourceName: selectedResource?.name || "",
      applyScope,
      conditions: applyScope === "conditions" ? conditions : [],
      actions: selectedActions,
    };

    onSave(rule);
  };

  const isValid = resourceId && selectedActions.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Sửa quyền dữ liệu" : "Thêm quyền dữ liệu"}</DialogTitle>
          <DialogDescription>
            Cấu hình quyền truy cập dữ liệu với điều kiện ABAC
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* (A) Chọn Tài nguyên */}
          <Card className="p-4">
            <h4 className="font-semibold mb-3">Chọn tài nguyên</h4>
            <Select value={resourceId} onValueChange={setResourceId}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Chọn resource" />
              </SelectTrigger>
              <SelectContent>
                {mockResources.map((res) => (
                  <SelectItem key={res.id} value={res.id}>
                    {res.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          {/* (B) Chọn phạm vi áp dụng */}
          {resourceId && (
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Chọn phạm vi áp dụng</h4>
              <RadioGroup value={applyScope} onValueChange={(val) => setApplyScope(val as "all" | "conditions")}>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="all" id="scope-all" />
                  <Label htmlFor="scope-all">Toàn bộ tài nguyên</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="conditions" id="scope-conditions" />
                  <Label htmlFor="scope-conditions">
                    Tài nguyên phải thỏa mãn <strong>TẤT CẢ</strong> các điều kiện sau
                  </Label>
                </div>
              </RadioGroup>

              {/* ABAC Conditions */}
              {applyScope === "conditions" && (
                <div className="mt-4 space-y-3">
                  {conditions.length > 0 && (
                    <div className="overflow-x-auto border rounded-lg">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="p-2 text-left font-medium">Thuộc tính</th>
                            <th className="p-2 text-left font-medium">Toán tử</th>
                            <th className="p-2 text-left font-medium">Giá trị</th>
                            <th className="p-2 text-center font-medium w-16">Xóa</th>
                          </tr>
                        </thead>
                        <tbody>
                          {conditions.map((cond) => (
                            <tr key={cond.id} className="border-t">
                              <td className="p-2">
                                <Select
                                  value={cond.attribute}
                                  onValueChange={(val) => updateCondition(cond.id, { attribute: val })}
                                >
                                  <SelectTrigger className="h-8 text-xs bg-background">
                                    <SelectValue placeholder="Thuộc tính" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {selectedResource?.attributes.map((attr) => (
                                      <SelectItem key={attr} value={attr}>
                                        {attr}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="p-2">
                                <Select
                                  value={cond.operator}
                                  onValueChange={(val) => updateCondition(cond.id, { operator: val })}
                                >
                                  <SelectTrigger className="h-8 text-xs bg-background">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="equals">=</SelectItem>
                                    <SelectItem value="not_equals">≠</SelectItem>
                                    <SelectItem value="in">IN</SelectItem>
                                    <SelectItem value="greater">&gt;</SelectItem>
                                    <SelectItem value="less">&lt;</SelectItem>
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="p-2">
                                <Input
                                  value={cond.value}
                                  onChange={(e) => updateCondition(cond.id, { value: e.target.value })}
                                  placeholder="Giá trị"
                                  className="h-8 text-xs"
                                />
                              </td>
                              <td className="p-2 text-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => removeCondition(cond.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
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
                </div>
              )}
            </Card>
          )}

          {/* (C) Chọn hành động */}
          {resourceId && (
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Chọn hành động</h4>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-3 text-center font-medium w-20">Chọn</th>
                      <th className="p-3 text-left font-medium">Action</th>
                      <th className="p-3 text-left font-medium">Tên hiển thị</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockActions.map((action) => (
                      <tr
                        key={action.code}
                        className="border-t hover:bg-muted/30 cursor-pointer"
                        onClick={() => toggleAction(action.code)}
                      >
                        <td className="p-3 text-center">
                          <Checkbox
                            checked={selectedActions.includes(action.code)}
                            onCheckedChange={() => toggleAction(action.code)}
                          />
                        </td>
                        <td className="p-3">
                          <span className="font-mono text-xs text-primary">{action.code}</span>
                        </td>
                        <td className="p-3">{action.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                ⚠️ Không cho tạo action mới. Chỉ chọn từ danh sách có sẵn.
              </div>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            Lưu quyền dữ liệu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
