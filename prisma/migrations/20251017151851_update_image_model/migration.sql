-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "restaurant_id" SET DEFAULT 'han-tagam';

-- AlterTable
ALTER TABLE "images" ADD COLUMN     "original_filename" TEXT,
ADD COLUMN     "type" TEXT;
