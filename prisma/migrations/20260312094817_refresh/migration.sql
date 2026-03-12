-- CreateTable
CREATE TABLE "t_refresh_token" (
    "r_i" SERIAL NOT NULL,
    "r_userId" INTEGER NOT NULL,
    "r_tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_refresh_token_pkey" PRIMARY KEY ("r_i")
);

-- AddForeignKey
ALTER TABLE "t_refresh_token" ADD CONSTRAINT "t_refresh_token_r_userId_fkey" FOREIGN KEY ("r_userId") REFERENCES "t_user"("r_i") ON DELETE RESTRICT ON UPDATE CASCADE;
