import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [PrismaModule, UserModule],
  exports: [ReviewService]
})
export class ReviewModule {}
