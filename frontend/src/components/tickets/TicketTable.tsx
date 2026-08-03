import type { Ticket } from "../../types/ticket";
import { TicketCard } from "./TicketCard";

export function TicketTable({ tickets }: { tickets: Ticket[] }) {
  if (!tickets.length) {
    return (
      <div className="empty-state">
        <h2>No hay tickets para mostrar.</h2>
        <p>
          Crea un ticket o ajusta los filtros para revisar otros resultados.
        </p>
      </div>
    );
  }

  return (
    <section className="tickets-list">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </section>
  );
}
