/*
  Warnings:

  - You are about to drop the column `displayName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `AccessLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Dataset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShareToken` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."AccessLog" DROP CONSTRAINT "AccessLog_datasetId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AccessLog" DROP CONSTRAINT "AccessLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShareToken" DROP CONSTRAINT "ShareToken_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShareToken" DROP CONSTRAINT "ShareToken_datasetId_fkey";

-- DropIndex
DROP INDEX "public"."User_username_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "displayName",
DROP COLUMN "updatedAt",
DROP COLUMN "username",
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';

-- DropTable
DROP TABLE "public"."AccessLog";

-- DropTable
DROP TABLE "public"."Dataset";

-- DropTable
DROP TABLE "public"."ShareToken";

-- DropEnum
DROP TYPE "public"."HttpMethod";

-- DropEnum
DROP TYPE "public"."LogAction";

-- DropEnum
DROP TYPE "public"."UserRole";

-- CreateTable
CREATE TABLE "public"."Log" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "actionType" TEXT NOT NULL,
    "actionDetails" TEXT,
    "isSuccess" BOOLEAN NOT NULL DEFAULT true,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "device" TEXT,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
