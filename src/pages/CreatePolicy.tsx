import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2, Plus, Info } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Condition {
    id: string;
    attributeGroup: string;
    attributeName: string;
    operator: string;
    value: string;
}

export default function CreatePolicy() {
    const navigate = useNavigate();
    const [policyName, setPolicyName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("draft");
    const [subjectType, setSubjectType] = useState("role");
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [selectedResource, setSelectedResource] = useState("");
    const [selectedActions, setSelectedActions] = useState<string[]>([]);
    const [conditions, setConditions] = useState<Condition[]>([]);
    const [conditionLogic, setConditionLogic] = useState("AND");

    const addCondition = () => {
        setConditions([
            ...conditions,
            {
                id: Date.now().toString(),
                attributeGroup: "user",
                attributeName: "",
                operator: "=",
                value: "",
            },
        ]);
    };

    const removeCondition = (id: string) => {
        setConditions(conditions.filter((c) => c.id !== id));
    };

    const updateCondition = (id: string, field: keyof Condition, value: string) => {
        setConditions(
            conditions.map((c) => (c.id === id ? { ...c, [field]: value } : c))
        );
    };

    const getAttributeOptions = (group: string) => {
        switch (group) {
            case "user":
                return ["username", "unit", "role", "position", "seniority", "region"];
            case "resource":
                return ["owner_unit", "created_by", "status", "type"];
            case "context":
                return ["channel", "ip", "time_of_day"];
            default:
                return [];
        }
    };

    const handleSave = (activate: boolean) => {
        console.log("Save policy:", {
            policyName,
            description,
            status: activate ? "active" : status,
            subjectType,
            selectedRoles,
            selectedUsers,
            selectedResource,
            selectedActions,
            conditions,
            conditionLogic,
        });
        navigate("/policies");
    };

    return (
        <div className="flex-1 p-8 overflow-auto">
            {/* Breadcrumb */}
            <div className="mb-4 text-sm text-muted-foreground">
                Chính sách phân quyền / <span className="text-foreground">Tạo mới</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold tracking-tight mb-2">Tạo chính sách mới</h1>

            {/* Info Box */}
            <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg flex gap-3">
                <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                    <strong>Một chính sách gồm 3 phần:</strong> 1. WHO (vai trò / người dùng), 2. WHAT (tài nguyên & hành động),
                    3. HOW (điều kiện ABAC – tùy chọn). Kết quả policy sẽ là allow/deny theo đúng rule đã chọn.
                </p>
            </div>

            <div className="space-y-6 max-w-5xl">
                {/* CARD 1: Thông tin chung */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin chung</CardTitle>
                        <CardDescription>Đặt tên và mô tả cho chính sách</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="policyName">
                                Tên chính sách <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="policyName"
                                placeholder="Ví dụ: Chỉ nhân viên Khôi tạo được Rule Data Quality"
                                value={policyName}
                                onChange={(e) => setPolicyName(e.target.value)}
                                className="bg-background/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Mô tả</Label>
                            <Textarea
                                id="description"
                                placeholder="Ví dụ: Chính sách dành riêng cho user khoiln1 quản trị module Data Quality"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="bg-background/50 resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Trạng thái</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="bg-background/50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* CARD 2: Đối tượng áp dụng (WHO) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Áp dụng cho đối tượng nào? (WHO)</CardTitle>
                        <CardDescription>
                            Chỉ cần chọn 1 nhóm đối tượng: hoặc Role, hoặc User. Đây là phần RBAC / user-based.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <RadioGroup value={subjectType} onValueChange={setSubjectType}>
                            <div className="space-y-4">
                                {/* Option 1: Role */}
                                <div className="flex items-start space-x-3">
                                    <RadioGroupItem value="role" id="role" className="mt-1" />
                                    <div className="flex-1 space-y-2">
                                        <Label htmlFor="role" className="font-medium cursor-pointer">
                                            Áp dụng cho Vai trò (Role)
                                        </Label>
                                        {subjectType === "role" && (
                                            <Select>
                                                <SelectTrigger className="bg-background/50">
                                                    <SelectValue placeholder="Chọn vai trò (có thể chọn nhiều)" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="data_quality_admin">DataQualityAdmin</SelectItem>
                                                    <SelectItem value="system_admin">Admin hệ thống</SelectItem>
                                                    <SelectItem value="kpp_hn1">Nhân viên KPP HN1</SelectItem>
                                                    <SelectItem value="manager">Manager</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </div>
                                </div>

                                {/* Option 2: User */}
                                <div className="flex items-start space-x-3">
                                    <RadioGroupItem value="user" id="user" className="mt-1" />
                                    <div className="flex-1 space-y-2">
                                        <Label htmlFor="user" className="font-medium cursor-pointer">
                                            Áp dụng cho Người dùng cụ thể
                                        </Label>
                                        {subjectType === "user" && (
                                            <Select>
                                                <SelectTrigger className="bg-background/50">
                                                    <SelectValue placeholder="Chọn người dùng (có thể chọn nhiều)" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="khoiln1">Lê Nhật Khôi (khoiln1)</SelectItem>
                                                    <SelectItem value="annv">Nguyễn Văn An (annv)</SelectItem>
                                                    <SelectItem value="hoangb2">Hoàng B (hoangb2)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>

                {/* CARD 3: Tài nguyên & Hành động (WHAT) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tài nguyên & hành động được cấp quyền (WHAT)</CardTitle>
                        <CardDescription>
                            Bạn có thể chọn nhiều hành động cho cùng một tài nguyên.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="resource">
                                Tài nguyên <span className="text-destructive">*</span>
                            </Label>
                            <Select value={selectedResource} onValueChange={setSelectedResource}>
                                <SelectTrigger className="bg-background/50">
                                    <SelectValue placeholder="Chọn tài nguyên" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="menu.data_quality">
                                        <div>
                                            <div className="font-medium">Data Quality</div>
                                            <div className="text-xs text-muted-foreground font-mono">menu.data_quality</div>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="api.dq.upload_rule">
                                        <div>
                                            <div className="font-medium">Upload Rule API</div>
                                            <div className="text-xs text-muted-foreground font-mono">api.dq.upload_rule</div>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="feature.ticket.create">
                                        <div>
                                            <div className="font-medium">Create Ticket</div>
                                            <div className="text-xs text-muted-foreground font-mono">feature.ticket.create</div>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="actions">
                                Hành động <span className="text-destructive">*</span>
                            </Label>
                            <Select>
                                <SelectTrigger className="bg-background/50">
                                    <SelectValue placeholder="Chọn hành động (có thể chọn nhiều)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="view">view</SelectItem>
                                    <SelectItem value="create_rule">create_rule</SelectItem>
                                    <SelectItem value="upload_rule">upload_rule</SelectItem>
                                    <SelectItem value="delete">delete</SelectItem>
                                    <SelectItem value="approve">approve</SelectItem>
                                    <SelectItem value="export">export</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* CARD 4: Điều kiện ABAC */}
                <Card>
                    <CardHeader>
                        <CardTitle>Điều kiện phân quyền (ABAC – tùy chọn)</CardTitle>
                        <CardDescription>
                            Tạo điều kiện theo thuộc tính user, resource hoặc context.
                            Ví dụ: <code className="text-xs bg-muted px-1 py-0.5 rounded">User.username = "khoiln1"</code> hoặc{" "}
                            <code className="text-xs bg-muted px-1 py-0.5 rounded">User.unit = Resource.owner_unit</code>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Condition Rows */}
                        {conditions.length > 0 && (
                            <div className="space-y-3">
                                {conditions.map((condition, index) => (
                                    <div key={condition.id} className="flex gap-2 items-start p-3 bg-muted/30 rounded-lg">
                                        <div className="flex-1 grid grid-cols-4 gap-2">
                                            {/* Attribute Group */}
                                            <Select
                                                value={condition.attributeGroup}
                                                onValueChange={(value) => updateCondition(condition.id, "attributeGroup", value)}
                                            >
                                                <SelectTrigger className="bg-background">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="user">User</SelectItem>
                                                    <SelectItem value="resource">Resource</SelectItem>
                                                    <SelectItem value="context">Request/Context</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            {/* Attribute Name */}
                                            <Select
                                                value={condition.attributeName}
                                                onValueChange={(value) => updateCondition(condition.id, "attributeName", value)}
                                            >
                                                <SelectTrigger className="bg-background">
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

                                            {/* Operator */}
                                            <Select
                                                value={condition.operator}
                                                onValueChange={(value) => updateCondition(condition.id, "operator", value)}
                                            >
                                                <SelectTrigger className="bg-background">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="=">=</SelectItem>
                                                    <SelectItem value="!=">!=</SelectItem>
                                                    <SelectItem value="in">in</SelectItem>
                                                    <SelectItem value="not in">not in</SelectItem>
                                                    <SelectItem value="contains">contains</SelectItem>
                                                    <SelectItem value=">">{">"}</SelectItem>
                                                    <SelectItem value="<">{"<"}</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            {/* Value */}
                                            <Input
                                                placeholder="Giá trị"
                                                value={condition.value}
                                                onChange={(e) => updateCondition(condition.id, "value", e.target.value)}
                                                className="bg-background"
                                            />
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeCondition(condition.id)}
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}

                                {/* Logic Selector */}
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-muted-foreground">Logic kết hợp:</span>
                                    <Select value={conditionLogic} onValueChange={setConditionLogic}>
                                        <SelectTrigger className="w-[280px] bg-background/50">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="AND">Tất cả điều kiện phải đúng (AND)</SelectItem>
                                            <SelectItem value="OR">Chỉ cần một điều kiện đúng (OR)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        {/* Add Condition Button */}
                        <Button variant="outline" onClick={addCondition} className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm điều kiện
                        </Button>
                    </CardContent>
                </Card>

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 pt-4 pb-8">
                    <Button variant="outline" onClick={() => navigate("/policies")}>
                        Hủy
                    </Button>
                    <Button variant="secondary" onClick={() => handleSave(false)}>
                        Lưu nháp
                    </Button>
                    <Button onClick={() => handleSave(true)} className="shadow-lg shadow-primary/20">
                        Kích hoạt
                    </Button>
                </div>
            </div>
        </div>
    );
}
