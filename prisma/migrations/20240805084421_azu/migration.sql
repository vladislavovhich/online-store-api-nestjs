/*
  Warnings:

  - Changed the type of `imageableType` on the `images` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "images" DROP COLUMN "imageableType",
ADD COLUMN     "imageableType" TEXT NOT NULL;

-- RenameForeignKey
ALTER TABLE "images" RENAME CONSTRAINT "image_product_fkey" TO "product_image_key";

-- RenameForeignKey
ALTER TABLE "images" RENAME CONSTRAINT "image_review_fkey" TO "review_image_key";

-- RenameForeignKey
ALTER TABLE "images" RENAME CONSTRAINT "image_user_fkey" TO "user_image_key";
