-- Add key as nullable first so existing form fields can be backfilled safely.
ALTER TABLE "cohort_form_fields" ADD COLUMN "key" TEXT;

-- Existing legacy fields did not have stable semantic keys. Use id as unique fallback.
UPDATE "cohort_form_fields" SET "key" = "id" WHERE "key" IS NULL;

ALTER TABLE "cohort_form_fields" ALTER COLUMN "key" SET NOT NULL;

CREATE UNIQUE INDEX "cohort_form_fields_cohort_id_key_key" ON "cohort_form_fields"("cohort_id", "key");
