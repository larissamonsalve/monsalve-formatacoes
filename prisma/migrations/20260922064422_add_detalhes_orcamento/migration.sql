/*
  Warnings:

  - Added the required column `norma` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paginas` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prazo` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valorEstimado` to the `Lead` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "comentarios" TEXT,
ADD COLUMN     "ia" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "norma" TEXT NOT NULL,
ADD COLUMN     "paginas" INTEGER NOT NULL,
ADD COLUMN     "plagio" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "prazo" INTEGER NOT NULL,
ADD COLUMN     "revisao" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "valorEstimado" DOUBLE PRECISION NOT NULL;
