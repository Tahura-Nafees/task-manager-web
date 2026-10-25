import api from "./client";

export interface AuthPayload {
  email: string;
  password: string;
}

export const loginRequest = (data: AuthPayload) =>
  api.post<{ accessToken: string }>("/auth/login", data).then((r) => r.data);

export const registerRequest = (data: AuthPayload) =>
  api.post<{ accessToken: string }>("/auth/register", data).then((r) => r.data);
