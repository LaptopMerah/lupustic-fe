"use client"

import { redirect } from "next/navigation"
import { useTranslations } from "next-intl"
import { useAuth } from "@/hooks/useAuth"
import { UsersDataTable } from "@/components/users-management/UsersDataTable"
import { Skeleton } from "@/components/ui/skeleton"

export default function UsersManagementPage() {
  const { user, isLoading } = useAuth()
  const t = useTranslations("usersManagement")

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    redirect("/")
  }

  return (
    <>
      <div className="sticky top-0 z-10 border-b border-border bg-secondary/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold text-foreground">
            {t("pageTitle")}
          </h1>
        </div>
      </div>

      <UsersDataTable currentUserId={user.id} />
    </>
  )
}
