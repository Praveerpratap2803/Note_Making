-- CreateEnum
CREATE TYPE "Favorite" AS ENUM ('Yes', 'No');

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "favorite" "Favorite" NOT NULL DEFAULT 'No';
