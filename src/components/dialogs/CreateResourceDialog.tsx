import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { CreateResourceForm, ResourceFormData } from "./create-resource-steps/CreateResourceForm";
import { useToast } from "@/hooks/use-toast";

interface CreateResourcePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateResourcePanel({ open, onOpenChange }: CreateResourcePanelProps) {
  const { toast } = useToast();

  const [formData, setFormData] = useState<ResourceFormData>({
    resourceName: "",
    description: "",
    datasource: "",
    schema: "",
    table: "",
    attributes: [],
    selectedActions: [],
  });

  const handleSubmit = () => {
    console.log("Create resource:", formData);
    toast({
      title: "Tạo tài nguyên thành công",
      description: `Tài nguyên "${formData.resourceName}" đã được tạo.`,
    });
    onOpenChange(false);
    // Reset form
    setFormData({
      resourceName: "",
      description: "",
      datasource: "",
      schema: "",
      table: "",
      attributes: [],
      selectedActions: [],
    });
  };

  const updateFormData = (data: Partial<ResourceFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const isValid = () => {
    return (
      formData.resourceName && 
      formData.datasource && 
      formData.schema && 
      formData.table &&
      formData.selectedActions.length > 0 // Phải chọn ít nhất 1 action
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-5xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">Thêm tài nguyên mới</SheetTitle>
          <SheetDescription>
            Chọn bảng dữ liệu và cấu hình phân quyền
          </SheetDescription>
        </SheetHeader>

        <div className="py-6">
          <CreateResourceForm data={formData} onChange={updateFormData} />
        </div>

        {/* Footer */}
        <div className="flex justify-between gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setFormData({
                resourceName: "",
                description: "",
                datasource: "",
                schema: "",
                table: "",
                attributes: [],
                selectedActions: [],
              });
            }}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid()}
            className="shadow-lg shadow-primary/20"
          >
            Tạo tài nguyên
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
