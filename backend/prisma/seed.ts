import 'dotenv/config';
import {
  TicketCategory,
  TicketPriority,
  TicketStatus,
  UserRole,
} from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required for seed');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

// Demo-only password for portfolio/dev accounts. Do not reuse in production.
const demoPassword = 'ZentikDemo2026!';

const demoUsers = [
  {
    name: 'Demo User',
    email: 'user.demo@zentik.dev',
    role: UserRole.USER,
  },
  {
    name: 'Demo Technician',
    email: 'tech.demo@zentik.dev',
    role: UserRole.TECHNICIAN,
  },
  {
    name: 'Demo Admin',
    email: 'admin.demo@zentik.dev',
    role: UserRole.DEMOADMIN,
  },
];

async function main() {
  const emailVerifiedAt = new Date();
  const passwordHash = await argon2.hash(demoPassword, {
    type: argon2.argon2id,
  });
  const demoUsersByEmail = new Map<string, { id: string }>();

  for (const demoUser of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: demoUser.email },
      update: {
        name: demoUser.name,
        role: demoUser.role,
        isDemo: true,
        emailVerifiedAt,
      },
      create: {
        name: demoUser.name,
        email: demoUser.email,
        passwordHash,
        role: demoUser.role,
        isDemo: true,
        emailVerifiedAt,
      },
    });

    demoUsersByEmail.set(user.email, { id: user.id });
  }

  const userDemo = demoUsersByEmail.get('user.demo@zentik.dev');
  const techDemo = demoUsersByEmail.get('tech.demo@zentik.dev');
  const adminDemo = demoUsersByEmail.get('admin.demo@zentik.dev');

  if (!userDemo || !techDemo || !adminDemo) {
    throw new Error('Demo users were not created correctly');
  }

  const demoTickets = [
    {
      title: 'Notebook no enciende despues de actualizacion',
      description:
        'El equipo queda con pantalla negra al intentar iniciar la jornada. Se requiere revision de energia, BIOS y disco.',
      status: TicketStatus.OPEN,
      priority: TicketPriority.HIGH,
      category: TicketCategory.HARDWARE,
      createdById: userDemo.id,
      assignedToId: null,
      comments: [
        {
          authorId: userDemo.id,
          content:
            'El problema comenzo despues de instalar actualizaciones del sistema.',
        },
      ],
    },
    {
      title: 'Acceso VPN intermitente para soporte remoto',
      description:
        'La conexion VPN se desconecta cada pocos minutos y afecta la atencion de usuarios internos.',
      status: TicketStatus.IN_PROGRESS,
      priority: TicketPriority.CRITICAL,
      category: TicketCategory.NETWORK,
      createdById: userDemo.id,
      assignedToId: techDemo.id,
      comments: [
        {
          authorId: techDemo.id,
          content:
            'Se tomo el ticket y se revisaran logs de autenticacion y red.',
        },
      ],
    },
    {
      title: 'Solicitud de permisos para carpeta compartida',
      description:
        'Usuario solicita acceso a carpeta del area de operaciones para revisar reportes internos.',
      status: TicketStatus.RESOLVED,
      priority: TicketPriority.MEDIUM,
      category: TicketCategory.ACCESS,
      createdById: userDemo.id,
      assignedToId: techDemo.id,
      comments: [
        {
          authorId: techDemo.id,
          content:
            'Permisos asignados de forma temporal y notificados al responsable.',
        },
      ],
    },
  ];

  for (const demoTicket of demoTickets) {
    const existingTicket = await prisma.ticket.findFirst({
      where: {
        title: demoTicket.title,
        createdById: demoTicket.createdById,
      },
    });

    const ticket = existingTicket
      ? await prisma.ticket.update({
          where: { id: existingTicket.id },
          data: {
            description: demoTicket.description,
            status: demoTicket.status,
            priority: demoTicket.priority,
            category: demoTicket.category,
            assignedToId: demoTicket.assignedToId,
          },
        })
      : await prisma.ticket.create({
          data: {
            title: demoTicket.title,
            description: demoTicket.description,
            status: demoTicket.status,
            priority: demoTicket.priority,
            category: demoTicket.category,
            createdById: demoTicket.createdById,
            assignedToId: demoTicket.assignedToId,
          },
        });

    for (const comment of demoTicket.comments) {
      const existingComment = await prisma.ticketComment.findFirst({
        where: {
          ticketId: ticket.id,
          authorId: comment.authorId,
          content: comment.content,
        },
      });

      if (!existingComment) {
        await prisma.ticketComment.create({
          data: {
            ticketId: ticket.id,
            authorId: comment.authorId,
            content: comment.content,
          },
        });
      }
    }
  }

  console.log(
    'Demo users and tickets are ready for development and portfolio use.',
  );
}

void main()
  .catch((error: unknown) => {
    console.error('Error seeding demo users:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
