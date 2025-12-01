import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

interface CreateActionPanelProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateActionPanel({ open, onOpenChange }: CreateActionPanelProps) {
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        actionGroup: "",
        description: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Create action:", formData);
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="text-2xl">Thêm hành động mới</SheetTitle>
                    <SheetDescription>
                        Tạo hành động mới có thể phân quyền trong hệ thống
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-6">
                    {/* Mã hành động */}
                    <div className="space-y-2">
                        <Label htmlFor="actionCode">
                            Mã hành động <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="actionCode"
                            placeholder="Ví dụ: view, edit, approve"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            required
                            className="bg-background font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                            Mã duy nhất để định danh hành động
                        </p>
                    </div>

                    {/* Tên hiển thị */}
                    <div className="space-y-2">
                        <Label htmlFor="actionName">
                            Tên hiển thị <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="actionName"
                            placeholder="Ví dụ: Xem, Sửa, Phê duyệt"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="bg-background"
                        />
                    </div>

                    {/* Nhóm hành động */}
                    <div className="space-y-2">
                        <Label htmlFor="actionGroup">Nhóm hành động</Label>
                        <Select value={formData.actionGroup} onValueChange={(value) => setFormData({ ...formData, actionGroup: value })}>
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Chọn nhóm hành động" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="crud">CRUD</SelectItem>
                                <SelectItem value="admin">Quản trị</SelectItem>
                                <SelectItem value="workflow">Workflow</SelectItem>
                                <SelectItem value="other">Khác</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Giúp phân loại khi có nhiều hành động
                        </p>
                    </div>

                    {/* Mô tả */}
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Mô tả <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Giải thích công dụng để non-tech hiểu..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            rows={3}
                            className="bg-background resize-none"
                        />
                    </div>

                    <SheetFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Hủy
                        </Button>
                        <Button type="submit" className="shadow-lg shadow-primary/20">
                            Tạo hành động
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
