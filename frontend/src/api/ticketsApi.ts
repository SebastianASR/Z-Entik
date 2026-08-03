import { apiRequest } from "./http";
import type { TicketUser } from "../types/ticket";
import type {
  CreateTicketPayload,
  Ticket,
  TicketComment,
  TicketListResponse,
  TicketQuery,
  TicketStatus,
  TicketSummary,
} from "../types/ticket";

function buildQuery(query: TicketQuery = {}) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export const ticketsApi = {
  list(token: string, query?: TicketQuery) {
    return apiRequest<TicketListResponse>(`/tickets${buildQuery(query)}`, {
      token,
    });
  },
  summary(token: string) {
    return apiRequest<TicketSummary>("/tickets/stats/summary", { token });
  },
  get(token: string, id: string) {
    return apiRequest<Ticket>(`/tickets/${id}`, { token });
  },
  create(token: string, payload: CreateTicketPayload) {
    return apiRequest<Ticket>("/tickets", {
      method: "POST",
      token,
      body: payload,
    });
  },
  updateStatus(token: string, id: string, status: TicketStatus) {
    return apiRequest<Ticket>(`/tickets/${id}/status`, {
      method: "PATCH",
      token,
      body: { status },
    });
  },
  assign(token: string, id: string, assignedToId?: string) {
    return apiRequest<Ticket>(`/tickets/${id}/assign`, {
      method: "PATCH",
      token,
      body: assignedToId ? { assignedToId } : {},
    });
  },
  addComment(token: string, id: string, content: string) {
    return apiRequest<TicketComment>(`/tickets/${id}/comments`, {
      method: "POST",
      token,
      body: { content },
    });
  },
  technicians(token: string) {
    return apiRequest<TicketUser[]>("/tickets/assignees/technicians", {
      token,
    });
  },
};
