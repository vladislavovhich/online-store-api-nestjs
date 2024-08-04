-- CreateEnum
CREATE TYPE "ImagableType" AS ENUM ('User', 'Product', 'Review');

-- CreateTable
CREATE TABLE "images" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "imagableId" INTEGER NOT NULL,
    "imagableType" "ImagableType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "user_imagableId" FOREIGN KEY ("imagableId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "review_imagableId" FOREIGN KEY ("imagableId") REFERENCES "reviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "product_imagableId" FOREIGN KEY ("imagableId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
