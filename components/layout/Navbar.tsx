"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, LogOut, User } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import LogoImg from "@/app/Lupustic.png";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();

  // Auto-detect session ID from /chat/[uuid] routes
  const sessionId = useMemo(() => {
    const match = pathname.match(/^\/chat\/(.+)$/);
    return match ? match[1] : null;
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-secondary/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src={LogoImg} alt="Lupustic Logo" className="h-12 w-auto scale-150" priority />
        </Link>

        {/* Session ID (chat pages only) */}
        {sessionId && (
          <span className="hidden text-xs font-mono text-muted-foreground md:block">
            Session #{sessionId.slice(0, 8)}
          </span>
        )}

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          {!isLoading && (
            user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" /> {user.name}
                </span>
                <Button variant="ghost" size="sm" onClick={logout} className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive">
                  <LogOut className="h-4 w-4" /> Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )
          )}
        </div>

        {/* Mobile Hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <SheetTitle className="flex items-center">
              <Image src={LogoImg} alt="Lupustic Logo" className="h-8 w-auto" />
            </SheetTitle>
            
            <div className="mt-8 flex flex-col gap-4">
              {!isLoading && (
                user ? (
                  <>
                    <div className="text-sm font-medium text-muted-foreground flex items-center gap-2 px-2">
                      <User className="h-4 w-4" /> {user.name}
                    </div>
                    <Button variant="ghost" onClick={() => { logout(); setOpen(false); }} className="justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive">
                      <LogOut className="h-4 w-4" /> Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="justify-start" asChild onClick={() => setOpen(false)}>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button className="justify-start" asChild onClick={() => setOpen(false)}>
                      <Link href="/register">Register</Link>
                    </Button>
                  </>
                )
              )}
            </div>

            {sessionId && (
              <div className="mt-6 border-t border-border pt-4">
                <span className="text-xs font-mono text-muted-foreground">
                  Session #{sessionId.slice(0, 8)}
                </span>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
