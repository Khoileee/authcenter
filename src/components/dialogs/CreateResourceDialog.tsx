import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Step1BasicInfo, Step1Data } from "./create-resource-steps/Step1BasicInfo";
import { Step2DataSourceAttributes, Step2CombinedData } from "./create-resource-steps/Step2DataSourceAttributes";
import { Step3Actions, Step3Data } from "./create-resource-steps/Step3Actions";
import { useToast } from "@/hooks/use-toast";

interface CreateResourcePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  { id: 1, title: "Thông tin chung" },
  { id: 2, title: "Nguồn dữ liệu & Thuộc tính" },
  { id: 3, title: "Hành động" },
];

export interface ResourceFormData {
  step1: Step1Data;
  step2: Step2CombinedData;
  step3: Step3Data;
}

export function CreateResourcePanel({ open, onOpenChange }: CreateResourcePanelProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  const [formData, setFormData] = useState<ResourceFormData>({
    step1: {
      system: "",
      code: "",
      name: "",
      type: "",
      featureGroup: "",
      description: "",
      status: "active",
    },
    step2: {
      datasource: "",
      table: "",
      attributes: [],
    },
    step3: {
      actions: [],
    },
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Create resource:", formData);
    toast({
      title: "Tạo tài nguyên thành công",
      description: `Tài nguyên "${formData.step1.name}" đã được tạo.`,
    });
    onOpenChange(false);
    // Reset form
    setCurrentStep(1);
    setFormData({
      step1: {
        system: "",
        code: "",
        name: "",
        type: "",
        featureGroup: "",
        description: "",
        status: "active",
      },
      step2: {
        datasource: "",
        table: "",
        attributes: [],
      },
      step3: {
        actions: [],
      },
    });
  };

  const updateStep1 = (data: Partial<Step1Data>) => {
    setFormData((prev) => ({
      ...prev,
      step1: { ...prev.step1, ...data },
    }));
  };

  const updateStep2 = (data: Partial<Step2CombinedData>) => {
    setFormData((prev) => ({
      ...prev,
      step2: { ...prev.step2, ...data },
    }));
  };

  const updateStep3 = (data: Partial<Step3Data>) => {
    setFormData((prev) => ({
      ...prev,
      step3: { ...prev.step3, ...data },
    }));
  };

  const isStep1Valid = () => {
    const { system, code, name, type, status } = formData.step1;
    return system && code && name && type && status;
  };

  const isStep2Valid = () => {
    const { datasource, table } = formData.step2;
    return datasource && table;
  };

  const isStep3Valid = () => {
    return formData.step3.actions.length > 0;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return isStep1Valid();
      case 2:
        return isStep2Valid();
      case 3:
        return isStep3Valid();
      default:
        return false;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-5xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">Thêm tài nguyên mới</SheetTitle>
          <SheetDescription>
            Tạo tài nguyên mới để quản lý phân quyền trong hệ thống
          </SheetDescription>
        </SheetHeader>

        {/* Stepper */}
        <div className="py-6">
          <div className="flex items-start justify-between gap-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all flex-shrink-0",
                      currentStep > step.id
                        ? "bg-primary text-primary-foreground"
                        : currentStep === step.id
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-2 text-xs font-medium text-center">
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 transition-all self-start",
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    )}
                    style={{ marginTop: '20px' }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="py-6">
          {currentStep === 1 && (
            <Step1BasicInfo data={formData.step1} onChange={updateStep1} />
          )}
          {currentStep === 2 && (
            <Step2DataSourceAttributes data={formData.step2} onChange={updateStep2} />
          )}
          {currentStep === 3 && (
            <Step3Actions data={formData.step3} onChange={updateStep3} />
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setCurrentStep(1);
            }}
          >
            Hủy
          </Button>
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={handleBack}>
                Quay lại
              </Button>
            )}
            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Tiếp tục
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="shadow-lg shadow-primary/20"
              >
                Hoàn tất & Tạo tài nguyên
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
