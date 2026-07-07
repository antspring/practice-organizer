-- AddColumns
ALTER TABLE "cohorts"
ADD COLUMN "public_slug" TEXT,
ADD COLUMN "application_starts_at" TIMESTAMP(3),
ADD COLUMN "application_ends_at" TIMESTAMP(3);

-- Backfill existing cohorts before making public access fields required.
UPDATE "cohorts"
SET
    "public_slug" = lower(regexp_replace("title", '[^a-zA-Z0-9]+', '-', 'g')) || '-' || left("id", 8),
    "application_starts_at" = "starts_at",
    "application_ends_at" = "ends_at"
WHERE
    "public_slug" IS NULL
    OR "application_starts_at" IS NULL
    OR "application_ends_at" IS NULL;

-- AlterColumns
ALTER TABLE "cohorts"
ALTER COLUMN "public_slug" SET NOT NULL,
ALTER COLUMN "application_starts_at" SET NOT NULL,
ALTER COLUMN "application_ends_at" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cohorts_public_slug_key" ON "cohorts"("public_slug");
