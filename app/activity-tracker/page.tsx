"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SledaiGrid } from "@/components/sledai/SledaiGrid";
import { useSledai } from "@/hooks/useSledai";

export default function ActivityTrackerPage() {
  const { records, isLoading, error, removeRecord } = useSledai();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto bg-secondary">
        {/* Page header */}
        <div className="sticky top-0 z-10 border-b border-border bg-secondary/80 backdrop-blur-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              {/* Mobile sidebar trigger */}
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" aria-label="Open navigation">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <AppSidebar />
                </SheetContent>
              </Sheet>

              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  Activity Tracker
                </h1>
                <p className="text-xs text-muted-foreground">
                  SLEDAI-2K disease activity records
                </p>
              </div>
            </div>

            <Button asChild size="sm" className="gap-2">
              <Link href="/activity-tracker/create">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Assessment</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <SledaiGrid
            records={records}
            isLoading={isLoading}
            onDelete={removeRecord}
          />
        </div>
      </div>
    </div>
  );
}
