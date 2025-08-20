/*
  Warnings:

  - Added the required column `times` to the `ContactUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContactUser" ADD COLUMN     "times" TEXT NOT NULL;
