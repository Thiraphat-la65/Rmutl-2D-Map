/*
  Warnings:

  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `CopyHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."HttpMethod" AS ENUM ('GET', 'POST', 'PUT', 'DELETE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."LogAction" AS ENUM ('COPY', 'ACCESS', 'DOWNLOAD', 'REQUEST');

-- DropForeignKey
ALTER TABLE "public"."CopyHistory" DROP CONSTRAINT "CopyHistory_userId_fkey";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "displayName" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "public"."CopyHistory";

-- CreateTable
CREATE TABLE "public"."Dataset" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "resourceType" TEXT,
    "httpMethod" "public"."HttpMethod" NOT NULL DEFAULT 'GET',
    "url" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dataset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AccessLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "datasetId" INTEGER NOT NULL,
    "action" "public"."LogAction" NOT NULL,
    "httpMethod" "public"."HttpMethod",
    "userAgent" TEXT,
    "ip" TEXT,
    "referer" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccessLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShareToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "datasetId" INTEGER NOT NULL,
    "createdBy" INTEGER,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShareToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Dataset_name_idx" ON "public"."Dataset"("name");

-- CreateIndex
CREATE INDEX "AccessLog_datasetId_createdAt_idx" ON "public"."AccessLog"("datasetId", "createdAt");

-- CreateIndex
CREATE INDEX "AccessLog_userId_createdAt_idx" ON "public"."AccessLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AccessLog_createdAt_idx" ON "public"."AccessLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ShareToken_token_key" ON "public"."ShareToken"("token");

-- CreateIndex
CREATE INDEX "ShareToken_datasetId_idx" ON "public"."ShareToken"("datasetId");

-- AddForeignKey
ALTER TABLE "public"."AccessLog" ADD CONSTRAINT "AccessLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccessLog" ADD CONSTRAINT "AccessLog_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "public"."Dataset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShareToken" ADD CONSTRAINT "ShareToken_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "public"."Dataset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShareToken" ADD CONSTRAINT "ShareToken_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
