import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ticketsApi } from "../api/ticketsApi";
import { AssignTicketControl } from "../components/tickets/AssignTicketControl";
import { TicketCommentForm } from "../components/tickets/TicketCommentForm";
import { TicketCommentList } from "../components/tickets/TicketCommentList";
import { TicketPriorityBadge } from "../components/tickets/TicketPriorityBadge";
import { TicketStatusBadge } from "../components/tickets/TicketStatusBadge";
import { UpdateTicketStatusControl } from "../components/tickets/UpdateTicketStatusControl";
import { categoryLabels } from "../components/tickets/ticketLabels";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/useAuth";
import type { Ticket, TicketStatus } from "../types/ticket";
import { formatRole, isDemoAdmin } from "../utils/roleLabels";

export function TicketDetailPage() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCommenting, setIsCommenting] = useState(false);

  async function loadTicket() {
    if (!token || !id) return;
    setIsLoading(true);
    setError("");

    try {
      const response = await ticketsApi.get(token, id);
      setTicket(response);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No pudimos cargar el ticket.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      void loadTicket();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, id]);

  async function updateStatus(status: TicketStatus) {
    if (!token || !ticket) return;
    setError("");
    setMessage("");

    try {
      const updated = await ticketsApi.updateStatus(token, ticket.id, status);
      setTicket(updated);
      setMessage("Estado actualizado correctamente.");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No pudimos actualizar el estado.",
      );
    }
  }

  async function assignTicket(assignedToId?: string) {
    if (!token || !ticket) return;
    setError("");
    setMessage("");

    try {
      const updated = await ticketsApi.assign(token, ticket.id, assignedToId);
      setTicket(updated);
      setMessage("Asignacion actualizada correctamente.");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No pudimos asignar el ticket.",
      );
    }
  }

  async function addComment(content: string) {
    if (!token || !ticket) return;
    setIsCommenting(true);
    setError("");
    setMessage("");

    try {
      await ticketsApi.addComment(token, ticket.id, content);
      await loadTicket();
      setMessage("Comentario publicado.");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No pudimos publicar el comentario.",
      );
    } finally {
      setIsCommenting(false);
    }
  }

  const isAdmin = user?.role === "ADMIN";
  const isTechnician = user?.role === "TECHNICIAN";
  const isAssignedTechnician =
    isTechnician && ticket?.assignedToId === user?.id;
  const canTakeTicket =
    isTechnician && ticket?.assignedToId === null && ticket.status === "OPEN";
  const canUpdateStatus = isAdmin || isAssignedTechnician;

  return (
    <DashboardLayout>
      {error ? <Alert type="error" message={error} /> : null}
      {message ? <Alert type="success" message={message} /> : null}

      {isLoading ? <div className="loader-card">Cargando ticket...</div> : null}

      {ticket ? (
        <>
          <section className="ticket-detail-hero">
            <div>
              <p className="eyebrow">Ticket #{ticket.id.slice(-6)}</p>
              <h2>{ticket.title}</h2>
              <p>{ticket.description}</p>
            </div>
            <div className="ticket-detail-badges">
              <TicketStatusBadge status={ticket.status} />
              <TicketPriorityBadge priority={ticket.priority} />
            </div>
          </section>

          {isDemoAdmin(user?.role) ? (
            <Alert
              type="warning"
              message="Demo Admin puede explorar la gestion, pero no ejecutar acciones destructivas ni asignaciones reales."
            />
          ) : null}

          <section className="panel-grid">
            <article className="content-panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Detalle operativo</p>
                  <h2>Informacion del ticket</h2>
                </div>
              </div>
              <dl className="detail-list">
                <div>
                  <dt>Categoria</dt>
                  <dd>{categoryLabels[ticket.category]}</dd>
                </div>
                <div>
                  <dt>Creado por</dt>
                  <dd>{ticket.createdBy.name}</dd>
                </div>
                <div>
                  <dt>Asignado a</dt>
                  <dd>
                    {ticket.assignedTo
                      ? `${ticket.assignedTo.name} (${formatRole(ticket.assignedTo.role)})`
                      : "Sin asignar"}
                  </dd>
                </div>
                <div>
                  <dt>Creado</dt>
                  <dd>{new Date(ticket.createdAt).toLocaleString()}</dd>
                </div>
              </dl>

              {canTakeTicket ? (
                <Button onClick={() => void assignTicket()}>
                  Tomar ticket
                </Button>
              ) : null}

              {canUpdateStatus ? (
                <UpdateTicketStatusControl
                  ticket={ticket}
                  onChange={updateStatus}
                />
              ) : null}

              {isAdmin && token ? (
                <AssignTicketControl
                  token={token}
                  ticket={ticket}
                  onAssign={assignTicket}
                />
              ) : null}

              {isDemoAdmin(user?.role) ? (
                <div className="inline-control disabled-demo-control">
                  <span>Asignacion y estados reales bloqueados para demo.</span>
                </div>
              ) : null}
            </article>

            <article className="content-panel">
              <p className="eyebrow">Conversacion</p>
              <h2>Comentarios</h2>
              <TicketCommentList comments={ticket.comments ?? []} />
              <TicketCommentForm
                isLoading={isCommenting}
                onSubmit={addComment}
              />
            </article>
          </section>
        </>
      ) : null}
    </DashboardLayout>
  );
}
