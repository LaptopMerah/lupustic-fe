"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { UpdateProfileDialog } from "@/components/layout/UpdateProfileDialog";
import type { RoleEnum } from "@/types";

const ROLE_STYLES: Record<RoleEnum, string> = {
  admin: "border-primary text-primary bg-primary/5",
  member: "border-blue-300 text-blue-600 bg-blue-50",
  institution: "border-red-300 text-red-600 bg-red-50",
  user: "border-border text-muted-foreground",
};

export default function ProfilePage() {
  const t = useTranslations("profile");
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updated, setUpdated] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-20 border-b border-border bg-secondary/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-6 py-4">
          <Button variant="ghost" size="icon" aria-label="Back" asChild>
            <Link href="/scan">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{t("title")}</h1>
            <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-6 py-8">
        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          {/* Header row */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <p className="text-sm font-semibold text-foreground">{user?.name ?? "—"}</p>
              <p className="text-xs text-muted-foreground">{user?.email ?? "—"}</p>
            </div>
            <div className="flex items-center gap-2">
              {user?.role && (
                <Badge
                  variant="outline"
                  className={cn("capitalize text-[10px]", ROLE_STYLES[user.role])}
                >
                  {user.role}
                </Badge>
              )}
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-px bg-border">
            <InfoCell label={t("gender")} value={user?.gender ? t(`gender${user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}` as "genderMale" | "genderFemale") : "—"} />
            <InfoCell label={t("dob")} value={user?.dob ?? "—"} mono />
            <InfoCell label={t("phone")} value={user?.phone_number ?? "—"} mono />
            <InfoCell
              label={t("memberSince")}
              value={
                user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  })
                  : "—"
              }
              mono
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 bg-secondary/40">
          {!updated && <span />}
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => { setUpdated(false); setDialogOpen(true); }}
          >
            <Pencil className="h-3.5 w-3.5" />
            {t("editButton")}
          </Button>
        </div>
      </div>

      <UpdateProfileDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={() => setUpdated(true)}
      />
    </>
  );
}

function InfoCell({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5 bg-card px-5 py-3">
      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className={cn("text-sm text-foreground", mono && "font-mono")}>
        {value}
      </span>
    </div>
  );
}
