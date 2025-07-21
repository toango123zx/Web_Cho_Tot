/*
  Warnings:

  - You are about to drop the column `dob` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "dob",
ADD COLUMN     "date_of_birth" TIMESTAMP(3),
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "phone_number" DROP NOT NULL,
ALTER COLUMN "avatar" DROP NOT NULL,
ALTER COLUMN "bio" DROP NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "balance" DROP NOT NULL;
