import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export interface Step1Data {
  system: string;
  code: string;
  name: string;
  type: string;
  featureGroup: string;
  description: string;
  status: "active" | "inactive";
}

interface Step1BasicInfoProps {
  data: Step1Data;
  onChange: (data: Partial<Step1Data>) => void;
}

export function Step1BasicInfo({ data, onChange }: Step1BasicInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <h3 className="text-lg font-semibold">Bước 1: Thông tin chung tài nguyên</h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">
                Nhập thông tin cơ bản để định danh và phân loại tài nguyên
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Hệ thống */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="system">
            Hệ thống <span className="text-destructive">*</span>
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Chọn hệ thống/ứng dụng mà tài nguyên này thuộc về</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Select value={data.system} onValueChange={(value) => onChange({ system: value })}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Chọn hệ thống" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ticket_system">Ticket System</SelectItem>
            <SelectItem value="data_quality">Data Quality</SelectItem>
            <SelectItem value="bi_dashboard">BI Dashboard</SelectItem>
            <SelectItem value="chatbot">Chatbot</SelectItem>
            <SelectItem value="administration">Administration</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mã tài nguyên */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="code">
            Mã tài nguyên <span className="text-destructive">*</span>
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Chỉ cho phép chữ thường, số, dấu chấm, gạch dưới (a-z, 0-9, ., _).<br />Phải unique trong hệ thống.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Input
          id="code"
          placeholder="Ví dụ: menu.data_quality, api.dq.upload_rule, feature.ticket.create"
          value={data.code}
          onChange={(e) => onChange({ code: e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, "") })}
          className="bg-background font-mono text-sm"
        />
      </div>

      {/* Tên hiển thị */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Tên hiển thị <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Ví dụ: Data Quality, Upload Rule API, Create Ticket"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="bg-background"
        />
      </div>

      {/* Loại tài nguyên */}
      <div className="space-y-2">
        <Label htmlFor="type">
          Loại tài nguyên <span className="text-destructive">*</span>
        </Label>
        <Select value={data.type} onValueChange={(value) => onChange({ type: value })}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Chọn loại tài nguyên" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ui_menu">UI Menu</SelectItem>
            <SelectItem value="api_endpoint">API Endpoint</SelectItem>
            <SelectItem value="business_entity">Business Entity</SelectItem>
            <SelectItem value="data_object">Data Object</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Nhóm tính năng */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="featureGroup">Nhóm tính năng</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Phân nhóm để dễ quản lý và tìm kiếm</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Select value={data.featureGroup} onValueChange={(value) => onChange({ featureGroup: value })}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Chọn nhóm tính năng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="data_management">Data Management</SelectItem>
            <SelectItem value="data_quality">Data Quality</SelectItem>
            <SelectItem value="ticket_system">Ticket System</SelectItem>
            <SelectItem value="administration">Administration</SelectItem>
            <SelectItem value="reporting">Reporting</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mô tả */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="description">Mô tả</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Dùng để giải thích cho admin & developer</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Textarea
          id="description"
          placeholder="Mô tả chi tiết về tài nguyên này..."
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={3}
          className="bg-background resize-none"
        />
      </div>

      {/* Trạng thái */}
      <div className="space-y-2">
        <Label>
          Trạng thái <span className="text-destructive">*</span>
        </Label>
        <RadioGroup
          value={data.status}
          onValueChange={(value: "active" | "inactive") => onChange({ status: value })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="active" id="active" />
            <Label htmlFor="active" className="font-normal cursor-pointer">
              Active (Hoạt động)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="inactive" id="inactive" />
            <Label htmlFor="inactive" className="font-normal cursor-pointer">
              Inactive (Không hoạt động)
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
