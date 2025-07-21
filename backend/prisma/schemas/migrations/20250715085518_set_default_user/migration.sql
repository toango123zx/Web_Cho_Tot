-- AlterTable
ALTER TABLE "Accounts" ALTER COLUMN "verify" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "role" SET DEFAULT 'user',
ALTER COLUMN "avatar" SET DEFAULT 'https://i.pinimg.com/1200x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg',
ALTER COLUMN "balance" SET DEFAULT 0;
