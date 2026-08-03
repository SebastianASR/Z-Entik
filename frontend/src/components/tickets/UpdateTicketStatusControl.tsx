import { useState } from "react";
import type { Ticket, TicketStatus } from "../../types/ticket";
import { Button } from "../ui/Button";
import { statusLabels } from "./ticketLabels";

type UpdateTicketStatusControlProps = {
  ticket: Ticket;
  disabled?: boolean;
  onChange: (status: TicketStatus) => Promise<void>;
};

const statuses = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;

export function UpdateTicketStatusControl({
  ticket,
  disabled = false,
  onChange,
}: UpdateTicketStatusControlProps) {
  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    try {
      await onChange(status);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="inline-control">
      <label>
        <span>Estado</span>
        <select
          value={status}
          disabled={disabled}
          onChange={(event) => setStatus(event.target.value as TicketStatus)}
        >
          {statuses.map((item) => (
            <option key={item} value={item}>
              {statusLabels[item]}
            </option>
          ))}
        </select>
      </label>
      <Button
        type="button"
        disabled={disabled || isLoading || status === ticket.status}
        onClick={() => void handleClick()}
      >
        {isLoading ? "Actualizando..." : "Actualizar estado"}
      </Button>
    </div>
  );
}
