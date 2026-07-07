import { FormFieldType } from '../../../generated/prisma/enums';
import { AppError } from '../../../shared/http/errors/AppError';
import { ApplicationAnswerInput, FormField } from '../types/applications.types';

const validateTextAnswer = (answer: ApplicationAnswerInput) => {
  if (!answer.value || answer.optionId) {
    throw new AppError('Text answer must contain value only', 400);
  }
};

const validateSelectAnswer = (field: FormField, answer: ApplicationAnswerInput) => {
  if (!answer.optionId || answer.value) {
    throw new AppError('Select answer must contain optionId only', 400);
  }

  const optionExists = field.options.some((option) => option.id === answer.optionId);

  if (!optionExists) {
    throw new AppError('Selected option does not belong to field', 400);
  }
};

const validateAnswers = (fields: FormField[], answers: ApplicationAnswerInput[]) => {
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

export { validateAnswers };
