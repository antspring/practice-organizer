-- CreateTable
CREATE TABLE "practice_reviews" (
    "id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "activities" TEXT,
    "characteristic" TEXT,
    "is_employed" BOOLEAN,
    "employment_position" TEXT,
    "is_next_practice_offered" BOOLEAN,
    "is_employment_offered" BOOLEAN,
    "suggestions" TEXT,
    "grade" TEXT,
    "is_ready" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "practice_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "practice_reviews_application_id_key" ON "practice_reviews"("application_id");

-- AddForeignKey
ALTER TABLE "practice_reviews" ADD CONSTRAINT "practice_reviews_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "practice_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
