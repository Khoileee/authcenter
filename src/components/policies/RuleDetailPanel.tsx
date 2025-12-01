import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Trash2, Plus, Info } from "lucide-react";
import { useState } from "react";

interface Condition {
    id: string;
    attributeGroup: string;
    attributeName: string;
    operator: string;
    value: string;
}

interface RuleDetailPanelProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    rule?: {
        name: string;
        description: string;
        resource: string;
        actions: string[];
        subjectType: string;
        roles: string[];
        users: string[];
        conditions: Condition[];
        conditionLogic: string;
    } | null;
}

export function RuleDetailPanel({ open, onOpenChange, rule }: RuleDetailPanelProps) {
    const [ruleName, setRuleName] = useState(rule?.name || "");
    const [description, setDescription] = useState(rule?.description || "");
    const [status, setStatus] = useState("active");
    const [resource, setResource] = useState(rule?.resource || "transaction");
    const [selectedActions, setSelectedActions] = useState<string[]>(rule?.actions || []);
    const [subjectType, setSubjectType] = useState(rule?.subjectType || "role");
    const [conditions, setConditions] = useState<Condition[]>(rule?.conditions || []);
    const [conditionLogic, setConditionLogic] = useState(rule?.conditionLogic || "AND");

    const addCondition = () => {
        setConditions([
            ...conditions,
            {
                id: Date.now().toString(),
                attributeGroup: "transaction",
                attributeName: "",
                operator: "<=",
                value: "",
            },
        ]);
    };

    const removeCondition = (id: string) => {
        setConditions(conditions.filter((c) => c.id !== id));
    };

    const updateCondition = (id: string, field: keyof Condition, value: string) => {
        setConditions(conditions.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
    };

    const getAttributeOptions = (group: string) => {
        switch (group) {
            case "user":
                return ["user.unit", "user.team", "user.seniority", "user.location", "user.role", "user.branch"];
            case "resource":
                return [
                    "resource.owner_unit",
                    "resource.responsible_unit",
                    "resource.value",
                    "resource.sensitive_level",
                    "resource.status",
                    "resource.created_by",
                    "resource.branch"
                ];
            case "transaction":
                return ["transaction.amount", "transaction.currency", "transaction.branch", "transaction.channel", "transaction.country"];
            case "context":
                return ["request.time_of_day", "request.ip_country", "context.timestamp"];
            default:
                return [];
        }
    };

    const generateNaturalLanguage = () => {
        if (conditions.length === 0) return null;

        const conditionTexts = conditions.map(c =>
            `${c.attributeName} ${c.operator} ${c.value}`
        ).join(` ${conditionLogic} `);

        return `${subjectType === "role" ? "Roles" : "Users"} được ${selectedActions.join(", ")} ${resource} nếu ${conditionTexts}.`;
    };

    const handleSave = () => {
        console.log("Save rule:", {
            ruleName,
            description,
            status,
            resource,
            selectedActions,
            subjectType,
            conditions,
            conditionLogic,
        });
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="text-2xl">
                        {rule ? "Chỉnh sửa rule" : "Thêm rule mới"}
                    </SheetTitle>
                    <SheetDescription>
                        Cấu hình rule phân quyền với điều kiện ABAC chi tiết
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 py-6">
                    {/* Nhóm 1: Thông tin chung */}
                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Thông tin chung</h3>

                        <div className="space-y-2">
                            <Label htmlFor="ruleName">
                                Tên rule / policy <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="ruleName"
                                placeholder="Ví dụ: Txn dưới 10M – Teller hoặc Branch Manager duyệt"
                                value={ruleName}
                                onChange={(e) => setRuleName(e.target.value)}
                                className="bg-background"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Mô tả</Label>
                            <Textarea
                                id="description"
                                placeholder="Ví dụ: Áp dụng cho giao dịch dưới hoặc bằng 10 triệu, cho phép Teller duyệt nếu cùng chi nhánh..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="bg-background resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Trạng thái</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="bg-background">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Nhóm 2: Phạm vi (Resource + Action) */}
                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Phạm vi (Resource + Action)</h3>

                        <div className="space-y-2">
                            <Label htmlFor="resource">Resource</Label>
                            <Select value={resource} onValueChange={setResource}>
                                <SelectTrigger className="bg-background">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="transaction">transaction</SelectItem>
                                    <SelectItem value="table">table</SelectItem>
                                    <SelectItem value="sql_query">sql_query</SelectItem>
                                    <SelectItem value="job">job</SelectItem>
                                    <SelectItem value="feature">feature</SelectItem>
                                    <SelectItem value="dq_rule">dq_rule</SelectItem>
                                    <SelectItem value="dashboard">dashboard</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="actions">Actions</Label>
                            <Select>
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Chọn actions (có thể chọn nhiều)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="read">read</SelectItem>
                                    <SelectItem value="approve">approve</SelectItem>
                                    <SelectItem value="cancel">cancel</SelectItem>
                                    <SelectItem value="refund">refund</SelectItem>
                                    <SelectItem value="update">update</SelectItem>
                                    <SelectItem value="delete">delete</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Nhóm 3: Đối tượng & điều kiện ABAC */}
                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Đối tượng & điều kiện ABAC</h3>

                        {/* WHO */}
                        <div className="space-y-3">
                            <Label>Đối tượng chính (WHO)</Label>
                            <RadioGroup value={subjectType} onValueChange={setSubjectType}>
                                <div className="space-y-3">
                                    {/* Option 1: Role */}
                                    <div className="flex items-start space-x-3">
                                        <RadioGroupItem value="role" id="role-panel" className="mt-1" />
                                        <div className="flex-1 space-y-2">
                                            <Label htmlFor="role-panel" className="font-medium cursor-pointer">
                                                Áp dụng cho Role
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                Chọn các vai trò đã được khai báo ở menu "Vai trò"
                                            </p>
                                            {subjectType === "role" && (
                                                <Select>
                                                    <SelectTrigger className="bg-background">
                                                        <SelectValue placeholder="Chọn roles (có thể chọn nhiều)" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="admin">Admin</SelectItem>
                                                        <SelectItem value="bda">BDA</SelectItem>
                                                        <SelectItem value="teller">Teller</SelectItem>
                                                        <SelectItem value="branch_manager">Branch Manager</SelectItem>
                                                        <SelectItem value="risk_officer">Risk Officer</SelectItem>
                                                        <SelectItem value="senior_manager">Senior Manager</SelectItem>
                                                        <SelectItem value="viewer">Viewer</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </div>
                                    </div>

                                    {/* Option 2: User set động */}
                                    <div className="flex items-start space-x-3">
                                        <RadioGroupItem value="user_set" id="user-set-panel" className="mt-1" />
                                        <div className="flex-1 space-y-2">
                                            <Label htmlFor="user-set-panel" className="font-medium cursor-pointer">
                                                Áp dụng cho User set động
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                Chọn các dynamic role (user set) đã định nghĩa trước
                                            </p>
                                            {subjectType === "user_set" && (
                                                <Select>
                                                    <SelectTrigger className="bg-background">
                                                        <SelectValue placeholder="Chọn user set (có thể chọn nhiều)" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="ptdl_staff">Nhân viên PTDL</SelectItem>
                                                        <SelectItem value="senior_analysts">Senior Analysts</SelectItem>
                                                        <SelectItem value="hcm_branch">Chi nhánh HCM</SelectItem>
                                                        <SelectItem value="data_owners">Data Owners</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </div>
                                    </div>

                                    {/* Option 3: User cụ thể */}
                                    <div className="flex items-start space-x-3">
                                        <RadioGroupItem value="user" id="user-panel" className="mt-1" />
                                        <div className="flex-1 space-y-2">
                                            <Label htmlFor="user-panel" className="font-medium cursor-pointer">
                                                Áp dụng cho User cụ thể
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                Tuỳ chọn nâng cao. Khuyến nghị dùng ACL tab cho user đơn lẻ.
                                            </p>
                                            {subjectType === "user" && (
                                                <Select>
                                                    <SelectTrigger className="bg-background">
                                                        <SelectValue placeholder="Chọn users (có thể chọn nhiều)" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="khoiln1">khoiln1 – Lê Nhật Khôi</SelectItem>
                                                        <SelectItem value="annv">annv – An Nguyen</SelectItem>
                                                        <SelectItem value="minhtq">minhtq – Trần Quang Minh</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* ABAC Conditions */}
                        <div className="space-y-3 pt-4 border-t">
                            <div>
                                <Label>Điều kiện ABAC (Builder) – Định nghĩa Resource Set và User Set</Label>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Thêm điều kiện để xác định resource set (tài nguyên nào) và user set (người dùng nào) được áp dụng rule này
                                </p>
                            </div>

                            {conditions.length > 0 && (
                                <div className="space-y-2">
                                    {conditions.map((condition) => (
                                        <div key={condition.id} className="flex gap-2 items-start p-2 bg-background rounded-lg border">
                                            <div className="flex-1 grid grid-cols-4 gap-2">
                                                <Select
                                                    value={condition.attributeGroup}
                                                    onValueChange={(value) => updateCondition(condition.id, "attributeGroup", value)}
                                                >
                                                    <SelectTrigger className="h-9">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="user">User</SelectItem>
                                                        <SelectItem value="resource">Resource</SelectItem>
                                                        <SelectItem value="transaction">Transaction</SelectItem>
                                                        <SelectItem value="context">Context</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                <Select
                                                    value={condition.attributeName}
                                                    onValueChange={(value) => updateCondition(condition.id, "attributeName", value)}
                                                >
                                                    <SelectTrigger className="h-9">
                                                        <SelectValue placeholder="Thuộc tính" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {getAttributeOptions(condition.attributeGroup).map((attr) => (
                                                            <SelectItem key={attr} value={attr}>
                                                                {attr}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                                <Select
                                                    value={condition.operator}
                                                    onValueChange={(value) => updateCondition(condition.id, "operator", value)}
                                                >
                                                    <SelectTrigger className="h-9">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="=">=</SelectItem>
                                                        <SelectItem value="!=">!=</SelectItem>
                                                        <SelectItem value=">">{">"}</SelectItem>
                                                        <SelectItem value=">=">{">="}</SelectItem>
                                                        <SelectItem value="<">{"<"}</SelectItem>
                                                        <SelectItem value="<=">{"<="}</SelectItem>
                                                        <SelectItem value="in">in</SelectItem>
                                                        <SelectItem value="not in">not in</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                <Input
                                                    placeholder="Giá trị"
                                                    value={condition.value}
                                                    onChange={(e) => updateCondition(condition.id, "value", e.target.value)}
                                                    className="h-9"
                                                />
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => removeCondition(condition.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}

                                    <div className="flex items-center gap-2 text-sm pt-2">
                                        <span className="text-muted-foreground">Logic:</span>
                                        <Select value={conditionLogic} onValueChange={setConditionLogic}>
                                            <SelectTrigger className="w-[200px] h-9 bg-background">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="AND">Tất cả đúng (AND)</SelectItem>
                                                <SelectItem value="OR">Một trong số (OR)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}

                            <Button variant="outline" onClick={addCondition} className="w-full" size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm điều kiện
                            </Button>

                            {/* Natural Language Preview */}
                            {conditions.length > 0 && (
                                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                                    <div className="flex gap-2">
                                        <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                        <div className="text-sm">
                                            <div className="font-medium text-primary mb-1">Câu mô tả tự nhiên:</div>
                                            <div className="text-muted-foreground italic">{generateNaturalLanguage()}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <SheetFooter className="gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button onClick={handleSave} className="shadow-lg shadow-primary/20">
                        Lưu rule
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
