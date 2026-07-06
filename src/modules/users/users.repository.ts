import { prismaClient } from '../../shared/database/prismaClient';

type ListUsersParams = {
  skip: number;
  take: number;
};

const userSelect = {
  id: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

const countUsers = () => {
  return prismaClient.user.count();
};

const listUsers = ({ skip, take }: ListUsersParams) => {
  return prismaClient.user.findMany({
    select: userSelect,
    orderBy: { createdAt: 'desc' },
    skip,
    take,
  });
};

export { countUsers, listUsers };
