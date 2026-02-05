import { Prisma, PrismaClient } from '../generated/prisma/client';
import { hash } from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env['DIRECT_URL'];
if (!connectionString) {
  throw new Error('DIRECT_URL environment variable is required');
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({ adapter });

const ticketData: Prisma.TicketCreateInput[] = [
  {
    title: 'Login problem',
    description: 'I am getting an error when logging in',
    status: 'OPEN',
    priority: 'HIGH',
    user: {
      connect: {
        email: 'user@helpdesk.com',
      },
    },
  },
  {
    title: 'Password reset',
    description: 'I forgot my password, how can I reset it?',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    user: {
      connect: {
        email: 'user@helpdesk.com',
      },
    },
  },
  {
    title: 'Bug report',
    description: 'I am getting a bug when using the feature',
    status: 'CLOSED',
    priority: 'URGENT',
    user: {
      connect: {
        email: 'user@helpdesk.com',
      },
    },
  },
  {
    title: 'Feature request',
    description: 'Can a new feature be added?',
    status: 'OPEN',
    priority: 'LOW',
    user: {
      connect: {
        email: 'user@helpdesk.com',
      },
    },
  },
];

async function main() {
  console.log('🌱 Seeding started...');

  const hashedPassword = await hash('password123', 10);

  const userData: Prisma.UserCreateInput[] = [
    {
      email: 'admin@helpdesk.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
    {
      email: 'support@helpdesk.com',
      password: hashedPassword,
      name: 'Support User',
      role: 'SUPPORT',
    },
    {
      email: 'user@helpdesk.com',
      password: hashedPassword,
      name: 'User User',
      role: 'USER',
    },
  ];

  for (const user of userData) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  for (const ticket of ticketData) {
    await prisma.ticket.create({
      data: ticket,
    });
  }

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
