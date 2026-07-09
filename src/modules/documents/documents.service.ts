import { PracticeApplicationStatus, UserRole } from '../../generated/prisma/enums';
import { AppError } from '../../shared/http/errors/AppError';
import { findApplicationForDocumentById } from './documents.repository';
import { renderDocxTemplate, resolveTemplatePath } from './services/docx-template.service';

type GenerateDocumentUser = {
  id: string;
  role: UserRole;
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('ru-RU').format(date);
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

const generateIndividualAssignmentDocument = async (applicationId: string, user: GenerateDocumentUser) => {
  const application = await findApplicationForDocumentById(applicationId);

  if (!application) {
    throw new AppError('Application not found', 404);
  }

  ensureCanReadApplicationDocument(user, application.userId);

  if (application.status !== PracticeApplicationStatus.approved) {
    throw new AppError('Application must be approved', 400);
  }

  const profile = application.user.practiceProfile;

  if (!profile) {
    throw new AppError('Practice profile is required', 400);
  }

  const buffer = await renderDocxTemplate({
    templatePath: resolveTemplatePath('individual-assignment.docx'),
    data: {
      student_full_name: ensureRequiredValue(profile.fullName, 'Profile fullName is required'),
      student_group: ensureRequiredValue(profile.group, 'Profile group is required'),
      student_specialty: ensureRequiredValue(profile.specialty, 'Profile specialty is required'),
      education_program: ensureRequiredValue(profile.educationProgram, 'Profile educationProgram is required'),
      practice_start_date: formatDate(application.cohort.startsAt),
      practice_end_date: formatDate(application.cohort.endsAt),
      track_title: ensureRequiredValue(application.track?.title, 'Application track is required'),
    },
  });

  return {
    buffer,
    fileName: `individual-assignment-${application.id}.docx`,
  };
};

export { generateIndividualAssignmentDocument };
