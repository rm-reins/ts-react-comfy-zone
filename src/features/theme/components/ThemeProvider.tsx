import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useAppSelector((state) => state.themeState);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}
