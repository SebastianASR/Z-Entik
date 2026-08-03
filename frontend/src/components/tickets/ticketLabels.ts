import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "../../types/ticket";

export const statusLabels: Record<TicketStatus, string> = {
  OPEN: "Abierto",
  IN_REVIEW: "En revision",
  IN_PROGRESS: "En progreso",
  ON_HOLD: "En espera",
  RESOLVED: "Resuelto",
  CLOSED: "Cerrado",
};

export const priorityLabels: Record<TicketPriority, string> = {
  LOW: "Baja",
  MEDIUM: "Media",
  HIGH: "Alta",
  CRITICAL: "Critica",
};

export const categoryLabels: Record<TicketCategory, string> = {
  HARDWARE: "Hardware",
  SOFTWARE: "Software",
  NETWORK: "Red",
  ACCOUNT: "Cuenta",
  ACCESS: "Acceso",
  SECURITY: "Seguridad",
  OTHER: "Otro",
};
