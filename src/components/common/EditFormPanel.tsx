import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save } from "lucide-react";

export interface EditFormField {
  name: string;
  label: string;
  type: "text" | "email" | "textarea" | "select";
  value: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
}

interface EditFormPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  fields: EditFormField[];
  onFieldChange: (name: string, value: string) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export function EditFormPanel({
  open,
  onOpenChange,
  title,
  description,
  fields,
  onFieldChange,
  onSave,
  isSaving = false,
}: EditFormPanelProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">{title}</SheetTitle>
          {description && (
            <SheetDescription>{description}</SheetDescription>
          )}
        </SheetHeader>

        <Separator className="my-6" />

        <form onSubmit={handleSubmit}>
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
              {fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      id={field.name}
                      value={field.value}
                      onChange={(e) => onFieldChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      disabled={field.disabled}
                      className="min-h-[100px] bg-background"
                    />
                  ) : field.type === "select" ? (
                    <Select
                      value={field.value}
                      onValueChange={(value) => onFieldChange(field.name, value)}
                      disabled={field.disabled}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder={field.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={field.name}
                      type={field.type}
                      value={field.value}
                      onChange={(e) => onFieldChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      disabled={field.disabled}
                      className="bg-background"
                    />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <SheetFooter className="mt-6 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSaving} className="shadow-lg shadow-primary/20">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
