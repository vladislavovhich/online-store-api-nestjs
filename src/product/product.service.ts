import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto, ProductPropertyDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryService } from 'src/category/category.service';
import { Review } from '@prisma/client';
import { ReviewService } from 'src/review/review.service';
import { ImageService } from 'src/image/image.service';
import { GetAllProductsDto } from './dto/get-all-products.dto';
import { handleQueryParams } from 'src/common/helpers/filtering-params.helper';
import { AllProductsType } from './dto/product.types';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryService: CategoryService,
    private readonly imageService: ImageService
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

    const product = await this.prisma.product.create({
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

    return product
  }

  calculateAverageRating(reviews: Review[]) {
    if (!reviews || !reviews.length) {
      return 0
    }

    const rating = reviews.reduce((val, prev) => prev.rating + val, 0) / reviews.length

    return +rating.toFixed(2)
  }

  async findAll(getProductsDto: GetAllProductsDto) {
    const {page, pageSize} = getProductsDto
    const orderByProps = handleQueryParams(getProductsDto, 'Order')
    const offset = (page - 1) * pageSize
    const count = await this.prisma.product.count()
    const hasNextPage = count - page * pageSize > 0
    const hasPrevPage = page > 1 && count - (page - 1) * pageSize > 0

    const productsAll = await this.prisma.product.findMany({
      skip: offset,
      take: pageSize,
      include: {
        reviews: true
      },
      orderBy: orderByProps,
      where: {categoryId: getProductsDto.categoryId}
    })

    const products = []

    for (let product of productsAll) {
      const averageRating = this.calculateAverageRating(product.reviews)
      const images = await this.imageService.getImages(product.id, 'Product')
      
      products.push({...product, cover: images.length ? images.at(-1) : null, averageRating})
    }

    const result: AllProductsType = {products}

    if (hasNextPage) {
      result.nextPage = page + 1
    }

    if (hasPrevPage) {
      result.prevPage = page - 1
    }

    return result
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findFirstOrThrow({
      where: {id},
      include: {
        category: true,
        seller: true,
        reviews: true,
        properties: {
          include: {
            property: true
          }
        }
      }
    })

    const images = await this.imageService.getImages(id, 'Product')

    return {...product, averageRating: this.calculateAverageRating(product.reviews), cover: images.at(-1)}
  }
  
  async uploadCover(id: number, file: Express.Multer.File) {
    const product = await this.findOne(id)
    const image = await this.imageService.upload(id, 'Product', file)

    return {...product, cover: image}
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.checkProperties(updateProductDto.categoryId, updateProductDto.productProperties, true)

    const product = await this.prisma.product.update({
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

    return product
  }

  async remove(id: number) {
    return await this.prisma.product.delete({where: {id}})
  }
}
