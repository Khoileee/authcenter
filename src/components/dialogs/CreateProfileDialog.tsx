import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileBasicInfo } from "./profile-steps/ProfileBasicInfo";
import { ProfileSystemPermissions } from "./profile-steps/ProfileSystemPermissions";
import { ProfileDataPermissions } from "./profile-steps/ProfileDataPermissions";

export interface ProfileCondition {
  id: string;
  attribute: string;
  operator: string;
  value: string;
}

export interface MenuPermission {
  menuId: string;
  menuName: string;
  description: string;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export interface ABACCondition {
  id: string;
  attribute: string;
  operator: string;
  value: string;
}

export interface DataPermissionRule {
  id: string;
  resourceId: string;
  resourceName: string;
  applyScope: "all" | "conditions";
  conditions: ABACCondition[];
  actions: string[];
}

export interface ProfileFormData {
  name: string;
  description: string;
  status: string;
  conditions: ProfileCondition[];
  systemPermissions: MenuPermission[];
  dataPermissions: DataPermissionRule[];
}

interface CreateProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProfileDialog({ open, onOpenChange }: CreateProfileDialogProps) {
  const { toast } = useToast();

  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    description: "",
    status: "active",
    conditions: [],
    systemPermissions: [],
    dataPermissions: [
      {
        id: `rule-${Date.now()}`,
        resourceId: "",
        resourceName: "",
        applyScope: "all",
        conditions: [],
        actions: [],
      },
    ],
  });

  const handleSubmit = () => {
    console.log("Create profile:", formData);
    toast({
      title: "Tạo profile thành công",
      description: `Profile "${formData.name}" đã được tạo.`,
    });
    onOpenChange(false);
    // Reset form
    setFormData({
      name: "",
      description: "",
      status: "active",
      conditions: [],
      systemPermissions: [],
      dataPermissions: [
        {
          id: `rule-${Date.now()}`,
          resourceId: "",
          resourceName: "",
          applyScope: "all",
          conditions: [],
          actions: [],
        },
      ],
    });
  };

  const updateFormData = (data: Partial<ProfileFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const isValid = () => {
    return formData.name.trim() !== "";
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-5xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">Tạo profile quyền mới</SheetTitle>
          <SheetDescription>
            Định nghĩa gói quyền có thể gán nhanh cho người dùng
          </SheetDescription>
        </SheetHeader>

        <div className="py-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Thông tin & Điều kiện</TabsTrigger>
              <TabsTrigger value="system">Quyền hệ thống</TabsTrigger>
              <TabsTrigger value="data">Quyền dữ liệu</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="mt-6">
              <ProfileBasicInfo data={formData} onChange={updateFormData} />
            </TabsContent>

            <TabsContent value="system" className="mt-6">
              <ProfileSystemPermissions data={formData} onChange={updateFormData} />
            </TabsContent>

            <TabsContent value="data" className="mt-6">
              <ProfileDataPermissions data={formData} onChange={updateFormData} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex justify-between gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setFormData({
                name: "",
                description: "",
                status: "active",
                conditions: [],
                systemPermissions: [],
                dataPermissions: [
                  {
                    id: `rule-${Date.now()}`,
                    resourceId: "",
                    resourceName: "",
                    applyScope: "all",
                    conditions: [],
                    actions: [],
                  },
                ],
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
            Tạo profile
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
