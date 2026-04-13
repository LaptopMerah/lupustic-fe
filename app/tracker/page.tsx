"use client";

import { useState } from "react";
import { Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useTracker } from "@/hooks/useTracker";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TrackerGrid } from "@/components/tracker/TrackerGrid";
import { TrackerFormModal } from "@/components/tracker/TrackerFormModal";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function TrackerPage() {
  const { entries, isLoading, error, addEntry, removeEntry } = useTracker();
  const [modalOpen, setModalOpen] = useState(false);
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
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <AppSidebar />
                </SheetContent>
              </Sheet>

              <h1 className="text-xl font-semibold text-foreground">
                My Symptom Tracker
              </h1>
            </div>

            <Button
              onClick={() => setModalOpen(true)}
              className="gap-2"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Entry</span>
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

          <TrackerGrid
            entries={entries}
            isLoading={isLoading}
            onDelete={removeEntry}
            onAddEntry={() => setModalOpen(true)}
          />
        </div>
      </div>

      {/* Form modal */}
      <TrackerFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={addEntry}
      />
    </div>
  );
}
