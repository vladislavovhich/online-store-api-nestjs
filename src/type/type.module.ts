import { Module } from '@nestjs/common';
import { TypeService } from './type.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TypeController } from './type.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [TypeService],
  imports: [PrismaModule, UserModule],
  controllers: [TypeController]
})
export class TypeModule {}
