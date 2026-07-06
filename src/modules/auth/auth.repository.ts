import { UserRole } from '../../generated/prisma/enums';
import { prismaClient } from '../../shared/database/prismaClient';

type CreateUserData = {
  email: string;
  passwordHash: string;
  role?: UserRole;
};

type CreateRefreshTokenData = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
};

const findUserByEmail = (email: string) => {
  return prismaClient.user.findUnique({
    where: { email },
  });
};

const findUserById = (id: string) => {
  return prismaClient.user.findUnique({
    where: { id },
  });
};

const createUser = (data: CreateUserData) => {
  return prismaClient.user.create({
    data,
  });
};

const createRefreshToken = (data: CreateRefreshTokenData) => {
  return prismaClient.refreshToken.create({
    data,
  });
};

const findRefreshTokenByHash = (tokenHash: string) => {
  return prismaClient.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });
};

const deleteRefreshTokenById = (id: string) => {
  return prismaClient.refreshToken.delete({
    where: { id },
  });
};

const deleteRefreshTokenByHash = (tokenHash: string) => {
  return prismaClient.refreshToken.deleteMany({
    where: { tokenHash },
  });
};

export {
  createRefreshToken,
  createUser,
  deleteRefreshTokenByHash,
  deleteRefreshTokenById,
  findRefreshTokenByHash,
  findUserByEmail,
  findUserById,
};
