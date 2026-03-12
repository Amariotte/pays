/*
  Warnings:

  - You are about to drop the column `birthDate` on the `t_user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "t_user" DROP COLUMN "birthDate",
ADD COLUMN     "r_birthDate" TIMESTAMP(3);
