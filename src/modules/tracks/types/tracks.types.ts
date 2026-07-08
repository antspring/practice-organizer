type CreateTrackInput = {
  title: string;
  description?: string | null;
  sortOrder: number;
  isActive: boolean;
};

type UpdateTrackInput = {
  title?: string;
  description?: string | null;
  sortOrder?: number;
  isActive?: boolean;
};

export type { CreateTrackInput, UpdateTrackInput };
