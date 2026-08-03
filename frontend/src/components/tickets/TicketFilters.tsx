import type { FormEvent } from "react";
import type { TicketPriority, TicketStatus } from "../../types/ticket";
import { Button } from "../ui/Button";
import { priorityLabels, statusLabels } from "./ticketLabels";

type TicketFiltersProps = {
  search: string;
  status: "" | TicketStatus;
  priority: "" | TicketPriority;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: "" | TicketStatus) => void;
  onPriorityChange: (value: "" | TicketPriority) => void;
  onSubmit: () => void;
  onReset: () => void;
};

const statuses = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;
const priorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

export function TicketFilters({
  search,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onSubmit,
  onReset,
}: TicketFiltersProps) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="ticket-filters" onSubmit={handleSubmit}>
      <label>
        <span>Busqueda</span>
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por titulo o descripcion"
        />
      </label>
      <label>
        <span>Estado</span>
        <select
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value as "" | TicketStatus)
          }
        >
          <option value="">Todos</option>
          {statuses.map((item) => (
            <option key={item} value={item}>
              {statusLabels[item]}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Prioridad</span>
        <select
          value={priority}
          onChange={(event) =>
            onPriorityChange(event.target.value as "" | TicketPriority)
          }
        >
          <option value="">Todas</option>
          {priorities.map((item) => (
            <option key={item} value={item}>
              {priorityLabels[item]}
            </option>
          ))}
        </select>
      </label>
      <div className="filter-actions">
        <Button type="submit">Filtrar</Button>
        <Button type="button" variant="ghost" onClick={onReset}>
          Limpiar
        </Button>
      </div>
    </form>
  );
}
