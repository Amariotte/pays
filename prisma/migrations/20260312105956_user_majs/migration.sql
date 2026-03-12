/*
  Warnings:

  - A unique constraint covering the columns `[r_tokenHash]` on the table `t_refresh_token` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "t_user" ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "r_firstname" TEXT,
ADD COLUMN     "r_name" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "t_refresh_token_r_tokenHash_key" ON "t_refresh_token"("r_tokenHash");
