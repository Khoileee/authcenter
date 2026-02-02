import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DetailField {
  label: string;
  value: React.ReactNode;
}

interface ViewDetailPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  fields: DetailField[];
  badges?: { label: string; variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }[];
}

export function ViewDetailPanel({
  open,
  onOpenChange,
  title,
  description,
  fields,
  badges,
}: ViewDetailPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl flex items-center gap-3">
            {title}
            {badges?.map((badge, index) => (
              <Badge
                key={index}
                className={
                  badge.variant === "success"
                    ? "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200/50"
                    : badge.variant === "warning"
                    ? "bg-amber-500/15 text-amber-600 hover:bg-amber-500/20 border-amber-200/50"
                    : ""
                }
                variant={badge.variant === "success" || badge.variant === "warning" ? "outline" : badge.variant}
              >
                {badge.label}
              </Badge>
            ))}
          </SheetTitle>
          {description && (
            <SheetDescription>{description}</SheetDescription>
          )}
        </SheetHeader>

        <Separator className="my-6" />

        <ScrollArea className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
            {fields.map((field, index) => (
              <div key={index} className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  {field.label}
                </label>
                <div className="text-sm bg-muted/50 rounded-lg p-3 min-h-[42px] flex items-center">
                  {field.value || <span className="text-muted-foreground italic">Không có dữ liệu</span>}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Đóng
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
