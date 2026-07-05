import { PrismaPg } from '@prisma/adapter-pg';

import { appConfig } from '../../config/appConfig';
import { PrismaClient } from '../../generated/prisma/client';

const adapter = new PrismaPg({ connectionString: appConfig.databaseUrl });
const prismaClient = new PrismaClient({ adapter });

export { prismaClient };
