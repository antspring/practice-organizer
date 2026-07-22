import { AppError } from '../../../shared/http/errors/AppError';
import { findCohortById } from '../../cohorts/cohorts.repository';
import { listApprovedApplicationsForDocumentSummary } from '../documents.repository';

type SummaryApplication = Awaited<ReturnType<typeof listApprovedApplicationsForDocumentSummary>>[number];

const hasValue = (value: string | null | undefined) => Boolean(value?.trim());

const isIndividualAssignmentReady = (application: SummaryApplication) => {
  const profile = application.user.practiceProfile;

  return Boolean(
    profile &&
      hasValue(profile.fullName) &&
      hasValue(profile.fullNameGenitive) &&
      hasValue(profile.group) &&
      hasValue(profile.directionCode) &&
      hasValue(profile.directionName) &&
      hasValue(profile.educationProgram) &&
      hasValue(profile.urfuPracticeSupervisor) &&
      hasValue(profile.mainStageWorkList) &&
      hasValue(application.track?.title),
  );
};

const isSupervisorReviewReady = (application: SummaryApplication) => {
  const profile = application.user.practiceProfile;
  const review = application.review;

  return Boolean(
    profile &&
      hasValue(profile.fullName) &&
      hasValue(profile.group) &&
      review?.isReady &&
      hasValue(review.activities) &&
      hasValue(review.characteristic) &&
      review.isEmployed !== null &&
      review.isNextPracticeOffered !== null &&
      review.isEmploymentOffered !== null &&
      hasValue(review.suggestions) &&
      hasValue(review.grade),
  );
};

const isReportTitlePageReady = (application: SummaryApplication) => {
  const profile = application.user.practiceProfile;

  return Boolean(
    profile &&
      hasValue(profile.fullName) &&
      hasValue(profile.group) &&
      hasValue(profile.directionCode) &&
      hasValue(profile.directionName) &&
      hasValue(profile.urfuPracticeSupervisor) &&
      hasValue(application.track?.title) &&
      application.report?.isApproved &&
      hasValue(application.review?.grade),
  );
};

const presentDocumentSummaryItem = (application: SummaryApplication) => ({
  applicationId: application.id,
  userId: application.userId,
  fullName: application.user.practiceProfile?.fullName ?? null,
  individualAssignmentReady: isIndividualAssignmentReady(application),
  supervisorReviewReady: isSupervisorReviewReady(application),
  practiceReportUploaded: application.report !== null,
  practiceReportApproved: application.report?.isApproved ?? false,
  reportTitlePageReady: isReportTitlePageReady(application),
});

const getCohortDocumentSummary = async (cohortId: string) => {
  const cohort = await findCohortById(cohortId);

  if (!cohort) {
    throw new AppError('Cohort not found', 404);
  }

  const applications = await listApprovedApplicationsForDocumentSummary(cohortId);

  return { items: applications.map(presentDocumentSummaryItem) };
};

export { getCohortDocumentSummary };
