import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Trash2, Info, X } from "lucide-react";

interface ABACCondition {
  id: string;
  attribute: string;
  operator: string;
  value: string;
}

interface DataPermissionRule {
  id: string;
  resourceId: string;
  resourceName: string;
  applyScope: "all" | "conditions";
  conditions: ABACCondition[];
  actions: string[];
}

interface UserDataPermissionsProps {
  systemId: string;
  dataPermissions: any[];
  onChange: (dataPermissions: any[]) => void;
}

// Mock resources per system
const mockResourcesBySystem: Record<string, any[]> = {
  ticket: [
    { id: "res_ticket_1", name: "Tickets", attributes: ["owner_unit", "responsible_unit", "created_by", "status", "priority"] },
    { id: "res_ticket_2", name: "Ticket_Comments", attributes: ["created_by", "ticket_id"] },
  ],
  dq: [
    { id: "res_dq_1", name: "DQ_Rules", attributes: ["owner_unit", "created_by", "rule_type", "status"] },
    { id: "res_dq_2", name: "DQ_Results", attributes: ["rule_id", "execution_date", "status"] },
  ],
  bi: [
    { id: "res_bi_1", name: "Dashboards", attributes: ["owner_unit", "created_by", "category", "is_public"] },
    { id: "res_bi_2", name: "Reports", attributes: ["owner_unit", "created_by", "report_type"] },
  ],
  admin: [
    { id: "res_admin_1", name: "Users", attributes: ["unit", "role", "status"] },
    { id: "res_admin_2", name: "Roles", attributes: ["system", "level"] },
  ],
  sqlwf: [
    { id: "res_sql_1", name: "Queries", attributes: ["created_by", "database", "query_type"] },
  ],
  dashboard: [
    { id: "res_dash_1", name: "Visualizations", attributes: ["owner_unit", "created_by", "chart_type"] },
  ],
};

// Mock actions
const mockActions = [
  { code: "view", name: "Xem" },
  { code: "update", name: "Sửa" },
  { code: "delete", name: "Xóa" },
];

export function UserDataPermissions({ systemId, dataPermissions, onChange }: UserDataPermissionsProps) {
  const resources = mockResourcesBySystem[systemId] || [];

  const addRule = () => {
    const newRule: DataPermissionRule = {
      id: `rule-${Date.now()}`,
      resourceId: "",
      resourceName: "",
      applyScope: "all",
      conditions: [],
      actions: [],
    };
    onChange([...dataPermissions, newRule]);
  };

  const updateRule = (id: string, updates: Partial<DataPermissionRule>) => {
    const updatedRules = dataPermissions.map((rule) =>
      rule.id === id ? { ...rule, ...updates } : rule
    );
    onChange(updatedRules);
  };

  const removeRule = (id: string) => {
    onChange(dataPermissions.filter((r) => r.id !== id));
  };

  const addConditionToRule = (ruleId: string) => {
    const rule = dataPermissions.find((r) => r.id === ruleId);
    if (!rule) return;

    const newCondition: ABACCondition = {
      id: `cond-${Date.now()}`,
      attribute: "",
      operator: "equals",
      value: "",
    };
    updateRule(ruleId, { conditions: [...rule.conditions, newCondition] });
  };

  const updateCondition = (ruleId: string, condId: string, updates: Partial<ABACCondition>) => {
    const rule = dataPermissions.find((r) => r.id === ruleId);
    if (!rule) return;

    const updatedConditions = rule.conditions.map((c) =>
      c.id === condId ? { ...c, ...updates } : c
    );
    updateRule(ruleId, { conditions: updatedConditions });
  };

  const removeCondition = (ruleId: string, condId: string) => {
    const rule = dataPermissions.find((r) => r.id === ruleId);
    if (!rule) return;

    updateRule(ruleId, { conditions: rule.conditions.filter((c) => c.id !== condId) });
  };

  const toggleAction = (ruleId: string, actionCode: string) => {
    const rule = dataPermissions.find((r) => r.id === ruleId);
    if (!rule) return;

    const actions = rule.actions.includes(actionCode)
      ? rule.actions.filter((a) => a !== actionCode)
      : [...rule.actions, actionCode];

    updateRule(ruleId, { actions });
  };

  const getResourceById = (id: string) => resources.find((r) => r.id === id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">Quyền dữ liệu (Resource ABAC)</h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs max-w-xs">
              Cấu hình quyền truy cập dữ liệu với điều kiện ABAC cho từng tài nguyên
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Danh sách khối quy tắc */}
      <div className="space-y-4">
        {dataPermissions.map((rule, index) => {
          const selectedResource = getResourceById(rule.resourceId);

          return (
            <Card key={rule.id} className="p-4 border-2 border-muted">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Khối Quy tắc {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => removeRule(rule.id)}
                  title="Xóa"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Loại tài nguyên + Phạm vi áp dụng */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor={`resource-${rule.id}`}>Loại tài nguyên</Label>
                  <Select
                    value={rule.resourceId}
                    onValueChange={(value) => {
                      const resource = getResourceById(value);
                      updateRule(rule.id, {
                        resourceId: value,
                        resourceName: resource?.name || "",
                      });
                    }}
                  >
                    <SelectTrigger className="bg-background mt-2">
                      <SelectValue placeholder="Chọn tài nguyên" />
                    </SelectTrigger>
                    <SelectContent>
                      {resources.map((res) => (
                        <SelectItem key={res.id} value={res.id}>
                          {res.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`scope-${rule.id}`}>Phạm vi áp dụng</Label>
                  <Select
                    value={rule.applyScope}
                    onValueChange={(val) => updateRule(rule.id, { applyScope: val as "all" | "conditions" })}
                  >
                    <SelectTrigger className="bg-background mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toàn bộ tài nguyên</SelectItem>
                      <SelectItem value="conditions">Tài nguyên phải thỏa mãn TẤT CẢ các điều kiện sau</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Điều kiện ABAC */}
              {rule.applyScope === "conditions" && (
                <div className="mb-4">
                  <Label className="mb-2 block">Điều kiện ABAC</Label>
                  {selectedResource ? (
                    <>
                      {rule.conditions.length > 0 && (
                        <div className="overflow-x-auto border rounded-lg mb-3">
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
                              {rule.conditions.map((cond) => (
                                <tr key={cond.id} className="border-t">
                                  <td className="p-2">
                                    <Select
                                      value={cond.attribute}
                                      onValueChange={(val) =>
                                        updateCondition(rule.id, cond.id, { attribute: val })
                                      }
                                    >
                                      <SelectTrigger className="h-8 text-xs bg-background">
                                        <SelectValue placeholder="Thuộc tính" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {selectedResource.attributes.map((attr) => (
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
                                      onValueChange={(val) =>
                                        updateCondition(rule.id, cond.id, { operator: val })
                                      }
                                    >
                                      <SelectTrigger className="h-8 text-xs bg-background">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="equals">bằng</SelectItem>
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
                                      onChange={(e) =>
                                        updateCondition(rule.id, cond.id, { value: e.target.value })
                                      }
                                      placeholder="Giá trị"
                                      className="h-8 text-xs"
                                    />
                                  </td>
                                  <td className="p-2 text-center">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                      onClick={() => removeCondition(rule.id, cond.id)}
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
                        onClick={() => addConditionToRule(rule.id)}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Thêm điều kiện
                      </Button>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                      Vui lòng chọn loại tài nguyên trước để cấu hình điều kiện ABAC
                    </div>
                  )}
                </div>
              )}

              {/* Hành động */}
              <div>
                <Label className="mb-2 block">Hành động</Label>
                <div className="flex gap-4">
                  {mockActions.map((action) => (
                    <div key={action.code} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${rule.id}-${action.code}`}
                        checked={rule.actions.includes(action.code)}
                        onCheckedChange={() => toggleAction(rule.id, action.code)}
                      />
                      <Label
                        htmlFor={`${rule.id}-${action.code}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {action.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addRule}
        className="w-full mt-4 gap-2"
      >
        <Plus className="h-4 w-4" />
        Thêm Khối Quy tắc
      </Button>
    </div>
  );
}
