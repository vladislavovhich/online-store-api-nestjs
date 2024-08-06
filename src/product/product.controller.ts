import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/extract-user.decorator';
import { UserPayload } from 'src/auth/auth.types';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { Roles as UserRoles } from 'src/common/enums';
import { RolesGuard } from 'src/common/guards/check-role.guard';
import { Roles } from 'src/common/decorators/check-role.decorator';
import { OwnershipGuard } from 'src/common/guards/check-ownership.guard';
import { CheckOwnership } from 'src/common/decorators/check-ownership.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/cloudinary/multer.config';
import { FormDataRequest } from 'nestjs-form-data';
import { ParseFormDataJsonPipe } from 'src/common/pipes/parse-form-data.pipe';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { GetAllProductsDto } from './dto/get-all-products.dto';

@ApiTags('Product')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(UserRoles.ADMIN, UserRoles.SELLER)   
  @UseGuards(RolesGuard)
  @UseGuards(AccessTokenGuard)
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: UserPayload) {
    return this.productService.create(createProductDto, user.userId);
  }

  @Get()
  findAll(@Query() getProductsDto: GetAllProductsDto) {
    return this.productService.findAll(getProductsDto)
  }

  @Patch(':id/upload-cover')
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    required: true,
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        }
      }
    }
  })
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadCover(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.productService.uploadCover(+id, file)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRoles.ADMIN, UserRoles.SELLER)   
  @UseGuards(RolesGuard)
  @CheckOwnership('product', 'sellerId')
  @UseGuards(OwnershipGuard)
  @UseGuards(AccessTokenGuard)
  update(@Param('id') id: string, @Body(new ParseFormDataJsonPipe({except: ['file']})) updateProductDto: UpdateProductDto) { 
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN, UserRoles.SELLER)   
  @UseGuards(RolesGuard)
  @CheckOwnership('product', 'sellerId')
  @UseGuards(OwnershipGuard)
  @UseGuards(AccessTokenGuard)
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
