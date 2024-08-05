import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { ImageModule } from 'src/image/image.module';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [PrismaModule, UserModule, ImageModule],
  exports: [ReviewService]
})
export class ReviewModule {}
