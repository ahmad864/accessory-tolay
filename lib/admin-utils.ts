"use client"

import { useAuth } from "./auth-store"

export function useAdminCheck() {
  const { isAdmin, isAuthenticated } = useAuth()

  return {
    isAdmin: isAdmin(),
    isAuthenticated,
    canAccessAdmin: isAuthenticated && isAdmin(),
  }
}

export function requireAdmin() {
  const { canAccessAdmin } = useAdminCheck()

  if (!canAccessAdmin) {
    throw new Error("Access denied: Admin privileges required")
  }

  return true
}
