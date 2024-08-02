import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PropertyService } from 'src/property/property.service';
import { AddPropertyDto } from './dto/add-property.dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly propertyService: PropertyService
  ) {}

  async getCategoryProperties(id: number) {
    return await this.prisma.category.findFirst({
      where: {id},
      include: {
        properties: {
          include: {
            type: true
          }
        }
      }
    })
  }

  async addProperty(addPropertyDto: AddPropertyDto) {
    await this.propertyService.findOne(addPropertyDto.propertyId)
    await this.findOne(addPropertyDto.categoryId)

    await this.prisma.property.update({
      where: {id: addPropertyDto.propertyId},
      data: {
        category: {connect: {id: addPropertyDto.categoryId}}
      }
    })
  }

  async removeProperty(addPropertyDto: AddPropertyDto) {
    await this.propertyService.findOne(addPropertyDto.propertyId)
    await this.findOne(addPropertyDto.categoryId)

    await this.prisma.property.update({
      where: {id: addPropertyDto.propertyId},
      data: {
        category: {disconnect: {id: addPropertyDto.categoryId}}
      }
    })
  }
  
  async create(createCategoryDto: CreateCategoryDto) {
    return await this.prisma.category.create({
      data: createCategoryDto
    })
  }

  async findAll() {
    return await this.prisma.category.findMany()
  }

  async findOne(id: number) {
    return await this.prisma.category.findFirstOrThrow({ where: {id} })
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return await this.prisma.category.update({
      where: {id},
      data: updateCategoryDto
    })
  }

  async remove(id: number) {
    return await this.prisma.category.delete({where: {id}})
  }
}
