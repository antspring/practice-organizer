import { countUsers, listUsers } from './users.repository';

type ListUsersInput = {
  page: number;
  limit: number;
};

const listUsersForAdmin = async ({ page, limit }: ListUsersInput) => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([listUsers({ skip, take: limit }), countUsers()]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export { listUsersForAdmin };
