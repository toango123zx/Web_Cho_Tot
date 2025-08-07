-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Otps" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "otp" CHAR(6) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Otps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Otps_user_id_key" ON "Otps"("user_id");

-- AddForeignKey
ALTER TABLE "Otps" ADD CONSTRAINT "Otps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
