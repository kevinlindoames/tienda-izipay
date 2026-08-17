import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

import { AdminRole, PrismaClient } from '../src/generated/prisma/client';

function requireValue(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

const connectionString = requireValue('DATABASE_URL');
const email = requireValue('ADMIN_BOOTSTRAP_EMAIL').toLowerCase();
const password = requireValue('ADMIN_BOOTSTRAP_PASSWORD');
const firstName = requireValue('ADMIN_BOOTSTRAP_FIRST_NAME');
const lastName = requireValue('ADMIN_BOOTSTRAP_LAST_NAME');

if (password.length < 12) {
  throw new Error(
    'ADMIN_BOOTSTRAP_PASSWORD must contain at least 12 characters.',
  );
}

if (Buffer.byteLength(password, 'utf8') > 72) {
  throw new Error('ADMIN_BOOTSTRAP_PASSWORD must not exceed 72 UTF-8 bytes.');
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main(): Promise<void> {
  const existing = await prisma.adminUser.findUnique({
    where: {
      email,
    },
  });

  if (existing) {
    throw new Error(
      'An administrator with this email already exists. No changes were made.',
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.create({
    data: {
      email,
      passwordHash,
      firstName,
      lastName,
      role: AdminRole.OWNER,
      isActive: true,
    },
    select: {
      email: true,
      role: true,
      isActive: true,
    },
  });

  console.log(`Admin created: ${admin.email} (${admin.role})`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
