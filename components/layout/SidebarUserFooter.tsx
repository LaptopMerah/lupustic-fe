"use client";

import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useSidebarCollapsed } from "@/components/layout/SidebarProvider";

export function SidebarUserFooter() {
  const { user, logout, isLoading } = useAuth();
  const { collapsed } = useSidebarCollapsed();

  if (isLoading || !user) return null;

  return (
    <div className="shrink-0">
      <Separator />
      <div className={cn("flex items-center gap-2 px-3 py-3", collapsed ? "flex-col" : "justify-between")}>
        <div className={cn("flex items-center gap-2 min-w-0", collapsed && "flex-col")}>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-3.5 w-3.5" />
          </div>
          {!collapsed && (
            <span className="truncate text-xs font-medium text-foreground">
              {user.name}
            </span>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          aria-label="Logout"
          title="Logout"
          className="h-7 w-7 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
