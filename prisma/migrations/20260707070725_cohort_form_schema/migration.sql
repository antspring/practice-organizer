-- CreateEnum
CREATE TYPE "FormFieldType" AS ENUM ('text', 'select');

-- CreateTable
CREATE TABLE "cohort_form_fields" (
    "id" TEXT NOT NULL,
    "cohort_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "FormFieldType" NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cohort_form_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cohort_form_field_options" (
    "id" TEXT NOT NULL,
    "field_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cohort_form_field_options_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cohort_form_fields_cohort_id_idx" ON "cohort_form_fields"("cohort_id");

-- CreateIndex
CREATE INDEX "cohort_form_field_options_field_id_idx" ON "cohort_form_field_options"("field_id");

-- CreateIndex
CREATE UNIQUE INDEX "cohort_form_field_options_field_id_value_key" ON "cohort_form_field_options"("field_id", "value");

-- AddForeignKey
ALTER TABLE "cohort_form_fields" ADD CONSTRAINT "cohort_form_fields_cohort_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "cohorts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cohort_form_field_options" ADD CONSTRAINT "cohort_form_field_options_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "cohort_form_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;
