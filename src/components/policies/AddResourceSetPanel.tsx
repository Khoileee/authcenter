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
    field: string;
    operator: string;
    value: string;
}

interface AddResourceSetPanelProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddResourceSetPanel({ open, onOpenChange }: AddResourceSetPanelProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [resourceType, setResourceType] = useState("table");
    const [conditions, setConditions] = useState<Condition[]>([]);
    const [logic, setLogic] = useState("AND");

    const addCondition = () => {
        setConditions([
            ...conditions,
            {
                id: Date.now().toString(),
                field: "resource.owner_unit",
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

    const handleSave = () => {
        console.log("Save resource set:", { name, description, resourceType, conditions, logic });
        onOpenChange(false);
        // Reset form
        setName("");
        setDescription("");
        setResourceType("table");
        setConditions([]);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="text-xl">Tạo tập tài nguyên (Resource Set)</SheetTitle>
                    <SheetDescription>
                        Định nghĩa tập tài nguyên dựa trên các điều kiện ABAC
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 py-6">
                    {/* Tên resource set */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Tên resource set <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="Ví dụ: Bảng do đơn vị sở hữu"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Mô tả */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            placeholder="Mô tả ngắn gọn về tập tài nguyên này..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="resize-none"
                        />
                    </div>

                    {/* Loại Resource */}
                    <div className="space-y-2">
                        <Label htmlFor="resourceType">Loại Resource</Label>
                        <Select value={resourceType} onValueChange={setResourceType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="table">table</SelectItem>
                                <SelectItem value="dashboard">dashboard</SelectItem>
                                <SelectItem value="chart">chart</SelectItem>
                                <SelectItem value="sql_query">sql query</SelectItem>
                                <SelectItem value="job">job</SelectItem>
                                <SelectItem value="feature">feature</SelectItem>
                                <SelectItem value="data_quality_rule">data-quality-rule</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Điều kiện ABAC cho resource */}
                    <div className="space-y-3">
                        <div>
                            <Label>Điều kiện ABAC cho resource</Label>
                            <p className="text-xs text-muted-foreground mt-1">
                                Định nghĩa điều kiện để xác định tài nguyên thuộc tập này
                            </p>
                        </div>

                        {conditions.length > 0 && (
                            <div className="space-y-2">
                                {conditions.map((condition, index) => (
                                    <div key={condition.id}>
                                        {index > 0 && (
                                            <div className="flex items-center gap-2 my-2">
                                                <div className="flex-1 border-t"></div>
                                                <Select value={logic} onValueChange={setLogic}>
                                                    <SelectTrigger className="w-[100px] h-8">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="AND">AND</SelectItem>
                                                        <SelectItem value="OR">OR</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <div className="flex-1 border-t"></div>
                                            </div>
                                        )}
                                        <div className="flex gap-2 items-start p-3 bg-muted/30 rounded-lg border">
                                            <div className="flex-1 grid grid-cols-3 gap-2">
                                                {/* Field */}
                                                <Select
                                                    value={condition.field}
                                                    onValueChange={(value) => updateCondition(condition.id, "field", value)}
                                                >
                                                    <SelectTrigger className="h-9">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="resource.owner_unit">resource.owner_unit</SelectItem>
                                                        <SelectItem value="resource.responsible_unit">resource.responsible_unit</SelectItem>
                                                        <SelectItem value="resource.created_by">resource.created_by</SelectItem>
                                                        <SelectItem value="resource.type">resource.type</SelectItem>
                                                        <SelectItem value="resource.status">resource.status</SelectItem>
                                                        <SelectItem value="resource.value">resource.value</SelectItem>
                                                        <SelectItem value="resource.tags">resource.tags</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                {/* Operator */}
                                                <Select
                                                    value={condition.operator}
                                                    onValueChange={(value) => updateCondition(condition.id, "operator", value)}
                                                >
                                                    <SelectTrigger className="h-9">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="==">==</SelectItem>
                                                        <SelectItem value="!=">!=</SelectItem>
                                                        <SelectItem value="contains">contains</SelectItem>
                                                        <SelectItem value="in">in</SelectItem>
                                                        <SelectItem value=">">{">"}</SelectItem>
                                                        <SelectItem value="<">{"<"}</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                {/* Value */}
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
                                    </div>
                                ))}
                            </div>
                        )}

                        <Button variant="outline" onClick={addCondition} className="w-full" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm điều kiện
                        </Button>
                    </div>

                    {/* Preview */}
                    {conditions.length > 0 && (
                        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                            <div className="text-xs font-medium text-primary mb-1">Preview:</div>
                            <div className="text-sm text-muted-foreground font-mono">
                                {conditions.map((c, i) => (
                                    <span key={c.id}>
                                        {i > 0 && ` ${logic} `}
                                        {c.field} {c.operator} "{c.value}"
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <SheetFooter className="gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button onClick={handleSave} disabled={!name}>
                        Tạo tài nguyên
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
