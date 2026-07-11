import { z } from 'zod';

import { FormFieldType, PracticeApplicationStatus, UserRole } from '../../generated/prisma/enums';

const errorResponseSchema = z.object({
  message: z.string(),
});

const userResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum([UserRole.student, UserRole.admin]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const practiceProfileResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  fullName: z.string().nullable(),
  specialty: z.string().nullable(),
  educationProgram: z.string().nullable(),
  group: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const practiceReviewResponseSchema = z.object({
  id: z.string().uuid(),
  applicationId: z.string().uuid(),
  activities: z.string().nullable(),
  characteristic: z.string().nullable(),
  isEmployed: z.boolean().nullable(),
  employmentPosition: z.string().nullable(),
  isNextPracticeOffered: z.boolean().nullable(),
  isEmploymentOffered: z.boolean().nullable(),
  suggestions: z.string().nullable(),
  grade: z.string().nullable(),
  isReady: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const practiceReportResponseSchema = z.object({
  id: z.string().uuid(),
  applicationId: z.string().uuid(),
  originalName: z.string(),
  mimeType: z.string(),
  size: z.number().int(),
  isApproved: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const practiceTaskResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  cohortId: z.string().uuid(),
  date: z.iso.date(),
  title: z.string(),
  description: z.string(),
  artifactLink: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const cohortResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  publicSlug: z.string(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  applicationStartsAt: z.string().datetime(),
  applicationEndsAt: z.string().datetime(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const cohortAssignmentResponseSchema = z.object({
  id: z.string().uuid(),
  cohortId: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  content: z.string(),
  isPublished: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const cohortTrackResponseSchema = z.object({
  id: z.string().uuid(),
  cohortId: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  sortOrder: z.number().int(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const cohortFormFieldOptionResponseSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  value: z.string(),
  sortOrder: z.number().int(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const cohortFormFieldResponseSchema = z.object({
  id: z.string().uuid(),
  cohortId: z.string().uuid(),
  key: z.string(),
  label: z.string(),
  type: z.enum([FormFieldType.text, FormFieldType.select]),
  isRequired: z.boolean(),
  sortOrder: z.number().int(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  options: z.array(cohortFormFieldOptionResponseSchema),
});

const authResponseSchema = z.object({
  user: userResponseSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
});

const paginationSchema = z.object({
  page: z.number().int(),
  limit: z.number().int(),
  total: z.number().int(),
  pages: z.number().int(),
});

const usersListResponseSchema = z.object({
  items: z.array(userResponseSchema),
  pagination: paginationSchema,
});

const practiceProfileDetailsResponseSchema = z.object({
  profile: practiceProfileResponseSchema.nullable(),
});

const practiceReviewDetailsResponseSchema = z.object({
  review: practiceReviewResponseSchema.nullable(),
});

const practiceReportDetailsResponseSchema = z.object({
  report: practiceReportResponseSchema.nullable(),
});

const practiceTaskDetailsResponseSchema = z.object({
  task: practiceTaskResponseSchema,
});

const practiceTasksListResponseSchema = z.object({
  items: z.array(practiceTaskResponseSchema),
});

const taskParticipantResponseSchema = z.object({
  userId: z.string().uuid(),
  fullName: z.string().nullable(),
  track: z
    .object({
      id: z.string().uuid(),
      title: z.string(),
    })
    .nullable(),
  tasks: z.array(practiceTaskResponseSchema),
});

const taskParticipantsListResponseSchema = z.object({
  items: z.array(taskParticipantResponseSchema),
});

const cohortDetailsResponseSchema = z.object({
  cohort: cohortResponseSchema,
});

const cohortAssignmentDetailsResponseSchema = z.object({
  assignment: cohortAssignmentResponseSchema.nullable(),
});

const cohortTrackDetailsResponseSchema = z.object({
  track: cohortTrackResponseSchema,
});

const cohortTracksListResponseSchema = z.object({
  items: z.array(cohortTrackResponseSchema),
});

const cohortFormResponseSchema = z.object({
  fields: z.array(cohortFormFieldResponseSchema),
});

const publicCohortResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  applicationStartsAt: z.string().datetime(),
  applicationEndsAt: z.string().datetime(),
  isApplicationOpen: z.boolean(),
  form: cohortFormResponseSchema,
});

const publicCohortDetailsResponseSchema = z.object({
  cohort: publicCohortResponseSchema,
});

const cohortsListResponseSchema = z.object({
  items: z.array(cohortResponseSchema),
  pagination: paginationSchema,
});

const practiceApplicationAnswerResponseSchema = z.object({
  id: z.string().uuid(),
  applicationId: z.string().uuid(),
  fieldId: z.string().uuid(),
  optionId: z.string().uuid().nullable(),
  value: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const practiceApplicationResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  cohortId: z.string().uuid(),
  trackId: z.string().uuid().nullable(),
  status: z.enum([
    PracticeApplicationStatus.pending,
    PracticeApplicationStatus.approved,
    PracticeApplicationStatus.rejected,
  ]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  cohort: cohortResponseSchema,
  track: cohortTrackResponseSchema.nullable(),
  user: userResponseSchema.optional(),
  answers: z.array(practiceApplicationAnswerResponseSchema),
});

const practiceApplicationDetailsResponseSchema = z.object({
  application: practiceApplicationResponseSchema,
});

const practiceApplicationsListResponseSchema = z.object({
  items: z.array(practiceApplicationResponseSchema),
});

const applicationAutofillAnswerResponseSchema = z.object({
  fieldId: z.string().uuid(),
  value: z.string().optional(),
  optionId: z.string().uuid().optional(),
});

const applicationAutofillResponseSchema = z.object({
  answers: z.array(applicationAutofillAnswerResponseSchema),
});

export {
  applicationAutofillAnswerResponseSchema,
  applicationAutofillResponseSchema,
  authResponseSchema,
  cohortAssignmentDetailsResponseSchema,
  cohortAssignmentResponseSchema,
  cohortDetailsResponseSchema,
  cohortFormFieldOptionResponseSchema,
  cohortFormFieldResponseSchema,
  cohortFormResponseSchema,
  cohortResponseSchema,
  cohortTrackDetailsResponseSchema,
  cohortTrackResponseSchema,
  cohortTracksListResponseSchema,
  cohortsListResponseSchema,
  errorResponseSchema,
  practiceApplicationAnswerResponseSchema,
  practiceApplicationDetailsResponseSchema,
  practiceApplicationResponseSchema,
  practiceApplicationsListResponseSchema,
  practiceProfileDetailsResponseSchema,
  practiceProfileResponseSchema,
  practiceReportDetailsResponseSchema,
  practiceReportResponseSchema,
  practiceTaskDetailsResponseSchema,
  practiceTaskResponseSchema,
  practiceTasksListResponseSchema,
  taskParticipantResponseSchema,
  taskParticipantsListResponseSchema,
  practiceReviewDetailsResponseSchema,
  practiceReviewResponseSchema,
  publicCohortDetailsResponseSchema,
  publicCohortResponseSchema,
  userResponseSchema,
  usersListResponseSchema,
};
