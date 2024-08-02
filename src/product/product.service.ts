import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto, ProductPropertyDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PropertyService } from 'src/property/property.service';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryService: CategoryService
  ) {}

  async checkProperties(categoryId: number, properties: ProductPropertyDto[], allowedEmpty: boolean = false) {
    const category = await this.categoryService.getCategoryProperties(categoryId)
    const categoryProperties = category.properties
    const props = Object.fromEntries(categoryProperties.map(property => ([property.id, {name: property.name, isValid: false, type: property.type.name}])))
  
    for (let property of properties) {
      props[property.propertyId].isValid = true
    }

    let missingProperties = []
    let typesErrors = []
    let isValid = true

    for (let prop in props) {
      if (!allowedEmpty && !props[prop].isValid) {
        isValid = false
        missingProperties.push(`'${props[prop].name}'`)
      } else {
        const property = properties.find(p => p.propertyId == +prop)

        if (property == undefined) {
          continue
        }

        const propVal = property.propertyValue

        switch (props[prop].type) {
          case "number": 
            if (Number.isNaN(+propVal)) {
              typesErrors.push(`property '${props[prop].name}' must be type '${props[prop].type}'`)
              isValid = false
            }
          break
        }
      }
    }

    if (!isValid) {
      let message = ""
      
      if (missingProperties.length) {
        message += `Missing properties: ${missingProperties.join(", ")}. `
      }

      if (typesErrors.length) {
        message += `Types errors: ${typesErrors.join(", ")}`
      }

      throw new BadRequestException(message)
    }
  }
  
  async create(createProductDto: CreateProductDto, userId: number) {
    await this.checkProperties(createProductDto.categoryId, createProductDto.productProperties)

    return await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        price: createProductDto.price,
        category: {connect: {id: createProductDto.categoryId}},
        seller: {connect: {id: userId}},
        properties: {
          create: createProductDto.productProperties.map(prop => ({
            value: prop.propertyValue,
            property: {
              connect: {id: prop.propertyId}
            }
          }))
        },
      },
      include: {
        category: true,
        seller: true,
        properties: {
          include: {
            property: true
          }
        }
      }
    })
  }

  async findAll() {
    return await this.prisma.product.findMany({
      include: {
        seller: true,
        category: true
      }
    })
  }

  async findOne(id: number) {
    return await this.prisma.product.findFirstOrThrow({
      where: {id},
      include: {
        category: true,
        seller: true,
        properties: {
          include: {
            property: true
          }
        }
      }
    })
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.checkProperties(updateProductDto.categoryId, updateProductDto.productProperties, true)

    return await this.prisma.product.update({
      where: {id},
      data: {
        name: updateProductDto.name,
        price: updateProductDto.price,
        properties: {
          updateMany: updateProductDto.productProperties.map(prop => ({
            where: {propertyId: prop.propertyId, productId: id},
            data: {value: prop.propertyValue}
          }))
        },
      },
      include: {
        category: true,
        seller: true,
        properties: {
          include: {
            property: true
          }
        }
      }
    })
  }

  async remove(id: number) {
    return await this.prisma.product.delete({where: {id}})
  }
}
