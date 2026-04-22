"use client"

import { useState, useCallback, useEffect } from "react"
import { listUsers, deleteUser, updateUser } from "@/lib/api/users"
import type { AsyncState, UserOut, AdminUpdateUserPayload } from "@/types"

export function useUsers() {
  const [state, setState] = useState<AsyncState<UserOut[]>>({ status: "idle" })

  const fetch = useCallback(async () => {
    setState({ status: "loading" })
    try {
      const data = await listUsers()
      setState({ status: "success", data })
    } catch (err) {
      setState({ status: "error", message: "Failed to load users. Please try again." })
      console.error("[useUsers]", err)
    }
  }, [])

  const remove = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteUser(id)
      setState((prev) => {
        if (prev.status !== "success") return prev
        return { status: "success", data: prev.data.filter((u) => u.id !== id) }
      })
    } catch (err) {
      console.error("[useUsers.remove]", err)
      throw new Error("Failed to delete user. Please try again.")
    }
  }, [])

  const update = useCallback(async (id: string, payload: AdminUpdateUserPayload): Promise<void> => {
    try {
      const updated = await updateUser(id, payload)
      setState((prev) => {
        if (prev.status !== "success") return prev
        return { status: "success", data: prev.data.map((u) => (u.id === id ? updated : u)) }
      })
    } catch (err) {
      console.error("[useUsers.update]", err)
      throw new Error("Failed to update user. Please try again.")
    }
  }, [])

  useEffect(() => {
    fetch().catch(() => {})
  }, [fetch])

  return { state, refetch: fetch, remove, update }
}
