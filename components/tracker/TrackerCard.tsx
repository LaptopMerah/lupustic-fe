"use client";

import { useState } from "react";
import { MapPin, MoreVertical, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TrackerDeleteConfirm } from "./TrackerDeleteConfirm";
import type { TrackerEntry } from "@/types";

interface TrackerCardProps {
  entry: TrackerEntry;
  onDelete: (id: string) => Promise<void>;
}

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function getImageUrl(imagePath: string): string {
  // If already an absolute URL (e.g. blob: or http), use as-is
  if (imagePath.startsWith("http") || imagePath.startsWith("blob:")) {
    return imagePath;
  }
  // Prepend the API base URL for relative paths from the backend
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  return `${baseUrl}${imagePath}`;
}

export function TrackerCard({ entry, onDelete }: TrackerCardProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await onDelete(entry.id);
    } catch {
      // error handled in hook
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  }

  return (
    <>
      <Card className="group overflow-hidden border border-border bg-card transition-all duration-200 hover:shadow-md hover:border-primary/30">
        {/* Image */}
        <div className="relative aspect-4/3 w-full overflow-hidden">
          <img
            src={getImageUrl(entry.image)}
            alt={`Symptom at ${entry.name}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <CardContent className="p-4">
          {/* Header: location + menu */}
          <div className="mb-1 flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="truncate">{entry.name}</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setDeleteOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Date */}
          <p className="mb-3 text-xs font-mono text-muted-foreground">
            {formatDateTime(entry.datetime)}
          </p>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {entry.desc}
          </p>
        </CardContent>
      </Card>

      <TrackerDeleteConfirm
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
