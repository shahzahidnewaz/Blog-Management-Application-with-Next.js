"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { login as loginApi, register as registerApi } from "@/services/auth.service";
import { getOwnProfile } from "@/services/user.service";
import { getToken, setToken, clearAuth, getStoredUser, setStoredUser } from "@/utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const res = await getOwnProfile();
      setUser(res.data);
      setStoredUser(res.data);
      return res.data;
    } catch {
      clearAuth();
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setInitializing(false);
      return;
    }
    
    const cached = getStoredUser();
    if (cached) setUser(cached);
    loadProfile().finally(() => setInitializing(false));
  }, [loadProfile]);

  const login = useCallback(async (credentials) => {
    const res = await loginApi(credentials);
    setToken(res.data.token);
    setStoredUser(res.data.user);
    setUser(res.data.user);
    await loadProfile();
    return res.data.user;
  }, [loadProfile]);

  const register = useCallback((payload) => registerApi(payload), []);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
  }, []);

  const refreshProfile = useCallback(() => loadProfile(), [loadProfile]);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
    initializing,
    login,
    register,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
