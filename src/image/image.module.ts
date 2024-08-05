import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { PrismaModule } from 'nestjs-prisma';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  providers: [ImageService],
  imports: [PrismaModule, CloudinaryModule],
  exports: [ImageService]
})
export class ImageModule {}
