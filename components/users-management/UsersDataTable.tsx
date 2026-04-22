"use client"

import { useState, useCallback } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { ArrowUpDown, Search, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useUsers } from "@/hooks/useUsers"
import type { UserOut, RoleEnum, AdminUpdateUserPayload } from "@/types"

const ROLES: RoleEnum[] = ["user", "member", "institution", "admin"]

const ROLE_BADGE_CLASS: Record<RoleEnum, string> = {
  admin: "bg-primary/15 text-primary border-primary/20",
  institution: "bg-violet-500/15 text-violet-600 border-violet-500/20 dark:text-violet-400",
  member: "bg-amber-500/15 text-amber-600 border-amber-500/20",
  user: "bg-muted text-muted-foreground border-border",
}

function RoleBadge({ role }: { role: RoleEnum | undefined }) {
  const r = role ?? "user"
  return (
    <Badge variant="outline" className={ROLE_BADGE_CLASS[r]}>
      {r}
    </Badge>
  )
}

function SortableHeader({
  label,
  column,
}: {
  label: string
  column: { toggleSorting: (desc?: boolean) => void; getIsSorted: () => false | "asc" | "desc" }
}) {
  return (
    <button
      type="button"
      className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  )
}

interface EditUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserOut
  onSave: (id: string, payload: AdminUpdateUserPayload) => Promise<void>
  t: ReturnType<typeof useTranslations>
}

function EditUserDialog({ open, onOpenChange, user, onSave, t }: EditUserDialogProps) {
  const [name, setName] = useState(user.name)
  const [gender, setGender] = useState<"male" | "female" | "">(user.gender ?? "")
  const [dob, setDob] = useState(user.dob ?? "")
  const [phone, setPhone] = useState(user.phone_number ?? "")
  const [role, setRole] = useState<RoleEnum>(user.role ?? "user")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      await onSave(user.id, {
        name: name.trim() || undefined,
        gender: gender || null,
        dob: dob || null,
        phone_number: phone.trim() || null,
        role,
      })
      toast.success(t("editSuccess"))
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("editError"))
    } finally {
      setSaving(false)
    }
  }

  const selectClass =
    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("editTitle")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="edit-email">{t("colEmail")}</Label>
            <Input
              id="edit-email"
              value={user.email}
              disabled
              className="bg-muted/50 text-muted-foreground font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-name">{t("editName")}</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("editNamePlaceholder")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-gender">{t("editGender")}</Label>
              <select
                id="edit-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as "male" | "female" | "")}
                className={selectClass}
              >
                <option value="">{t("editGenderPlaceholder")}</option>
                <option value="male">{t("editGenderMale")}</option>
                <option value="female">{t("editGenderFemale")}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-role">{t("colRole")}</Label>
              <select
                id="edit-role"
                value={role}
                onChange={(e) => setRole(e.target.value as RoleEnum)}
                className={selectClass}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r} className="capitalize">
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-dob">{t("editDob")}</Label>
            <Input
              id="edit-dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-phone">{t("editPhone")}</Label>
            <Input
              id="edit-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("editPhonePlaceholder")}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            {t("editCancel")}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? t("editSaving") : t("editSave")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface RowActionsProps {
  user: UserOut
  isSelf: boolean
  onUpdate: (id: string, payload: AdminUpdateUserPayload) => Promise<void>
  onDelete: (id: string) => Promise<void>
  t: ReturnType<typeof useTranslations>
}

function RowActions({ user, isSelf, onUpdate, onDelete, t }: RowActionsProps) {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("actionsLabel", { name: user.name })}
            className="h-8 w-8 text-muted-foreground"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setShowEdit(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            {t("actionEdit")}
          </DropdownMenuItem>
          {!isSelf && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setShowDelete(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("actionDelete")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <EditUserDialog
        open={showEdit}
        onOpenChange={setShowEdit}
        user={user}
        onSave={onUpdate}
        t={t}
      />

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDesc", { name: user.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("deleteCancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                onDelete(user.id).catch((err: Error) => toast.error(err.message))
              }
            >
              {t("deleteConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

type TranslationFn = ReturnType<typeof useTranslations>

function buildColumns(
  onUpdate: (id: string, payload: AdminUpdateUserPayload) => Promise<void>,
  onDelete: (id: string) => Promise<void>,
  currentUserId: string | undefined,
  t: TranslationFn
): ColumnDef<UserOut>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader label={t("colName")} column={column} />,
      cell: ({ row }) => (
        <span className="font-medium text-sm">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => <SortableHeader label={t("colEmail")} column={column} />,
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "role",
      header: () => (
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t("colRole")}
        </span>
      ),
      cell: ({ row }) => <RoleBadge role={row.original.role} />,
    },
    {
      accessorKey: "gender",
      header: () => (
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t("colGender")}
        </span>
      ),
      cell: ({ row }) => (
        <span className="text-sm capitalize text-muted-foreground">
          {row.original.gender ?? "—"}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => null,
      cell: ({ row }) => {
        const user = row.original
        return (
          <RowActions
            user={user}
            isSelf={user.id === currentUserId}
            onUpdate={onUpdate}
            onDelete={onDelete}
            t={t}
          />
        )
      },
    },
  ]
}

interface Props {
  currentUserId?: string
}

export function UsersDataTable({ currentUserId }: Props) {
  const { state, refetch, remove, update } = useUsers()
  const t = useTranslations("usersManagement")
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const handleUpdate = useCallback(
    async (id: string, payload: AdminUpdateUserPayload) => {
      await update(id, payload)
    },
    [update]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      await remove(id)
      toast.success(t("userRemoved"))
    },
    [remove, t]
  )

  const columns = buildColumns(handleUpdate, handleDelete, currentUserId, t)
  const data = state.status === "success" ? state.data : []

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  if (state.status === "loading" || state.status === "idle") {
    return (
      <div className="space-y-3">
        <Skeleton className="h-9 w-64" />
        <div className="rounded-lg border border-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 px-4 py-3 border-b border-border last:border-0">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-8" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (state.status === "error") {
    return (
      <Alert variant="destructive">
        <AlertDescription className="flex items-center justify-between">
          <span>{state.message}</span>
          <Button variant="outline" size="sm" onClick={refetch}>
            {t("retry")}
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  const rowCount = table.getFilteredRowModel().rows.length

  return (
    <div className="space-y-4 m-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
            className="pl-8 h-9"
            aria-label={t("searchPlaceholder")}
          />
        </div>
        <p className="text-sm text-muted-foreground ml-auto">
          {rowCount === 1 ? t("userCount", { count: rowCount }) : t("userCountPlural", { count: rowCount })}
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="hover:bg-transparent">
                {hg.headers.map((header) => (
                  <TableHead key={header.id} className="px-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  {t("noUsersFound")}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
