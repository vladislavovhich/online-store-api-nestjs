import { Module } from '@nestjs/common';
import { TypeService } from './type.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [TypeService],
  imports: [PrismaModule]
})
export class TypeModule {}
