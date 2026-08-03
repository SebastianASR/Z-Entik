import type { TicketPriority } from "../../types/ticket";
import { priorityLabels } from "./ticketLabels";

export function TicketPriorityBadge({
  priority,
}: {
  priority: TicketPriority;
}) {
  return (
    <span
      className={`ticket-badge priority-badge priority-${priority.toLowerCase()}`}
    >
      {priorityLabels[priority]}
    </span>
  );
}
