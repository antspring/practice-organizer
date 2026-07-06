import 'dotenv/config';

import bcrypt from 'bcryptjs';

import { UserRole } from '../src/generated/prisma/enums';
import { prismaClient } from '../src/shared/database/prismaClient';

const PASSWORD_SALT_ROUNDS = 10;

const getRequiredEnv = (name: string) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} environment variable is required`);
  }

  return value;
};

const seedAdmin = async () => {
  const email = getRequiredEnv('ADMIN_EMAIL').trim().toLowerCase();
  const password = getRequiredEnv('ADMIN_PASSWORD');
  const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

  const admin = await prismaClient.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: UserRole.admin,
    },
    create: {
      email,
      passwordHash,
      role: UserRole.admin,
    },
  });

  console.log(`Admin user is ready: ${admin.email}`);
};

seedAdmin()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
