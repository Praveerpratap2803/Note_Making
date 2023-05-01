-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "count_edit" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "count_priority" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "start_date" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Priority" (
    "id" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "note_id" TEXT NOT NULL,

    CONSTRAINT "Priority_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Priority" ADD CONSTRAINT "Priority_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
