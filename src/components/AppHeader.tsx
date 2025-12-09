import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  title: string;
}

export function AppHeader({ title }: AppHeaderProps) {
  return (
    <header className="h-16 border-b border-border/40 bg-white backdrop-blur-xl flex items-center justify-between px-6 z-10">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="hover:bg-primary/10 hover:text-primary transition-colors" />
        <h1 className="text-xl font-bold text-foreground tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <Input
            placeholder="Tìm kiếm..."
            className="pl-10 w-72 bg-background/50 border-border/50 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all hover:bg-background/80"
          />
        </div>

        <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full animate-pulse" />
        </Button>

        <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-colors">
          <Settings className="h-5 w-5" />
        </Button>

        <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-border/50 hover:ring-primary transition-all duration-300">
          <AvatarFallback className="bg-gradient-to-br from-primary to-indigo-600 text-primary-foreground font-bold">
            AD
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
