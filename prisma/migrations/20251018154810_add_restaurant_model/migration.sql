-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "restaurant_id" DROP DEFAULT;

-- CreateTable
CREATE TABLE "restaurants" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "descriptionTk" TEXT,
    "logo" TEXT,
    "image" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "rating" DOUBLE PRECISION DEFAULT 0,
    "gradient" TEXT DEFAULT 'from-emerald-500 via-teal-500 to-emerald-700',
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "delivery_time" TEXT,
    "features" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "restaurants_slug_key" ON "restaurants"("slug");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
