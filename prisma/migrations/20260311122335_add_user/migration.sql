-- CreateTable
CREATE TABLE "User" (
    "r_i" SERIAL NOT NULL,
    "r_email" TEXT NOT NULL,
    "r_passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("r_i")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_r_email_key" ON "User"("r_email");
