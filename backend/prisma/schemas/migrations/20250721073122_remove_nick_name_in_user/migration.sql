/*
  Warnings:

  - You are about to drop the column `nick_name` on the `Users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Users_nick_name_key";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "nick_name";

-- CreateIndex
CREATE UNIQUE INDEX "Users_name_key" ON "Users"("name");
