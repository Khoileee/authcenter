import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, Copy, Settings, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const actionButtonClass = "h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10";
const destructiveButtonClass = "h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10";

interface ActionButtonProps {
  onClick?: () => void;
  title?: string;
  className?: string;
}

export function ViewButton({ onClick, title = "Xem chi tiết", className }: ActionButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(actionButtonClass, className)}
      onClick={onClick}
      title={title}
    >
      <Eye className="h-4 w-4" />
    </Button>
  );
}

export function EditButton({ onClick, title = "Chỉnh sửa", className }: ActionButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(actionButtonClass, className)}
      onClick={onClick}
      title={title}
    >
      <Pencil className="h-4 w-4" />
    </Button>
  );
}

export function DeleteButton({ onClick, title = "Xóa", className }: ActionButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(destructiveButtonClass, className)}
      onClick={onClick}
      title={title}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

export function CopyButton({ onClick, title = "Sao chép", className }: ActionButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(actionButtonClass, className)}
      onClick={onClick}
      title={title}
    >
      <Copy className="h-4 w-4" />
    </Button>
  );
}

export function SettingsButton({ onClick, title = "Cấu hình", className }: ActionButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(actionButtonClass, className)}
      onClick={onClick}
      title={title}
    >
      <Settings className="h-4 w-4" />
    </Button>
  );
}

export function PermissionButton({ onClick, title = "Phân quyền", className }: ActionButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8 p-0 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-600/10", className)}
      onClick={onClick}
      title={title}
    >
      <ShieldCheck className="h-4 w-4" />
    </Button>
  );
}

interface ActionButtonsContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ActionButtonsContainer({ children, className }: ActionButtonsContainerProps) {
  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      {children}
    </div>
  );
}
