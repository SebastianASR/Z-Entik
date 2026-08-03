import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ticketsApi } from "../api/ticketsApi";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { ActionLink } from "../components/ui/ActionLink";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { StatusPill } from "../components/ui/StatusPill";
import { useAuth } from "../context/useAuth";
import type { TicketSummary } from "../types/ticket";
import { formatRole, isDemoAdmin } from "../utils/roleLabels";

const emptySummary: TicketSummary = {
  total: 0,
  open: 0,
  inProgress: 0,
  resolved: 0,
  closed: 0,
  critical: 0,
  assignedToMe: 0,
};

export function DashboardPage() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<TicketSummary>(emptySummary);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    ticketsApi
      .summary(token)
      .then(setSummary)
      .catch((caughtError) => {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "No pudimos cargar el resumen de tickets.",
        );
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  const summaryCards = [
    { label: "Total tickets", value: summary.total, tone: "cyan" },
    { label: "Abiertos", value: summary.open, tone: "blue" },
    { label: "En progreso", value: summary.inProgress, tone: "teal" },
    { label: "Resueltos", value: summary.resolved, tone: "green" },
    { label: "Criticos", value: summary.critical, tone: "red" },
  ];

  return (
    <DashboardLayout>
      {error ? <Alert type="error" message={error} /> : null}
      <section className="dashboard-grid">
        {summaryCards.map((card) => (
          <article
            className={`metric-card metric-${card.tone}`}
            key={card.label}
          >
            <span>{card.label}</span>
            <strong>{isLoading ? "..." : card.value}</strong>
            <small>Datos reales segun tu rol</small>
          </article>
        ))}
      </section>

      <section className="panel-grid">
        <article className="content-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Estado de cuenta</p>
              <h2>{user?.name}</h2>
            </div>
            <StatusPill tone={user?.isDemo ? "warn" : "good"}>
              {user?.isDemo ? "Cuenta demo" : "Cuenta real"}
            </StatusPill>
          </div>
          <dl className="detail-list">
            <div>
              <dt>Correo</dt>
              <dd>{user?.email}</dd>
            </div>
            <div>
              <dt>Rol</dt>
              <dd>{formatRole(user?.role)}</dd>
            </div>
            <div>
              <dt>Asignados a mi</dt>
              <dd>{summary.assignedToMe}</dd>
            </div>
            <div>
              <dt>2FA</dt>
              <dd>{user?.isTwoFactorEnabled ? "Activado" : "Desactivado"}</dd>
            </div>
          </dl>
          <div className="button-row">
            <Button onClick={() => navigate("/tickets")}>Ver tickets</Button>
            <ActionLink className="button button-secondary" to="/tickets/new">
              Crear ticket
            </ActionLink>
            <ActionLink className="button button-ghost" to="/settings/security">
              Seguridad
            </ActionLink>
          </div>
          {isDemoAdmin(user?.role) ? (
            <p className="muted-text">
              Esta cuenta demo permite explorar vistas administrativas, pero no
              puede ejecutar acciones destructivas.
            </p>
          ) : null}
        </article>

        <article className="content-panel operations-panel">
          <p className="eyebrow">Operacion TI</p>
          <h2>Flujo HelpDesk activo</h2>
          <p>
            Los tickets ya se filtran por rol: usuarios ven sus solicitudes,
            técnicos ven asignados o sin asignar, y administración ve el
            panorama completo.
          </p>
          <div className="timeline">
            <span>Ingreso</span>
            <span>Asignacion</span>
            <span>Resolucion</span>
          </div>
        </article>
      </section>
    </DashboardLayout>
  );
}
