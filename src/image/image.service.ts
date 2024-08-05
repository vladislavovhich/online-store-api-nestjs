import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ImageableType } from '@prisma/client';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ImageService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cloudinary: CloudinaryService
    ) {}

    async upload(imageableId: number, imageableType: ImageableType, file: Express.Multer.File) {
        const {url} = await this.cloudinary.uploadImage(file)

        return await this.prisma.image.create({
            data: {
                url,
                imageableType,
                imageableId
            }
        })
    }

    async getImages(imageableId: number, imageableType: ImageableType) {
        return await this.prisma.image.findMany({
            where: {
                imageableType,
                imageableId
            }
        })
    }
}
