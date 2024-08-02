import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { PropertyModule } from 'src/property/property.module';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [UserModule, PrismaModule, PropertyModule],
  exports: [CategoryService]
})
export class CategoryModule {}
