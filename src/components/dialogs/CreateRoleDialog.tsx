import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

interface CreateRolePanelProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateRolePanel({ open, onOpenChange }: CreateRolePanelProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        roleGroup: "",
        assignedUsers: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Create role:", formData);
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="text-2xl">Tạo vai trò mới</SheetTitle>
                    <SheetDescription>
                        Tạo vai trò mới để quản lý quyền hạn trong hệ thống
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-6">
                    {/* Tên vai trò */}
                    <div className="space-y-2">
                        <Label htmlFor="roleName">
                            Tên vai trò <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="roleName"
                            placeholder="Ví dụ: Data Analyst"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="bg-background"
                        />
                    </div>

                    {/* Mô tả vai trò */}
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Mô tả vai trò <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Mô tả chi tiết về vai trò này..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            rows={4}
                            className="bg-background resize-none"
                        />
                    </div>

                    {/* Nhóm vai trò */}
                    <div className="space-y-2">
                        <Label htmlFor="roleGroup">Nhóm vai trò</Label>
                        <Select value={formData.roleGroup} onValueChange={(value) => setFormData({ ...formData, roleGroup: value })}>
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Chọn nhóm vai trò" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Quản trị</SelectItem>
                                <SelectItem value="management">Quản lý</SelectItem>
                                <SelectItem value="operation">Vận hành</SelectItem>
                                <SelectItem value="support">Hỗ trợ</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Gán sẵn cho người dùng */}
                    <div className="space-y-2">
                        <Label htmlFor="assignUsers">Gán sẵn cho người dùng (tùy chọn)</Label>
                        <Select>
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Chọn người dùng" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user1">Nguyễn Văn An</SelectItem>
                                <SelectItem value="user2">Trần Thị Bình</SelectItem>
                                <SelectItem value="user3">Lê Văn Cường</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Vai trò chưa có quyền. Quyền được gán thông qua Chính sách (Policy).
                        </p>
                    </div>

                    <SheetFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Hủy
                        </Button>
                        <Button type="submit" className="shadow-lg shadow-primary/20">
                            Tạo vai trò
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
