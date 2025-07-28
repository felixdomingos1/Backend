-- AlterTable
ALTER TABLE "users" ADD COLUMN     "resetToken" VARCHAR(255),
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);
