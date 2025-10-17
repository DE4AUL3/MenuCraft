-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'customer',
ADD COLUMN     "email" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "notes" TEXT;
