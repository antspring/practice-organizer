-- CreateEnum
CREATE TYPE "PracticeApplicationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "practice_applications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "cohort_id" TEXT NOT NULL,
    "status" "PracticeApplicationStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "practice_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practice_application_answers" (
    "id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "field_id" TEXT NOT NULL,
    "option_id" TEXT,
    "value" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "practice_application_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "practice_applications_cohort_id_idx" ON "practice_applications"("cohort_id");

-- CreateIndex
CREATE INDEX "practice_applications_user_id_idx" ON "practice_applications"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "practice_applications_user_id_cohort_id_key" ON "practice_applications"("user_id", "cohort_id");

-- CreateIndex
CREATE INDEX "practice_application_answers_application_id_idx" ON "practice_application_answers"("application_id");

-- CreateIndex
CREATE INDEX "practice_application_answers_field_id_idx" ON "practice_application_answers"("field_id");

-- CreateIndex
CREATE INDEX "practice_application_answers_option_id_idx" ON "practice_application_answers"("option_id");

-- CreateIndex
CREATE UNIQUE INDEX "practice_application_answers_application_id_field_id_key" ON "practice_application_answers"("application_id", "field_id");

-- AddForeignKey
ALTER TABLE "practice_applications" ADD CONSTRAINT "practice_applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_applications" ADD CONSTRAINT "practice_applications_cohort_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "cohorts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_application_answers" ADD CONSTRAINT "practice_application_answers_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "practice_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_application_answers" ADD CONSTRAINT "practice_application_answers_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "cohort_form_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_application_answers" ADD CONSTRAINT "practice_application_answers_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "cohort_form_field_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;
