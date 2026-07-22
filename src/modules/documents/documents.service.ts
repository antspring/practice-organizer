import { PracticeApplicationStatus, UserRole } from '../../generated/prisma/enums';
import { AppError } from '../../shared/http/errors/AppError';
import { findApplicationForDocumentById } from './documents.repository';
import { renderDocxTemplate, resolveTemplatePath } from './services/docx-template.service';

type GenerateDocumentUser = {
  id: string;
  role: UserRole;
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('ru-RU', { timeZone: 'UTC' }).format(date);
};

const formatLongDate = (date: Date) => {
  const formattedDate = new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
    .format(date)
    .replace(' г.', '');

  const [day, ...rest] = formattedDate.split(' ');

  return `«${day}» ${rest.join(' ')}`;
};

const addUtcDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
};

const getPracticeSchedule = (startsAt: Date, endsAt: Date) => {
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  const durationInDays = Math.max(0, Math.round((endsAt.getTime() - startsAt.getTime()) / millisecondsInDay));
  const organizationalEndOffset = Math.min(7, Math.floor(durationInDays / 3));
  const finalStartOffset = Math.max(organizationalEndOffset, durationInDays - 3);

  return {
    organizationalStart: startsAt,
    organizationalEnd: addUtcDays(startsAt, organizationalEndOffset),
    mainStart: addUtcDays(startsAt, organizationalEndOffset),
    mainEnd: addUtcDays(startsAt, Math.max(organizationalEndOffset, finalStartOffset - 1)),
    finalStart: addUtcDays(startsAt, finalStartOffset),
    finalEnd: endsAt,
  };
};

const ensureCanReadApplicationDocument = (user: GenerateDocumentUser, applicationUserId: string) => {
  if (user.role === UserRole.admin) {
    return;
  }

  if (user.role === UserRole.student && user.id === applicationUserId) {
    return;
  }

  throw new AppError('Forbidden', 403);
};

const ensureRequiredValue = (value: string | null | undefined, message: string) => {
  if (!value) {
    throw new AppError(message, 400);
  }

  return value;
};

const formatShortName = (fullName: string) => {
  const [lastName, ...givenNames] = fullName.trim().split(/\s+/);

  if (!lastName || givenNames.length === 0) {
    return fullName.trim();
  }

  const initials = givenNames.map((name) => `${name[0].toUpperCase()}.`).join(' ');

  return `${lastName} ${initials}`;
};

const formatRequiredBoolean = (value: boolean | null | undefined, message: string) => {
  if (value === null || value === undefined) {
    throw new AppError(message, 400);
  }

  return value ? 'да' : 'нет';
};

const ensureApplicationIsApproved = (status: PracticeApplicationStatus) => {
  if (status !== PracticeApplicationStatus.approved) {
    throw new AppError('Application must be approved', 400);
  }
};

const generateIndividualAssignmentDocument = async (applicationId: string, user: GenerateDocumentUser) => {
  const application = await findApplicationForDocumentById(applicationId);

  if (!application) {
    throw new AppError('Application not found', 404);
  }

  ensureCanReadApplicationDocument(user, application.userId);
  ensureApplicationIsApproved(application.status);

  const profile = application.user.practiceProfile;

  if (!profile) {
    throw new AppError('Practice profile is required', 400);
  }

  const schedule = getPracticeSchedule(application.cohort.startsAt, application.cohort.endsAt);

  const buffer = await renderDocxTemplate({
    templatePath: resolveTemplatePath('individual-assignment.docx'),
    data: {
      student_full_name: ensureRequiredValue(profile.fullName, 'Profile fullName is required'),
      student_group: ensureRequiredValue(profile.group, 'Profile group is required'),
      student_specialty: ensureRequiredValue(profile.directionName, 'Profile directionName is required'),
      education_program: ensureRequiredValue(profile.educationProgram, 'Profile educationProgram is required'),
      practice_start_date: formatDate(application.cohort.startsAt),
      practice_end_date: formatDate(application.cohort.endsAt),
      practice_approval_date: formatLongDate(application.cohort.startsAt),
      organizational_start_date: formatDate(schedule.organizationalStart),
      organizational_end_date: formatDate(schedule.organizationalEnd),
      main_start_date: formatDate(schedule.mainStart),
      main_end_date: formatDate(schedule.mainEnd),
      final_start_date: formatDate(schedule.finalStart),
      final_end_date: formatDate(schedule.finalEnd),
      track_title: ensureRequiredValue(application.track?.title, 'Application track is required'),
    },
  });

  return {
    buffer,
    fileName: `individual-assignment-${application.id}.docx`,
  };
};

const generateSupervisorReviewDocument = async (applicationId: string, user: GenerateDocumentUser) => {
  const application = await findApplicationForDocumentById(applicationId);

  if (!application) {
    throw new AppError('Application not found', 404);
  }

  ensureCanReadApplicationDocument(user, application.userId);
  ensureApplicationIsApproved(application.status);

  const profile = application.user.practiceProfile;

  if (!profile) {
    throw new AppError('Practice profile is required', 400);
  }

  const review = application.review;

  if (!review) {
    throw new AppError('Practice review is required', 400);
  }

  if (!review.isReady) {
    throw new AppError('Practice review must be ready', 400);
  }

  const buffer = await renderDocxTemplate({
    templatePath: resolveTemplatePath('supervisor-review.docx'),
    data: {
      student_full_name: ensureRequiredValue(profile.fullName, 'Profile fullName is required'),
      student_group: ensureRequiredValue(profile.group, 'Profile group is required'),
      practice_start_date: formatDate(application.cohort.startsAt),
      practice_end_date: formatDate(application.cohort.endsAt),
      activities: ensureRequiredValue(review.activities, 'Practice review activities is required'),
      characteristic: ensureRequiredValue(review.characteristic, 'Practice review characteristic is required'),
      is_employed: formatRequiredBoolean(review.isEmployed, 'Practice review employment status is required'),
      employment_position: review.employmentPosition ?? '',
      is_next_practice_offered: formatRequiredBoolean(
        review.isNextPracticeOffered,
        'Practice review next practice offer status is required',
      ),
      is_employment_offered: formatRequiredBoolean(
        review.isEmploymentOffered,
        'Practice review employment offer status is required',
      ),
      suggestions: ensureRequiredValue(review.suggestions, 'Practice review suggestions is required'),
      grade: ensureRequiredValue(review.grade, 'Practice review grade is required'),
      review_date: formatLongDate(application.cohort.endsAt),
    },
  });

  return {
    buffer,
    fileName: `supervisor-review-${application.id}.docx`,
  };
};

const generateReportTitlePageDocument = async (applicationId: string, user: GenerateDocumentUser) => {
  const application = await findApplicationForDocumentById(applicationId);

  if (!application) {
    throw new AppError('Application not found', 404);
  }

  ensureCanReadApplicationDocument(user, application.userId);
  ensureApplicationIsApproved(application.status);

  const profile = application.user.practiceProfile;

  if (!profile) {
    throw new AppError('Practice profile is required', 400);
  }

  if (!application.report) {
    throw new AppError('Practice report is required', 400);
  }

  if (!application.report.isApproved) {
    throw new AppError('Practice report must be approved', 400);
  }

  const buffer = await renderDocxTemplate({
    templatePath: resolveTemplatePath('report-title-page.docx'),
    data: {
      grade: ensureRequiredValue(application.review?.grade, 'Practice review grade is required'),
      track_title: ensureRequiredValue(application.track?.title, 'Application track is required'),
      student_short_name: formatShortName(ensureRequiredValue(profile.fullName, 'Profile fullName is required')),
      student_specialty: ensureRequiredValue(profile.directionName, 'Profile directionName is required'),
      student_group: ensureRequiredValue(profile.group, 'Profile group is required'),
      cohort_year: String(application.cohort.startsAt.getUTCFullYear()),
    },
  });

  return {
    buffer,
    fileName: `report-title-page-${application.id}.docx`,
  };
};

export {
  generateIndividualAssignmentDocument,
  generateReportTitlePageDocument,
  generateSupervisorReviewDocument,
};
