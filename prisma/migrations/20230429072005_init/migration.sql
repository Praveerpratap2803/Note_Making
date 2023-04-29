/*
  Warnings:

  - Made the column `favorite` on table `Note` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Note" ALTER COLUMN "favorite" SET NOT NULL;
