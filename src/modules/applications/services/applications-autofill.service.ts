import { FormFieldType } from '../../../generated/prisma/enums';
import { AppError } from '../../../shared/http/errors/AppError';
import { findCohortById, getCohortFormFields } from '../../cohorts/cohorts.repository';
import {
  findApplicationByUserAndCohort,
  findLatestPreviousApplicationWithAnswers,
} from '../applications.repository';
import { AutofillAnswer, FormField, PreviousApplication } from '../types/applications.types';

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

export { getApplicationAutofillForStudent };
