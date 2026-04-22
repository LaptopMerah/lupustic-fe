"use client";

import { LogOut, MoreHorizontal, UserPen, User, Globe, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useSidebarCollapsed } from "@/components/layout/SidebarProvider";
import type { RoleEnum } from "@/types";

const ROLE_STYLES: Record<RoleEnum, string> = {
  admin:       "border-primary text-primary bg-primary/5",
  member:      "border-blue-300 text-blue-600 bg-blue-50",
  institution: "border-red-300 text-red-600 bg-red-50",
  user:        "",
};

const LOCALES = [
  { code: "en", label: "English", short: "EN" },
  { code: "id", label: "Indonesia", short: "ID" },
] as const;

export function SidebarUserFooter() {
  const { user, logout, isLoading } = useAuth();
  const { collapsed } = useSidebarCollapsed();
  const router = useRouter();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  function switchLocale(newLocale: string) {
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    startTransition(() => {
      router.refresh();
    });
  }

  const currentLocale = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

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
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate text-xs font-medium text-foreground">
                {user.name}
              </span>
              {user.role && user.role !== "user" && (
                <Badge
                  variant="outline"
                  className={cn("w-fit capitalize text-[10px] px-1.5 py-0", ROLE_STYLES[user.role])}
                >
                  {user.role}
                </Badge>
              )}
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="User menu"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="end" className="w-44">
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onSelect={() => router.push("/profile")}
            >
              <UserPen className="h-3.5 w-3.5" />
              Update Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="gap-2 cursor-pointer">
                <Globe className="h-3.5 w-3.5" />
                Language
                <span className="ml-auto text-[10px] font-medium text-muted-foreground">
                  {currentLocale.short}
                </span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-36">
                {LOCALES.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    disabled={isPending}
                    className="flex items-center justify-between gap-2 cursor-pointer"
                    onSelect={() => switchLocale(l.code)}
                  >
                    <span className="text-sm">{l.label}</span>
                    {locale === l.code && <Check className="h-3.5 w-3.5 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 cursor-pointer text-destructive focus:text-destructive"
              onSelect={logout}
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
