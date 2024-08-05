import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeModule } from './type/type.module';
import { PropertyModule } from './property/property.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ImageModule } from './image/image.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [NestjsFormDataModule, PrismaModule, UserModule, AuthModule, TypeModule, PropertyModule, CategoryModule, ProductModule, ReviewModule, CloudinaryModule, ImageModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
