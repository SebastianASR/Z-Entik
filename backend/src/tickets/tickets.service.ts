import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma,
  Ticket,
  TicketPriority,
  TicketStatus,
  UserRole,
} from '@prisma/client';
import { AuthUser } from '../auth/auth-user.type';
import { PrismaService } from '../prisma/prisma.service';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { CreateTicketCommentDto } from './dto/create-ticket-comment.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketQueryDto } from './dto/ticket-query.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

const userSummarySelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isDemo: true,
} satisfies Prisma.UserSelect;

const ticketInclude = {
  createdBy: {
    select: userSummarySelect,
  },
  assignedTo: {
    select: userSummarySelect,
  },
  comments: {
    orderBy: {
      createdAt: 'asc',
    },
    include: {
      author: {
        select: userSummarySelect,
      },
    },
  },
} satisfies Prisma.TicketInclude;

type TicketWithRelations = Prisma.TicketGetPayload<{
  include: typeof ticketInclude;
}>;

type TicketAccessAction = 'view' | 'comment' | 'status' | 'assign' | 'update';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: AuthUser, dto: CreateTicketDto) {
    return this.prisma.ticket.create({
      data: {
        title: dto.title.trim(),
        description: dto.description.trim(),
        priority: dto.priority ?? TicketPriority.MEDIUM,
        category: dto.category,
        createdById: user.id,
      },
      include: ticketInclude,
    });
  }

  async findAll(user: AuthUser, query: TicketQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const where = this.buildScopedWhere(user, query);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.ticket.findMany({
        where,
        include: {
          createdBy: {
            select: userSummarySelect,
          },
          assignedTo: {
            select: userSummarySelect,
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.ticket.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async findOne(user: AuthUser, id: string) {
    const ticket = await this.getTicketOrThrow(id);
    this.assertCanAccess(user, ticket, 'view');

    return ticket;
  }

  async update(user: AuthUser, id: string, dto: UpdateTicketDto) {
    const ticket = await this.getTicketOrThrow(id);
    this.assertCanAccess(user, ticket, 'update');

    const data: Prisma.TicketUpdateInput = {};

    if (dto.title !== undefined) data.title = dto.title.trim();
    if (dto.description !== undefined)
      data.description = dto.description.trim();
    if (dto.priority !== undefined) data.priority = dto.priority;
    if (dto.category !== undefined) data.category = dto.category;
    if (dto.status !== undefined) data.status = dto.status;

    if (dto.assignedToId !== undefined) {
      if (dto.assignedToId === null || dto.assignedToId === '') {
        data.assignedTo = { disconnect: true };
      } else {
        await this.assertTechnicianExists(dto.assignedToId);
        data.assignedTo = { connect: { id: dto.assignedToId } };
      }
    }

    if (!Object.keys(data).length) {
      throw new BadRequestException('No hay cambios validos para aplicar');
    }

    return this.prisma.ticket.update({
      where: { id },
      data,
      include: ticketInclude,
    });
  }

  async updateStatus(user: AuthUser, id: string, dto: UpdateTicketStatusDto) {
    const ticket = await this.getTicketOrThrow(id);
    this.assertCanAccess(user, ticket, 'status');

    if (user.role === UserRole.TECHNICIAN) {
      this.assertValidTechnicianTransition(ticket.status, dto.status);
    }

    return this.prisma.ticket.update({
      where: { id },
      data: { status: dto.status },
      include: ticketInclude,
    });
  }

  async assign(user: AuthUser, id: string, dto: AssignTicketDto) {
    const ticket = await this.getTicketOrThrow(id);
    this.assertCanAccess(user, ticket, 'assign');

    let assignedToId = dto.assignedToId;

    if (user.role === UserRole.TECHNICIAN) {
      if (ticket.assignedToId) {
        throw new ForbiddenException('Este ticket ya esta asignado');
      }

      assignedToId = user.id;
    }

    if (!assignedToId) {
      throw new BadRequestException('Debes indicar un tecnico para asignar');
    }

    await this.assertTechnicianExists(assignedToId);

    return this.prisma.ticket.update({
      where: { id },
      data: {
        assignedToId,
        status:
          ticket.status === TicketStatus.OPEN
            ? TicketStatus.IN_PROGRESS
            : ticket.status,
      },
      include: ticketInclude,
    });
  }

  async addComment(user: AuthUser, id: string, dto: CreateTicketCommentDto) {
    const ticket = await this.getTicketOrThrow(id);
    this.assertCanAccess(user, ticket, 'comment');

    return this.prisma.ticketComment.create({
      data: {
        content: dto.content.trim(),
        ticketId: ticket.id,
        authorId: user.id,
      },
      include: {
        author: {
          select: userSummarySelect,
        },
      },
    });
  }

  async getComments(user: AuthUser, id: string) {
    const ticket = await this.getTicketOrThrow(id);
    this.assertCanAccess(user, ticket, 'view');

    return this.prisma.ticketComment.findMany({
      where: { ticketId: ticket.id },
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
          select: userSummarySelect,
        },
      },
    });
  }

  async getSummary(user: AuthUser) {
    const where = this.getRoleScopeWhere(user);
    const [total, open, inProgress, resolved, closed, critical, assignedToMe] =
      await this.prisma.$transaction([
        this.prisma.ticket.count({ where }),
        this.prisma.ticket.count({
          where: { AND: [where, { status: TicketStatus.OPEN }] },
        }),
        this.prisma.ticket.count({
          where: { AND: [where, { status: TicketStatus.IN_PROGRESS }] },
        }),
        this.prisma.ticket.count({
          where: { AND: [where, { status: TicketStatus.RESOLVED }] },
        }),
        this.prisma.ticket.count({
          where: { AND: [where, { status: TicketStatus.CLOSED }] },
        }),
        this.prisma.ticket.count({
          where: { AND: [where, { priority: TicketPriority.CRITICAL }] },
        }),
        this.prisma.ticket.count({
          where: { AND: [where, { assignedToId: user.id }] },
        }),
      ]);

    return {
      total,
      open,
      inProgress,
      resolved,
      closed,
      critical,
      assignedToMe,
    };
  }

  async getTechnicians(user: AuthUser) {
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.DEMOADMIN) {
      throw new ForbiddenException('Tu rol no permite listar tecnicos');
    }

    return this.prisma.user.findMany({
      where: { role: UserRole.TECHNICIAN },
      select: userSummarySelect,
      orderBy: { name: 'asc' },
    });
  }

  private buildScopedWhere(
    user: AuthUser,
    query: TicketQueryDto,
  ): Prisma.TicketWhereInput {
    const filters: Prisma.TicketWhereInput[] = [this.getRoleScopeWhere(user)];

    if (query.status) filters.push({ status: query.status });
    if (query.priority) filters.push({ priority: query.priority });
    if (query.assignedToId) filters.push({ assignedToId: query.assignedToId });
    if (query.createdById) filters.push({ createdById: query.createdById });

    const search = query.search?.trim();
    if (search) {
      filters.push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    return { AND: filters };
  }

  private getRoleScopeWhere(user: AuthUser): Prisma.TicketWhereInput {
    if (user.role === UserRole.USER) {
      return { createdById: user.id };
    }

    if (user.role === UserRole.TECHNICIAN) {
      return {
        OR: [{ assignedToId: user.id }, { assignedToId: null }],
      };
    }

    return {};
  }

  private async getTicketOrThrow(id: string): Promise<TicketWithRelations> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: ticketInclude,
    });

    if (!ticket) {
      throw new NotFoundException('Ticket no encontrado');
    }

    return ticket;
  }

  private assertCanAccess(
    user: AuthUser,
    ticket: Ticket,
    action: TicketAccessAction,
  ): void {
    if (user.role === UserRole.ADMIN) {
      return;
    }

    if (user.role === UserRole.DEMOADMIN) {
      if (action === 'assign' || action === 'status' || action === 'update') {
        throw new ForbiddenException(
          'Demo Admin puede explorar tickets, pero no modificar gestion real',
        );
      }

      return;
    }

    if (user.role === UserRole.USER) {
      if (ticket.createdById !== user.id) {
        throw new ForbiddenException('No puedes acceder a este ticket');
      }

      if (action === 'assign' || action === 'status' || action === 'update') {
        throw new ForbiddenException('Tu rol no permite modificar este ticket');
      }

      return;
    }

    if (user.role === UserRole.TECHNICIAN) {
      const isAssignedToMe = ticket.assignedToId === user.id;
      const isUnassigned = ticket.assignedToId === null;

      if (action === 'view' && (isAssignedToMe || isUnassigned)) {
        return;
      }

      if (action === 'assign' && isUnassigned) {
        return;
      }

      if ((action === 'comment' || action === 'status') && isAssignedToMe) {
        return;
      }

      throw new ForbiddenException('Tu rol no permite operar este ticket');
    }

    throw new ForbiddenException('No tienes permisos para este ticket');
  }

  private assertValidTechnicianTransition(
    currentStatus: TicketStatus,
    nextStatus: TicketStatus,
  ): void {
    const allowedTransitions: Partial<Record<TicketStatus, TicketStatus[]>> = {
      [TicketStatus.OPEN]: [TicketStatus.IN_PROGRESS],
      [TicketStatus.IN_PROGRESS]: [TicketStatus.RESOLVED],
      [TicketStatus.RESOLVED]: [TicketStatus.CLOSED],
    };

    if (currentStatus === nextStatus) {
      return;
    }

    if (!allowedTransitions[currentStatus]?.includes(nextStatus)) {
      throw new BadRequestException(
        'Transicion de estado no permitida para tecnico',
      );
    }
  }

  private async assertTechnicianExists(userId: string): Promise<void> {
    const technician = await this.prisma.user.findFirst({
      where: {
        id: userId,
        role: UserRole.TECHNICIAN,
      },
      select: { id: true },
    });

    if (!technician) {
      throw new BadRequestException(
        'El usuario asignado debe tener rol TECHNICIAN',
      );
    }
  }
}
