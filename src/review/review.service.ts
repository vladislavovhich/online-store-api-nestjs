import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async create(createReviewDto: CreateReviewDto, userId: number, productId: number) {
    return await this.prisma.review.create({
      data: {
        text: createReviewDto.text,
        rating: createReviewDto.rating,
        user: {connect: {id: userId}},
        product: {connect: {id: productId}}
      }
    })
  }

  async findAll(productId: number) {
    return await this.prisma.review.findMany({where: {productId}})
  }

  async findOne(id: number, productId: number) {
    return await this.prisma.review.findFirstOrThrow({where: {id, productId}})
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    return await this.prisma.review.update({
      where: {id},
      data: {
        text: updateReviewDto.text,
        rating: updateReviewDto.rating,
      }
    })
  }

  async remove(id: number) {
    return await this.prisma.review.delete({where: {id}})
  }
}
