type UpsertPracticeReviewInput = {
  activities?: string | null;
  characteristic?: string | null;
  isEmployed?: boolean | null;
  employmentPosition?: string | null;
  isNextPracticeOffered?: boolean | null;
  isEmploymentOffered?: boolean | null;
  suggestions?: string | null;
  grade?: string | null;
  isReady: boolean;
};

export type { UpsertPracticeReviewInput };
