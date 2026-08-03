import type { AuthUser, Role } from "./auth";

export type TicketStatus =
  | "OPEN"
  | "IN_REVIEW"
  | "IN_PROGRESS"
  | "ON_HOLD"
  | "RESOLVED"
  | "CLOSED";

export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type TicketCategory =
  | "HARDWARE"
  | "SOFTWARE"
  | "NETWORK"
  | "ACCOUNT"
  | "ACCESS"
  | "SECURITY"
  | "OTHER";

export type TicketUser = Pick<AuthUser, "id" | "name" | "email" | "isDemo"> & {
  role: Role;
};

export type TicketComment = {
  id: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
  ticketId: string;
  authorId: string;
  author: TicketUser;
};

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  assignedToId: string | null;
  createdBy: TicketUser;
  assignedTo: TicketUser | null;
  comments?: TicketComment[];
  _count?: {
    comments: number;
  };
};

export type TicketListResponse = {
  items: Ticket[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type TicketSummary = {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  critical: number;
  assignedToMe: number;
};

export type TicketQuery = {
  status?: TicketStatus;
  priority?: TicketPriority;
  search?: string;
  page?: number;
  limit?: number;
};

export type CreateTicketPayload = {
  title: string;
  description: string;
  priority?: TicketPriority;
  category?: TicketCategory;
};
