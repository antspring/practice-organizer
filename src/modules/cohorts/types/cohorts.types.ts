type CreateCohortInput = {
  title: string;
  description?: string;
  publicSlug: string;
  startsAt: string;
  endsAt: string;
  applicationStartsAt: string;
  applicationEndsAt: string;
  isActive?: boolean;
  isPubliclyListed?: boolean;
};

type UpdateCohortInput = {
  title?: string;
  description?: string | null;
  publicSlug?: string;
  startsAt?: string;
  endsAt?: string;
  applicationStartsAt?: string;
  applicationEndsAt?: string;
  isActive?: boolean;
  isPubliclyListed?: boolean;
};

type ListCohortsInput = {
  page: number;
  limit: number;
};

type ReplaceCohortFormInput = {
  fields: {
    key: string;
    label: string;
    type: 'text' | 'select';
    isRequired: boolean;
    sortOrder: number;
    options: {
      label: string;
      value: string;
      sortOrder: number;
    }[];
  }[];
};

export type { CreateCohortInput, ListCohortsInput, ReplaceCohortFormInput, UpdateCohortInput };
