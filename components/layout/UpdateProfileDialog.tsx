"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateProfile } from "@/lib/api/auth";
import { useAuth } from "@/hooks/useAuth";
import type { UserUpdatePayload } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UpdateProfileDialog({ open, onClose, onSuccess }: Props) {
  const t = useTranslations("profile");
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open && user) {
      setName(user.name ?? "");
      setGender(user.gender ?? "");
      setDob(user.dob ?? "");
      setPhone(user.phone_number ?? "");
    }
  }, [open, user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);

    const payload: UserUpdatePayload = {};
    if (name.trim() !== (user?.name ?? "")) payload.name = name.trim();
    if (gender !== (user?.gender ?? "")) payload.gender = gender || null;
    if (dob !== (user?.dob ?? "")) payload.dob = dob || null;
    if (phone.trim() !== (user?.phone_number ?? "")) payload.phone_number = phone.trim() || null;

    if (Object.keys(payload).length === 0) {
      onClose();
      setIsSaving(false);
      return;
    }

    try {
      await updateProfile(payload);
      toast.success(t("saveSuccess"));
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("errorSave"));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("editSection")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="up-name">{t("name")}</Label>
            <Input
              id="up-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="up-gender">{t("gender")}</Label>
            <select
              id="up-gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as "male" | "female" | "")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">{t("genderPlaceholder")}</option>
              <option value="male">{t("genderMale")}</option>
              <option value="female">{t("genderFemale")}</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="up-dob">{t("dob")}</Label>
            <Input
              id="up-dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="up-phone">{t("phone")}</Label>
            <Input
              id="up-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("phonePlaceholder")}
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? t("saving") : t("save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
