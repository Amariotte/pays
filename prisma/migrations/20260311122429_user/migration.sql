/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "t_user" (
    "r_i" SERIAL NOT NULL,
    "r_email" TEXT NOT NULL,
    "r_passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "t_user_pkey" PRIMARY KEY ("r_i")
);

-- CreateIndex
CREATE UNIQUE INDEX "t_user_r_email_key" ON "t_user"("r_email");
