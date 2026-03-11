/*
  Warnings:

  - You are about to drop the column `nom` on the `t_continent` table. All the data in the column will be lost.
  - You are about to drop the column `nom` on the `t_pays` table. All the data in the column will be lost.
  - Added the required column `r_nom` to the `t_continent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `r_nom` to the `t_pays` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "t_continent" DROP COLUMN "nom",
ADD COLUMN     "r_nom" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "t_pays" DROP COLUMN "nom",
ADD COLUMN     "r_nom" TEXT NOT NULL;
