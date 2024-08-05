import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
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
import { ParseFormDataJsonPipe } from 'src/common/parse-form-data.pipe';

@ApiTags('Product')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(UserRoles.ADMIN, UserRoles.SELLER)   
  @UseGuards(RolesGuard)
  @UseGuards(AccessTokenGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  create(@Body(
    new ParseFormDataJsonPipe({except: ['file']})) createProductDto: CreateProductDto, 
    @GetUser() user: UserPayload, 
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.productService.create(createProductDto, user.userId, file);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  update(
    @Param('id') id: string, 
    @Body(new ParseFormDataJsonPipe({except: ['file']})) updateProductDto: UpdateProductDto, 
    @UploadedFile() file: Express.Multer.File
  ) { 
    return this.productService.update(+id, updateProductDto, file);
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
