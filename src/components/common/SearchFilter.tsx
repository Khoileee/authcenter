import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface SearchFilterProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: () => void;
  onReset?: () => void;
  placeholder?: string;
  children?: ReactNode;
}

export function SearchFilter({
  searchValue,
  onSearchChange,
  onSearch,
  onReset,
  placeholder = "Tìm kiếm...",
  children,
}: SearchFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 bg-card/50 border border-border/50 rounded-xl">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch?.()}
          className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/20 transition-all shadow-sm hover:bg-background/80"
        />
      </div>
      
      {children}
      
      <div className="flex gap-2">
        <Button 
          variant="default" 
          onClick={onSearch}
          className="gap-2"
        >
          <Search className="h-4 w-4" />
          Tìm kiếm
        </Button>
        <Button 
          variant="outline" 
          onClick={onReset}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Làm mới
        </Button>
      </div>
    </div>
  );
}
