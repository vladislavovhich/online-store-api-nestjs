import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeModule } from './type/type.module';
import { PropertyModule } from './property/property.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, TypeModule, PropertyModule, CategoryModule, ProductModule, ReviewModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
