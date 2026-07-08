-- AlterTable
ALTER TABLE "practice_applications" ADD COLUMN     "track_id" TEXT;

-- CreateTable
CREATE TABLE "cohort_tracks" (
    "id" TEXT NOT NULL,
    "cohort_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cohort_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cohort_tracks_cohort_id_idx" ON "cohort_tracks"("cohort_id");

-- CreateIndex
CREATE UNIQUE INDEX "cohort_tracks_cohort_id_title_key" ON "cohort_tracks"("cohort_id", "title");

-- CreateIndex
CREATE INDEX "practice_applications_track_id_idx" ON "practice_applications"("track_id");

-- AddForeignKey
ALTER TABLE "cohort_tracks" ADD CONSTRAINT "cohort_tracks_cohort_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "cohorts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_applications" ADD CONSTRAINT "practice_applications_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "cohort_tracks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
