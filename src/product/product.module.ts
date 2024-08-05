import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { PropertyModule } from 'src/property/property.module';
import { CategoryModule } from 'src/category/category.module';
import { ReviewModule } from 'src/review/review.module';
import { ImageModule } from 'src/image/image.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [PrismaModule, UserModule, PropertyModule, CategoryModule, ReviewModule, ImageModule],
  exports: [ProductService]
})
export class ProductModule {}
