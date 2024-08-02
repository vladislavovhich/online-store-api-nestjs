import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [PropertyController],
  providers: [PropertyService],
  imports: [UserModule, PrismaModule],
  exports: [PropertyService]
})
export class PropertyModule {}
