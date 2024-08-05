/*
  Warnings:

  - You are about to drop the column `imagableId` on the `images` table. All the data in the column will be lost.
  - You are about to drop the column `imagableType` on the `images` table. All the data in the column will be lost.
  - Added the required column `imageableId` to the `images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageableType` to the `images` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ImageableType" AS ENUM ('User', 'Product', 'Review');

-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "product_imagableId";

-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "review_imagableId";

-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "user_imagableId";

-- AlterTable
ALTER TABLE "images" DROP COLUMN "imagableId",
DROP COLUMN "imagableType",
ADD COLUMN     "imageableId" INTEGER NOT NULL,
ADD COLUMN     "imageableType" "ImageableType" NOT NULL;

-- DropEnum
DROP TYPE "ImagableType";

-- CreateIndex
CREATE INDEX "imageable_index" ON "images"("imageableId", "imageableType");

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "image_user_fkey" FOREIGN KEY ("imageableId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "image_review_fkey" FOREIGN KEY ("imageableId") REFERENCES "reviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "image_product_fkey" FOREIGN KEY ("imageableId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
