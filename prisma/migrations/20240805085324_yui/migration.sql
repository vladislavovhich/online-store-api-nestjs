/*
  Warnings:

  - Changed the type of `imageableType` on the `images` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "product_image_key";

-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "review_image_key";

-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "user_image_key";

-- AlterTable
ALTER TABLE "images" DROP COLUMN "imageableType",
ADD COLUMN     "imageableType" "ImageableType" NOT NULL;
