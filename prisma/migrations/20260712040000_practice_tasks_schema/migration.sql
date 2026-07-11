CREATE TABLE "practice_tasks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "cohort_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "artifact_link" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "practice_tasks_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "practice_tasks_cohort_id_date_idx" ON "practice_tasks"("cohort_id", "date");
CREATE INDEX "practice_tasks_user_id_date_idx" ON "practice_tasks"("user_id", "date");
CREATE UNIQUE INDEX "practice_tasks_user_id_cohort_id_date_key"
ON "practice_tasks"("user_id", "cohort_id", "date");

ALTER TABLE "practice_tasks"
ADD CONSTRAINT "practice_tasks_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "practice_tasks"
ADD CONSTRAINT "practice_tasks_cohort_id_fkey"
FOREIGN KEY ("cohort_id") REFERENCES "cohorts"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
