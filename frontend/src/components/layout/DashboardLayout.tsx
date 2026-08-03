import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { ActionLink } from "../ui/ActionLink";
import { Button } from "../ui/Button";
import { ThemeToggle } from "../ui/ThemeToggle";
import { AppFooter } from "./AppFooter";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="dashboard-shell">
      <aside className="sidebar">
        <ActionLink to="/" className="brand-mark">
          <span>Z</span>
          <div>
            <strong>Z-Entik</strong>
            <small>Z Labs</small>
          </div>
        </ActionLink>
        <nav className="sidebar-nav">
          <ActionLink to="/dashboard">Panel</ActionLink>
          <ActionLink to="/tickets">Tickets</ActionLink>
          <ActionLink to="/tickets/new">Crear ticket</ActionLink>
          <ActionLink to="/settings/security">Seguridad</ActionLink>
        </nav>
        <div className="sidebar-user">
          <small>Sesión activa</small>
          <strong>{user?.name}</strong>
          <span>{user?.email}</span>
        </div>
      </aside>
      <section className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">HelpDesk TI</p>
            <h1>Centro operativo Z-Entik</h1>
          </div>
          <div className="dashboard-header-actions">
            <ThemeToggle />
            <Button
              variant="ghost"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Cerrar sesión
            </Button>
          </div>
        </header>
        {children}
        <AppFooter />
      </section>
    </main>
  );
}
