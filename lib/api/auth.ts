import { apiFetch } from "./client";
import type { UserLogin, UserRegister, Token, UserOut, UserUpdatePayload } from "@/types";

export async function login(data: UserLogin): Promise<Token> {
  return apiFetch<Token>("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function register(data: UserRegister): Promise<UserOut> {
  return apiFetch<UserOut>("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function getMe(): Promise<UserOut> {
  return apiFetch<UserOut>("/auth/me", {
    method: "GET",
  });
}

export async function updateProfile(data: UserUpdatePayload): Promise<UserOut> {
  return apiFetch<UserOut>("/auth/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
