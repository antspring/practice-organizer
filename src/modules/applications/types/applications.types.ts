import { PracticeApplicationStatus } from '../../../generated/prisma/enums';
import { getCohortFormFields } from '../../cohorts/cohorts.repository';
import { findLatestPreviousApplicationWithAnswers } from '../applications.repository';

type ApplicationAnswerInput = {
  fieldId: string;
  value?: string;
  optionId?: string;
};

type CreateApplicationInput = {
  cohortId: string;
  answers: ApplicationAnswerInput[];
};

type FormField = Awaited<ReturnType<typeof getCohortFormFields>>[number];
type PreviousApplication = NonNullable<Awaited<ReturnType<typeof findLatestPreviousApplicationWithAnswers>>>;

type AutofillAnswer = {
  fieldId: string;
  value?: string;
  optionId?: string;
};

type UpdateApplicationStatusInput = {
  status: PracticeApplicationStatus;
  trackId?: string | null;
  rejectionComment?: string | null;
};

export type {
  ApplicationAnswerInput,
  AutofillAnswer,
  CreateApplicationInput,
  FormField,
  PreviousApplication,
  UpdateApplicationStatusInput,
};
