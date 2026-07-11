CREATE TABLE "practice_reports" (
    "id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "storage_key" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "practice_reports_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "practice_reports_application_id_key" ON "practice_reports"("application_id");
CREATE UNIQUE INDEX "practice_reports_storage_key_key" ON "practice_reports"("storage_key");

ALTER TABLE "practice_reports"
ADD CONSTRAINT "practice_reports_application_id_fkey"
FOREIGN KEY ("application_id") REFERENCES "practice_applications"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
