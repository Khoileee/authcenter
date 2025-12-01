import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Trash2, Plus } from "lucide-react";
import { useState } from "react";

interface Condition {
    id: string;
    attributeType: "user" | "resource";
    attributeName: string;
    operator: string;
    value: string;
}

interface DynamicGroupPanelProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DynamicGroupPanel({ open, onOpenChange }: DynamicGroupPanelProps) {
    const [groupName, setGroupName] = useState("");
    const [description, setDescription] = useState("");
    const [resource, setResource] = useState("");
    const [actions, setActions] = useState<string[]>([]);
    const [conditions, setConditions] = useState<Condition[]>([]);

    const addCondition = () => {
        setConditions([
            ...conditions,
            {
                id: Date.now().toString(),
                attributeType: "user",
                attributeName: "",
                operator: "==",
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

    const getUserAttributes = () => [
        "user.unit",
        "user.team",
        "user.level",
        "user.position",
        "user.location",
        "user.seniority",
        "user.status",
    ];

    const getResourceAttributes = () => [
        "resource.owner_unit",
        "resource.responsible_unit",
        "resource.created_by",
        "resource.sensitive_level",
        "resource.status",
    ];

    const getAttributeOptions = (type: "user" | "resource") => {
        return type === "user" ? getUserAttributes() : getResourceAttributes();
    };

    const handleSave = () => {
        console.log("Save dynamic group:", {
            groupName,
            description,
            resource,
            actions,
            conditions,
        });
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="text-2xl">Tạo nhóm động</SheetTitle>
                    <SheetDescription>
                        Tạo nhóm người dùng tự động dựa trên điều kiện ABAC
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 py-6">
                    {/* Basic Info */}
                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                            Thông tin nhóm
                        </h3>

                        <div className="space-y-2">
                            <Label htmlFor="groupName">
                                Tên nhóm động <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="groupName"
                                placeholder="Ví dụ: Nhân viên PTDL - Quản lý bảng"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                className="bg-background"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Mô tả</Label>
                            <Textarea
                                id="description"
                                placeholder="Mô tả mục đích và phạm vi của nhóm động..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="bg-background resize-none"
                            />
                        </div>
                    </div>

                    {/* Resource & Actions */}
                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                            Quyền được cấp
                        </h3>

                        <div className="space-y-2">
                            <Label htmlFor="resource">Resource</Label>
                            <Select value={resource} onValueChange={setResource}>
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Chọn resource" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="table">table</SelectItem>
                                    <SelectItem value="sql_query">sql_query</SelectItem>
                                    <SelectItem value="job">job</SelectItem>
                                    <SelectItem value="feature">feature</SelectItem>
                                    <SelectItem value="dq_rule">dq_rule</SelectItem>
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
                                    <SelectItem value="view">view</SelectItem>
                                    <SelectItem value="edit">edit</SelectItem>
                                    <SelectItem value="create">create</SelectItem>
                                    <SelectItem value="delete">delete</SelectItem>
                                    <SelectItem value="approve">approve</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* ABAC Conditions */}
                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                            Điều kiện ABAC
                        </h3>

                        {conditions.length > 0 && (
                            <div className="space-y-2">
                                {conditions.map((condition) => (
                                    <div key={condition.id} className="flex gap-2 items-start p-2 bg-background rounded-lg border">
                                        <div className="flex-1 grid grid-cols-4 gap-2">
                                            {/* Attribute Type */}
                                            <Select
                                                value={condition.attributeType}
                                                onValueChange={(value: any) =>
                                                    updateCondition(condition.id, "attributeType", value)
                                                }
                                            >
                                                <SelectTrigger className="h-9">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="user">User</SelectItem>
                                                    <SelectItem value="resource">Resource</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            {/* Attribute Name */}
                                            <Select
                                                value={condition.attributeName}
                                                onValueChange={(value) =>
                                                    updateCondition(condition.id, "attributeName", value)
                                                }
                                            >
                                                <SelectTrigger className="h-9">
                                                    <SelectValue placeholder="Thuộc tính" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {getAttributeOptions(condition.attributeType).map((attr) => (
                                                        <SelectItem key={attr} value={attr}>
                                                            {attr}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            {/* Operator */}
                                            <Select
                                                value={condition.operator}
                                                onValueChange={(value) =>
                                                    updateCondition(condition.id, "operator", value)
                                                }
                                            >
                                                <SelectTrigger className="h-9">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="==">==</SelectItem>
                                                    <SelectItem value="!=">!=</SelectItem>
                                                    <SelectItem value=">">{">"}</SelectItem>
                                                    <SelectItem value=">=">{">="}</SelectItem>
                                                    <SelectItem value="<">{"<"}</SelectItem>
                                                    <SelectItem value="<=">{"<="}</SelectItem>
                                                    <SelectItem value="IN">IN</SelectItem>
                                                    <SelectItem value="NOT IN">NOT IN</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            {/* Value */}
                                            <Input
                                                placeholder="Giá trị"
                                                value={condition.value}
                                                onChange={(e) =>
                                                    updateCondition(condition.id, "value", e.target.value)
                                                }
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
                            </div>
                        )}

                        <Button variant="outline" onClick={addCondition} className="w-full" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm điều kiện
                        </Button>

                        {/* Examples */}
                        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
                            <p className="font-medium">Ví dụ điều kiện:</p>
                            <p className="font-mono">user.unit == "PTDL"</p>
                            <p className="font-mono">resource.responsible_unit IN ["PTDL", "HTDL"]</p>
                            <p className="font-mono">user.seniority == "senior"</p>
                        </div>
                    </div>
                </div>

                <SheetFooter className="gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button onClick={handleSave} className="shadow-lg shadow-primary/20">
                        Lưu nhóm động
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
