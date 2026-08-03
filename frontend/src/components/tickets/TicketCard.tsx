import { Link } from "react-router-dom";
import type { Ticket } from "../../types/ticket";
import { formatRole } from "../../utils/roleLabels";
import { TicketPriorityBadge } from "./TicketPriorityBadge";
import { TicketStatusBadge } from "./TicketStatusBadge";
import { categoryLabels } from "./ticketLabels";

export function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <article className="ticket-card">
      <div className="ticket-card-top">
        <TicketStatusBadge status={ticket.status} />
        <TicketPriorityBadge priority={ticket.priority} />
      </div>
      <Link to={`/tickets/${ticket.id}`} className="ticket-title-link">
        {ticket.title}
      </Link>
      <p>{ticket.description}</p>
      <div className="ticket-meta-grid">
        <span>Categoria: {categoryLabels[ticket.category]}</span>
        <span>Creado por: {ticket.createdBy.name}</span>
        <span>
          Asignado:{" "}
          {ticket.assignedTo
            ? `${ticket.assignedTo.name} (${formatRole(ticket.assignedTo.role)})`
            : "Sin asignar"}
        </span>
        <span>
          Comentarios: {ticket._count?.comments ?? ticket.comments?.length ?? 0}
        </span>
      </div>
    </article>
  );
}
