/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Room" DROP COLUMN "imageUrl",
DROP COLUMN "name",
ALTER COLUMN "floor" DROP NOT NULL;
