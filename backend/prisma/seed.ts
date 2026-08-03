import 'dotenv/config';
import { UserRole } from '@prisma/client';
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

  for (const demoUser of demoUsers) {
    await prisma.user.upsert({
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
  }

  console.log('Demo users are ready for development and portfolio use.');
}

void main()
  .catch((error: unknown) => {
    console.error('Error seeding demo users:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
