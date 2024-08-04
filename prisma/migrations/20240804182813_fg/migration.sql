-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "product_imagableId";

-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "review_imagableId";

-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "user_imagableId";

-- AlterTable
ALTER TABLE "images" ALTER COLUMN "imagableId" DROP NOT NULL,
ALTER COLUMN "imagableType" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "user_imagableId" FOREIGN KEY ("imagableId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "review_imagableId" FOREIGN KEY ("imagableId") REFERENCES "reviews"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "product_imagableId" FOREIGN KEY ("imagableId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
