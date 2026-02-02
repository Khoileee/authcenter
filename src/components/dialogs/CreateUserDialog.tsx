import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState, KeyboardEvent } from "react";

interface CreateUserPanelProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateUserPanel({ open, onOpenChange }: CreateUserPanelProps) {
    const [formData, setFormData] = useState({
        employeeId: "",
        fullName: "",
        username: "",
        email: "",
        phone: "",
        department: "",
        position: "",
        status: "active",
        roles: [] as string[],
        ipAddresses: [] as string[],
    });

    const [ipInput, setIpInput] = useState("");

    const handleAddIp = () => {
        const trimmedIp = ipInput.trim();
        if (trimmedIp && !formData.ipAddresses.includes(trimmedIp)) {
            setFormData({ ...formData, ipAddresses: [...formData.ipAddresses, trimmedIp] });
            setIpInput("");
        }
    };

    const handleIpKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddIp();
        }
    };

    const removeIp = (ipToRemove: string) => {
        setFormData({
            ...formData,
            ipAddresses: formData.ipAddresses.filter((ip) => ip !== ipToRemove),
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Create user:", formData);
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="text-2xl">Thêm người dùng mới</SheetTitle>
                    <SheetDescription>
                        Điền thông tin để tạo người dùng mới trong hệ thống
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Mã nhân viên */}
                        <div className="space-y-2">
                            <Label htmlFor="employeeId">
                                Mã nhân viên
                            </Label>
                            <Input
                                id="employeeId"
                                placeholder="NV001"
                                value={formData.employeeId}
                                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                className="bg-background"
                            />
                        </div>

                        {/* Họ và tên */}
                        <div className="space-y-2">
                            <Label htmlFor="fullName">
                                Họ và tên <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="fullName"
                                placeholder="Nguyễn Văn A"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                required
                                className="bg-background"
                            />
                        </div>

                        {/* Username */}
                        <div className="space-y-2">
                            <Label htmlFor="username">
                                Username <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="username"
                                placeholder="nguyenvana"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                                className="bg-background"
                            />
                            <p className="text-xs text-muted-foreground">
                                Username phải khớp với tài khoản SSO để đăng nhập
                            </p>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nguyenvana@company.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="bg-background"
                            />
                        </div>

                        {/* Số điện thoại */}
                        <div className="space-y-2">
                            <Label htmlFor="phone">Số điện thoại</Label>
                            <Input
                                id="phone"
                                placeholder="0123456789"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="bg-background"
                            />
                        </div>

                        {/* Đơn vị / Bộ phận */}
                        <div className="space-y-2">
                            <Label htmlFor="department">
                                Đơn vị / Bộ phận <span className="text-destructive">*</span>
                            </Label>
                            <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Chọn đơn vị" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="it">IT Department</SelectItem>
                                    <SelectItem value="hr">HR Department</SelectItem>
                                    <SelectItem value="data">Data Team</SelectItem>
                                    <SelectItem value="finance">Finance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Vị trí / Chức danh */}
                        <div className="space-y-2">
                            <Label htmlFor="position">Vị trí / Chức danh</Label>
                            <Input
                                id="position"
                                placeholder="Senior Developer"
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                className="bg-background"
                            />
                        </div>

                        {/* Trạng thái */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Trạng thái</Label>
                            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                                <SelectTrigger className="bg-background">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Hoạt động</SelectItem>
                                    <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Vai trò */}
                        <div className="space-y-2">
                            <Label htmlFor="roles">Vai trò</Label>
                            <Select>
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Chọn vai trò" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="manager">Manager</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="analyst">Data Analyst</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* IP Address */}
                    <div className="space-y-2">
                        <Label htmlFor="ipAddress">
                            IP Address <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="ipAddress"
                            placeholder="Nhập IP và nhấn Enter (ví dụ: 192.168.1.1)"
                            value={ipInput}
                            onChange={(e) => setIpInput(e.target.value)}
                            onKeyDown={handleIpKeyDown}
                            className="bg-background"
                        />
                        {formData.ipAddresses.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.ipAddresses.map((ip) => (
                                    <Badge
                                        key={ip}
                                        variant="secondary"
                                        className="gap-1 pr-1 font-normal"
                                    >
                                        {ip}
                                        <button
                                            type="button"
                                            onClick={() => removeIp(ip)}
                                            className="ml-1 rounded-sm hover:bg-destructive/20 hover:text-destructive"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    <SheetFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Hủy
                        </Button>
                        <Button type="submit" className="shadow-lg shadow-primary/20">
                            Tạo người dùng
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
