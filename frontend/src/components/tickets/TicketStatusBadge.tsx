import type { TicketStatus } from "../../types/ticket";
import { statusLabels } from "./ticketLabels";

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span
      className={`ticket-badge status-badge status-${status.toLowerCase()}`}
    >
      {statusLabels[status]}
    </span>
  );
}
