/*
  Warnings:

  - You are about to drop the column `r_firstname` on the `t_user` table. All the data in the column will be lost.
  - You are about to drop the column `r_name` on the `t_user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "t_user" DROP COLUMN "r_firstname",
DROP COLUMN "r_name",
ADD COLUMN     "r_firstName" TEXT,
ADD COLUMN     "r_lastName" TEXT;
