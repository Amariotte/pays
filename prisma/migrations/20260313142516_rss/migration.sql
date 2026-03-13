/*
  Warnings:

  - The primary key for the `t_message_email` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `r_i` column on the `t_message_email` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `r_status` column on the `t_message_email` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "STATUS_MESSAGE" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "TYPE_MESSAGE" AS ENUM ('INSCRIPTION', 'PASSWORD_RESET', 'NOTIFICATION', 'SMS');

-- CreateEnum
CREATE TYPE "PLATEFORME_MESSAGE" AS ENUM ('EMAIL', 'SMS');

-- AlterTable
ALTER TABLE "t_message_email" DROP CONSTRAINT "t_message_email_pkey",
DROP COLUMN "r_i",
ADD COLUMN     "r_i" SERIAL NOT NULL,
DROP COLUMN "r_status",
ADD COLUMN     "r_status" "STATUS_MESSAGE" NOT NULL DEFAULT 'PENDING',
ADD CONSTRAINT "t_message_email_pkey" PRIMARY KEY ("r_i");

-- AlterTable
ALTER TABLE "t_user" ADD COLUMN     "r_phone" TEXT;

-- DropEnum
DROP TYPE "MessageStatus";

-- CreateTable
CREATE TABLE "t_message_template" (
    "r_i" SERIAL NOT NULL,
    "r_name" TEXT NOT NULL,
    "r_subject" TEXT NOT NULL,
    "r_content" TEXT NOT NULL,
    "r_type" "TYPE_MESSAGE" NOT NULL,
    "r_plateforme" "PLATEFORME_MESSAGE" NOT NULL,
    "r_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "t_message_template_pkey" PRIMARY KEY ("r_i")
);

-- CreateTable
CREATE TABLE "t_sms_message" (
    "r_i" SERIAL NOT NULL,
    "r_phone" TEXT NOT NULL,
    "r_content" TEXT NOT NULL,
    "r_status" "STATUS_MESSAGE" NOT NULL DEFAULT 'PENDING',
    "r_error" TEXT,
    "r_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "r_sentAt" TIMESTAMP(3),

    CONSTRAINT "t_sms_message_pkey" PRIMARY KEY ("r_i")
);

-- CreateIndex
CREATE UNIQUE INDEX "t_message_template_r_name_key" ON "t_message_template"("r_name");
