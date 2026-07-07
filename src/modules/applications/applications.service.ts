import { FormFieldType, PracticeApplicationStatus } from '../../generated/prisma/enums';
import { AppError } from '../../shared/http/errors/AppError';
import { findCohortById, getCohortFormFields } from '../cohorts/cohorts.repository';
import {
  createApplication,
  findApplicationById,
  findApplicationDetailsById,
  findApplicationByUserAndCohort,
  findLatestPreviousApplicationWithAnswers,
  listApplicationsByCohort,
  listApplicationsByUser,
  replaceApplicationAnswers,
  updateApplicationStatus,
} from './applications.repository';

type CreateApplicationInput = {
  cohortId: string;
  answers: {
    fieldId: string;
    value?: string;
    optionId?: string;
  }[];
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
};

const isApplicationOpen = (applicationStartsAt: Date, applicationEndsAt: Date) => {
  const now = new Date();

  return applicationStartsAt <= now && applicationEndsAt >= now;
};

const validateTextAnswer = (answer: CreateApplicationInput['answers'][number]) => {
  if (!answer.value || answer.optionId) {
    throw new AppError('Text answer must contain value only', 400);
  }
};

const validateSelectAnswer = (field: FormField, answer: CreateApplicationInput['answers'][number]) => {
  if (!answer.optionId || answer.value) {
    throw new AppError('Select answer must contain optionId only', 400);
  }

  const optionExists = field.options.some((option) => option.id === answer.optionId);

  if (!optionExists) {
    throw new AppError('Selected option does not belong to field', 400);
  }
};

const validateAnswers = (fields: FormField[], answers: CreateApplicationInput['answers']) => {
  const fieldsById = new Map(fields.map((field) => [field.id, field]));
  const answersByFieldId = new Map(answers.map((answer) => [answer.fieldId, answer]));

  for (const answer of answers) {
    const field = fieldsById.get(answer.fieldId);

    if (!field) {
      throw new AppError('Answer field does not belong to cohort form', 400);
    }

    if (field.type === FormFieldType.text) {
      validateTextAnswer(answer);
    }

    if (field.type === FormFieldType.select) {
      validateSelectAnswer(field, answer);
    }
  }

  for (const field of fields) {
    if (field.isRequired && !answersByFieldId.has(field.id)) {
      throw new AppError('Required form field is missing', 400);
    }
  }
};

const buildAutofillAnswers = (fields: FormField[], previousApplication: PreviousApplication | null) => {
  if (!previousApplication) {
    return [];
  }

  const previousAnswersByKey = new Map(previousApplication.answers.map((answer) => [answer.field.key, answer]));

  return fields.flatMap<AutofillAnswer>((field) => {
    const previousAnswer = previousAnswersByKey.get(field.key);

    if (!previousAnswer) {
      return [];
    }

    if (field.type === FormFieldType.text && previousAnswer.value) {
      return [{ fieldId: field.id, value: previousAnswer.value }];
    }

    if (field.type === FormFieldType.select && previousAnswer.option) {
      const matchingOption = field.options.find((option) => option.value === previousAnswer.option?.value);

      if (matchingOption) {
        return [{ fieldId: field.id, optionId: matchingOption.id }];
      }
    }

    return [];
  });
};

const createApplicationForStudent = async (userId: string, input: CreateApplicationInput) => {
  const cohort = await findCohortById(input.cohortId);

  if (!cohort || !cohort.isActive) {
    throw new AppError('Cohort not found', 404);
  }

  if (!isApplicationOpen(cohort.applicationStartsAt, cohort.applicationEndsAt)) {
    throw new AppError('Application period is closed', 400);
  }

  const existingApplication = await findApplicationByUserAndCohort(userId, input.cohortId);

  if (existingApplication) {
    throw new AppError('Application already exists', 409);
  }

  const fields = await getCohortFormFields(input.cohortId);
  validateAnswers(fields, input.answers);

  const application = await createApplication({
    userId,
    cohortId: input.cohortId,
    answers: input.answers,
  });

  return { application };
};

const listCurrentUserApplications = async (userId: string) => {
  const items = await listApplicationsByUser(userId);

  return { items };
};

const listCohortApplicationsForAdmin = async (cohortId: string) => {
  const cohort = await findCohortById(cohortId);

  if (!cohort) {
    throw new AppError('Cohort not found', 404);
  }

  const items = await listApplicationsByCohort(cohortId);

  return { items };
};

const updateApplicationStatusForAdmin = async (applicationId: string, input: UpdateApplicationStatusInput) => {
  const application = await findApplicationDetailsById(applicationId);

  if (!application) {
    throw new AppError('Application not found', 404);
  }

  const updatedApplication = await updateApplicationStatus(applicationId, input.status);

  return { application: updatedApplication };
};

const getApplicationAutofillForStudent = async (userId: string, cohortId: string) => {
  const cohort = await findCohortById(cohortId);

  if (!cohort || !cohort.isActive) {
    throw new AppError('Cohort not found', 404);
  }

  const existingApplication = await findApplicationByUserAndCohort(userId, cohortId);

  if (existingApplication) {
    throw new AppError('Application already exists', 409);
  }

  const [fields, previousApplication] = await Promise.all([
    getCohortFormFields(cohortId),
    findLatestPreviousApplicationWithAnswers(userId, cohortId),
  ]);

  return {
    answers: buildAutofillAnswers(fields, previousApplication),
  };
};

const updateApplicationForStudent = async (
  applicationId: string,
  userId: string,
  input: Pick<CreateApplicationInput, 'answers'>,
) => {
  const application = await findApplicationById(applicationId);

  if (!application || application.userId !== userId) {
    throw new AppError('Application not found', 404);
  }

  if (application.status !== PracticeApplicationStatus.pending) {
    throw new AppError('Only pending application can be updated', 400);
  }

  if (!isApplicationOpen(application.cohort.applicationStartsAt, application.cohort.applicationEndsAt)) {
    throw new AppError('Application period is closed', 400);
  }

  const fields = await getCohortFormFields(application.cohortId);
  validateAnswers(fields, input.answers);

  const updatedApplication = await replaceApplicationAnswers(applicationId, input.answers);

  return { application: updatedApplication };
};

export {
  createApplicationForStudent,
  getApplicationAutofillForStudent,
  listCohortApplicationsForAdmin,
  listCurrentUserApplications,
  updateApplicationStatusForAdmin,
  updateApplicationForStudent,
};
