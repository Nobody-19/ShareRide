"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { api } from "./api";
import { useAuth } from "./auth-context";

interface ThemeContextValue {
  isDark: boolean;
  toggleDark: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function applyDark(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const { user, loading } = useAuth();
  const hasExplicitPref = useRef(false);

  // On first paint: an explicit local choice always wins, and is applied
  // immediately so there's no flash while the account loads.
  useEffect(() => {
    const stored = localStorage.getItem("shareride_theme");
    if (stored === "dark" || stored === "light") {
      hasExplicitPref.current = true;
      setIsDark(stored === "dark");
      applyDark(stored === "dark");
    }
  }, []);

  // Once the account is known, fall back to its saved preference — but only
  // if this device has no explicit choice of its own yet.
  useEffect(() => {
    if (loading || hasExplicitPref.current) return;
    if (user) {
      setIsDark(user.dark_mode);
      applyDark(user.dark_mode);
    }
  }, [user, loading]);

  const toggleDark = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      hasExplicitPref.current = true;
      applyDark(next);
      localStorage.setItem("shareride_theme", next ? "dark" : "light");
      api.put("/users/me", { dark_mode: next }).catch(() => {});
      return next;
    });
  }, []);

  return <ThemeContext.Provider value={{ isDark, toggleDark }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
