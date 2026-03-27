"use client";

import { useCallback, useEffect, useState } from "react";
import { getAdminAuthState, getAdminPassword, setAdminAuthState } from "../lib/storage";

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsAuthenticated(getAdminAuthState());
    setIsReady(true);
  }, []);

  const login = useCallback((password: string) => {
    const ok = password === getAdminPassword();
    if (!ok) return false;
    setAdminAuthState(true);
    setIsAuthenticated(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    setAdminAuthState(false);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, isReady, login, logout };
}
