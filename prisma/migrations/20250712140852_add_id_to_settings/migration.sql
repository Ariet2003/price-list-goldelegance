/*
  Warnings:

  - The primary key for the `settings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[key]` on the table `settings` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "settings" DROP CONSTRAINT "settings_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "settings_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");
