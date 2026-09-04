import api from "./api";

export const register = (userData) =>
  api.post("/api/auth/register", userData).then((res) => res.data);

export const login = (credentials) =>
  api.post("/api/auth/login", credentials).then((res) => res.data);

export const forgotPassword = (email) =>
  api.post("/api/auth/forgot-password", { email }).then((res) => res.data);

export const resetPassword = (token, password) =>
  api.patch(`/api/auth/reset-password/${token}`, { password }).then((res) => res.data);
