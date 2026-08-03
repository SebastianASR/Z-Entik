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
  const isLight = theme === "light";

  useEffect(() => {
    applyTheme(theme);
    saveTheme(theme);
  }, [theme]);

  return (
    <button
      type="button"
      className={`theme-toggle ${isLight ? "theme-toggle-light" : "theme-toggle-dark"}`}
      aria-label={`Cambiar a modo ${nextTheme === "light" ? "claro" : "oscuro"}`}
      aria-pressed={isLight}
      onClick={() => setTheme(nextTheme)}
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <span className="theme-toggle-icon theme-toggle-sun">☀</span>
        <span className="theme-toggle-icon theme-toggle-moon">☾</span>
        <span className="theme-toggle-thumb">{isLight ? "☀" : "☾"}</span>
      </span>
      <span className="theme-toggle-label">{isLight ? "Claro" : "Oscuro"}</span>
    </button>
  );
}
