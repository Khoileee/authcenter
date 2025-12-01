import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

interface CreateResourcePanelProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateResourcePanel({ open, onOpenChange }: CreateResourcePanelProps) {
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        type: "",
        featureGroup: "",
        description: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Create resource:", formData);
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="text-2xl">Thêm tài nguyên mới</SheetTitle>
                    <SheetDescription>
                        Tạo tài nguyên mới để quản lý phân quyền trong hệ thống
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-6">
                    {/* Mã tài nguyên */}
                    <div className="space-y-2">
                        <Label htmlFor="resourceCode">
                            Mã tài nguyên <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="resourceCode"
                            placeholder="Ví dụ: menu.data_quality"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            required
                            className="bg-background font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                            Mã duy nhất để định danh tài nguyên
                        </p>
                    </div>

                    {/* Tên hiển thị */}
                    <div className="space-y-2">
                        <Label htmlFor="resourceName">
                            Tên hiển thị <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="resourceName"
                            placeholder="Ví dụ: Data Quality"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="bg-background"
                        />
                    </div>

                    {/* Loại tài nguyên */}
                    <div className="space-y-2">
                        <Label htmlFor="resourceType">
                            Loại tài nguyên <span className="text-destructive">*</span>
                        </Label>
                        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })} required>
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Chọn loại tài nguyên" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ui_menu">UI Menu</SelectItem>
                                <SelectItem value="api_endpoint">API Endpoint</SelectItem>
                                <SelectItem value="business_entity">Nghiệp vụ (Business Entity)</SelectItem>
                                <SelectItem value="feature">Chức năng</SelectItem>
                                <SelectItem value="workflow">Workflow</SelectItem>
                                <SelectItem value="file_storage">Kho file</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Nhóm tính năng */}
                    <div className="space-y-2">
                        <Label htmlFor="featureGroup">Nhóm tính năng</Label>
                        <Select value={formData.featureGroup} onValueChange={(value) => setFormData({ ...formData, featureGroup: value })}>
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Chọn nhóm tính năng" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="data_quality">Data Quality</SelectItem>
                                <SelectItem value="ticket_system">Ticket System</SelectItem>
                                <SelectItem value="user_management">User Management</SelectItem>
                                <SelectItem value="reporting">Reporting</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Mô tả */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            placeholder="Mô tả chi tiết về tài nguyên này..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="bg-background resize-none"
                        />
                    </div>

                    <SheetFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Hủy
                        </Button>
                        <Button type="submit" className="shadow-lg shadow-primary/20">
                            Tạo tài nguyên
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
