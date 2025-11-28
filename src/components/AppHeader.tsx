import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  title: string;
}

export function AppHeader({ title }: AppHeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="hover:bg-accent/10" />
        <h1 className="text-xl font-semibold text-foreground tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm..."
            className="pl-10 w-72 bg-background/50 border-border focus-visible:ring-primary transition-all"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="hover:bg-accent/10">
          <Settings className="h-5 w-5" />
        </Button>

        <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-border hover:ring-primary transition-all">
          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
            AD
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
