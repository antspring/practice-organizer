import { sendEmail } from '../../../shared/email/emailService';
import { listApplicationUsersByCohort } from '../../applications/applications.repository';

type AssignmentPublishedEmailInput = {
  cohortId: string;
  cohortTitle: string;
  assignmentTitle: string;
};

const notifyApplicantsAboutAssignmentPublication = async ({
  cohortId,
  cohortTitle,
  assignmentTitle,
}: AssignmentPublishedEmailInput) => {
  const applications = await listApplicationUsersByCohort(cohortId);
  const emails = [...new Set(applications.map((application) => application.user.email))];

  await Promise.allSettled(
    emails.map((email) =>
      sendEmail({
        to: email,
        subject: `Опубликовано тестовое задание: ${cohortTitle}`,
        text: [
          `Для когорты "${cohortTitle}" опубликовано тестовое задание "${assignmentTitle}".`,
          'Откройте личный кабинет, чтобы посмотреть задание.',
        ].join('\n\n'),
      }),
    ),
  );
};

export { notifyApplicantsAboutAssignmentPublication };
