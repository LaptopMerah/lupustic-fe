import { apiFetch } from "./client";
import { UserLogin, UserRegister, Token, UserOut, ResponseWrapper } from "@/types";

export async function login(data: UserLogin): Promise<Token> {
  const response = await apiFetch<ResponseWrapper<Token>>("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.data;
}

export async function register(data: UserRegister): Promise<UserOut> {
  const response = await apiFetch<ResponseWrapper<UserOut>>("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.data;
}

export async function getMe(): Promise<UserOut> {
  const response = await apiFetch<ResponseWrapper<UserOut>>("/auth/me", {
    method: "GET",
  });
  return response.data;
}
