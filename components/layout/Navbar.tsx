"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import LogoImg from "@/app/Lupustic.png";



export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
