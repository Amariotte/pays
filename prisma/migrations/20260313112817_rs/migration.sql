-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- CreateTable
CREATE TABLE "t_message_email" (
    "r_i" TEXT NOT NULL,
    "r_to" TEXT NOT NULL,
    "r_subject" TEXT NOT NULL,
    "r_content" TEXT NOT NULL,
    "r_status" "MessageStatus" NOT NULL DEFAULT 'PENDING',
    "r_error" TEXT,
    "r_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "r_sentAt" TIMESTAMP(3),

    CONSTRAINT "t_message_email_pkey" PRIMARY KEY ("r_i")
);
