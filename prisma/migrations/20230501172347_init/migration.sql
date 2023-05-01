/*
  Warnings:

  - Added the required column `modified_on` to the `Priority` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Priority" ADD COLUMN     "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "deleted_on" TIMESTAMP(3),
ADD COLUMN     "modified_by" TEXT,
ADD COLUMN     "modified_on" TIMESTAMP(3) NOT NULL;
