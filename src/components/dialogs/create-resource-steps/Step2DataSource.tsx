import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export interface Step2Data {
  useDatabase: boolean;
  datasource: string;
  schema: string;
  table: string;
  primaryKey: string;
}

interface Step2DataSourceProps {
  data: Step2Data;
  onChange: (data: Partial<Step2Data>) => void;
}

export function Step2DataSource({ data, onChange }: Step2DataSourceProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Bước 2: Nguồn dữ liệu vật lý (Mapping DB)</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Cấu hình ánh xạ tài nguyên với bảng/view trong database để phục vụ phân quyền
        </p>
      </div>

      {/* Có sử dụng bảng dữ liệu? */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <Label>
            Có sử dụng bảng dữ liệu cho phân quyền? <span className="text-destructive">*</span>
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Chọn "Có" nếu tài nguyên là Business Entity hoặc Data Object cần phân quyền theo dữ liệu.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <RadioGroup
          value={data.useDatabase ? "yes" : "no"}
          onValueChange={(value) => onChange({ useDatabase: value === "yes" })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="use-db-yes" />
            <Label htmlFor="use-db-yes" className="font-normal cursor-pointer">
              Có - Tài nguyên này cần ánh xạ với bảng dữ liệu
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="use-db-no" />
            <Label htmlFor="use-db-no" className="font-normal cursor-pointer">
              Không - Tài nguyên không cần ánh xạ database (ví dụ: UI Menu)
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Hiển thị các field DB nếu chọn "Có" */}
      {data.useDatabase && (
        <>
          {/* Datasource / Kết nối DB */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="datasource">
                Datasource / Kết nối DB <span className="text-destructive">*</span>
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Chọn từ danh sách kết nối hệ thống đã cấu hình</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select value={data.datasource} onValueChange={(value) => onChange({ datasource: value })}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Chọn kết nối database" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fintech_dw">FintechDW (Data Warehouse)</SelectItem>
                <SelectItem value="operational_db">OperationalDB (Production)</SelectItem>
                <SelectItem value="dq_repository">DQ_Repository</SelectItem>
                <SelectItem value="ticket_db">TicketDB</SelectItem>
                <SelectItem value="admin_db">AdminDB</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Schema */}
          <div className="space-y-2">
            <Label htmlFor="schema">
              Schema <span className="text-destructive">*</span>
            </Label>
            <Select 
              value={data.schema} 
              onValueChange={(value) => onChange({ schema: value })}
              disabled={!data.datasource}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Chọn schema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dbo">dbo</SelectItem>
                <SelectItem value="system">system</SelectItem>
                <SelectItem value="dm">dm (Data Mart)</SelectItem>
                <SelectItem value="ods">ods (Operational Data Store)</SelectItem>
                <SelectItem value="staging">staging</SelectItem>
              </SelectContent>
            </Select>
            {!data.datasource && (
              <p className="text-xs text-muted-foreground text-amber-600">
                Vui lòng chọn datasource trước
              </p>
            )}
          </div>

          {/* Tên bảng / View */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="table">
                Tên bảng / View <span className="text-destructive">*</span>
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Chọn từ danh sách bảng/view đã load từ datasource & schema</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select 
              value={data.table} 
              onValueChange={(value) => onChange({ table: value })}
              disabled={!data.schema}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Chọn bảng hoặc view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="features">features</SelectItem>
                <SelectItem value="dashboards">dashboards</SelectItem>
                <SelectItem value="tickets">tickets</SelectItem>
                <SelectItem value="data_quality_rules">data_quality_rules</SelectItem>
                <SelectItem value="reports">reports</SelectItem>
              </SelectContent>
            </Select>
            {!data.schema && (
              <p className="text-xs text-muted-foreground text-amber-600">
                Vui lòng chọn schema trước
              </p>
            )}
          </div>

          {/* Khóa chính / Business key */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="primaryKey">Khóa chính / Business key</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Optional - Chọn cột định danh duy nhất của bản ghi</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select 
              value={data.primaryKey} 
              onValueChange={(value) => onChange({ primaryKey: value })}
              disabled={!data.table}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Chọn cột khóa chính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">id</SelectItem>
                <SelectItem value="feature_id">feature_id</SelectItem>
                <SelectItem value="dashboard_id">dashboard_id</SelectItem>
                <SelectItem value="ticket_id">ticket_id</SelectItem>
                <SelectItem value="rule_id">rule_id</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {!data.useDatabase && (
        <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
          <p className="text-sm text-muted-foreground">
            ℹ️ Bạn đã chọn không sử dụng bảng dữ liệu. Bước này sẽ được bỏ qua. Click "Tiếp tục" để sang bước tiếp theo.
          </p>
        </div>
      )}
    </div>
  );
}
