/*
  Warnings:

  - You are about to drop the `CategoryProperty` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CategoryProperty" DROP CONSTRAINT "CategoryProperty_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategoryProperty" DROP CONSTRAINT "CategoryProperty_propertyId_fkey";

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "categoryId" INTEGER;

-- DropTable
DROP TABLE "CategoryProperty";

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
