/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Booking_name_key" ON "Booking"("name");
