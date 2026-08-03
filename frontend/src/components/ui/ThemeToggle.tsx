import { useEffect, useState } from "react";
import {
  applyTheme,
  getStoredTheme,
  saveTheme,
  type ThemeMode,
} from "../../utils/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(() => getStoredTheme());
  const nextTheme = theme === "dark" ? "light" : "dark";

  useEffect(() => {
    applyTheme(theme);
    saveTheme(theme);
  }, [theme]);

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={`Cambiar a modo ${nextTheme === "light" ? "claro" : "oscuro"}`}
      onClick={() => setTheme(nextTheme)}
    >
      <span aria-hidden="true">{theme === "dark" ? "Claro" : "Oscuro"}</span>
    </button>
  );
}
