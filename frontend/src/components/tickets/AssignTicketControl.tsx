import { useEffect, useState } from "react";
import { ticketsApi } from "../../api/ticketsApi";
import type { Ticket, TicketUser } from "../../types/ticket";
import { Button } from "../ui/Button";

type AssignTicketControlProps = {
  token: string;
  ticket: Ticket;
  disabled?: boolean;
  onAssign: (assignedToId?: string) => Promise<void>;
};

export function AssignTicketControl({
  token,
  ticket,
  disabled = false,
  onAssign,
}: AssignTicketControlProps) {
  const [technicians, setTechnicians] = useState<TicketUser[]>([]);
  const [assignedToId, setAssignedToId] = useState(ticket.assignedToId ?? "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    ticketsApi
      .technicians(token)
      .then(setTechnicians)
      .catch(() => setTechnicians([]));
  }, [token]);

  async function handleAssign() {
    setIsLoading(true);
    try {
      await onAssign(assignedToId || undefined);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="inline-control">
      <label>
        <span>Tecnico asignado</span>
        <select
          value={assignedToId}
          disabled={disabled}
          onChange={(event) => setAssignedToId(event.target.value)}
        >
          <option value="">Selecciona tecnico</option>
          {technicians.map((technician) => (
            <option key={technician.id} value={technician.id}>
              {technician.name}
            </option>
          ))}
        </select>
      </label>
      <Button
        type="button"
        disabled={disabled || isLoading || !assignedToId}
        onClick={() => void handleAssign()}
      >
        {isLoading ? "Asignando..." : "Asignar ticket"}
      </Button>
    </div>
  );
}
