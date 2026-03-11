/*
  Warnings:

  - You are about to drop the column `r_nom` on the `t_pays` table. All the data in the column will be lost.
  - Added the required column `nom` to the `t_pays` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "t_pays" DROP COLUMN "r_nom",
ADD COLUMN     "nom" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "t_continent" (
    "r_i" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "t_continent_pkey" PRIMARY KEY ("r_i")
);
