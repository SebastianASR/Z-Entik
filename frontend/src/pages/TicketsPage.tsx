import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ticketsApi } from "../api/ticketsApi";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { TicketFilters } from "../components/tickets/TicketFilters";
import { TicketTable } from "../components/tickets/TicketTable";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/useAuth";
import type { Ticket, TicketPriority, TicketStatus } from "../types/ticket";

export function TicketsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | TicketStatus>("");
  const [priority, setPriority] = useState<"" | TicketPriority>("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadTickets(
    nextFilters: {
      search?: string;
      status?: "" | TicketStatus;
      priority?: "" | TicketPriority;
    } = {},
  ) {
    if (!token) return;
    setIsLoading(true);
    setError("");
    const activeSearch = nextFilters.search ?? search;
    const activeStatus = nextFilters.status ?? status;
    const activePriority = nextFilters.priority ?? priority;

    try {
      const response = await ticketsApi.list(token, {
        search: activeSearch || undefined,
        status: activeStatus || undefined,
        priority: activePriority || undefined,
      });
      setTickets(response.items);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No pudimos cargar los tickets.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      void loadTickets();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <DashboardLayout>
      <section className="content-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Bandeja HelpDesk</p>
            <h2>Tickets</h2>
          </div>
          <Button onClick={() => navigate("/tickets/new")}>Crear ticket</Button>
        </div>
        <TicketFilters
          search={search}
          status={status}
          priority={priority}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onPriorityChange={setPriority}
          onSubmit={() => void loadTickets()}
          onReset={() => {
            setSearch("");
            setStatus("");
            setPriority("");
            void loadTickets({ search: "", status: "", priority: "" });
          }}
        />
      </section>

      {error ? <Alert type="error" message={error} /> : null}
      {isLoading ? (
        <div className="loader-card">Cargando tickets...</div>
      ) : (
        <TicketTable tickets={tickets} />
      )}
    </DashboardLayout>
  );
}
