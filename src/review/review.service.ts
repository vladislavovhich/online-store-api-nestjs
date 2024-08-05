import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/product/product.service';
import { ImageService } from 'src/image/image.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageService: ImageService
  ) {}

  async create(createReviewDto: CreateReviewDto, userId: number, productId: number, files?: Express.Multer.File[]) {
    const review = await this.prisma.review.create({
      data: {
        text: createReviewDto.text,
        rating: createReviewDto.rating,
        user: {connect: {id: userId}},
        product: {connect: {id: productId}}
      }
    })

    if (files) {
      const images = []

      for (let file of files) {
        const image = await this.imageService.upload(review.id, 'Review', file)

        images.push(image)
      }

      return {...review, images}
    }

    return review
  }

  async findAll(productId: number) {
    return await this.prisma.review.findMany({where: {productId}})
  }

  async findOne(id: number, productId: number) {
    const images = await this.imageService.getImages(id, 'Review')
    const review = await this.prisma.review.findFirstOrThrow({where: {id, productId}})

    return {...review, images}
  }

  async update(id: number, updateReviewDto: UpdateReviewDto, files?: Express.Multer.File[]) {
    const review = await this.prisma.review.update({
      where: {id},
      data: {
        text: updateReviewDto.text,
        rating: updateReviewDto.rating,
      }
    })

    if (files) {
      const images = []

      for (let file of files) {
        const image = await this.imageService.upload(review.id, 'Review', file)

        images.push(image)
      }

      return {...review, images}
    }

    return review
  }

  async remove(id: number) {
    return await this.prisma.review.delete({where: {id}})
  }
}
