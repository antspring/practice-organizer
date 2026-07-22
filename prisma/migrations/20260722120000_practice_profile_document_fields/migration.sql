-- Preserve existing specialty values as the direction name.
ALTER TABLE "practice_profiles" RENAME COLUMN "specialty" TO "direction_name";

ALTER TABLE "practice_profiles"
ADD COLUMN "full_name_genitive" TEXT,
ADD COLUMN "direction_code" TEXT,
ADD COLUMN "urfu_practice_supervisor" TEXT,
ADD COLUMN "main_stage_work_list" TEXT;
