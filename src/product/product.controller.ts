import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/extract-user.decorator';
import { UserPayload } from 'src/auth/auth.types';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { Roles as UserRoles } from 'src/common/enums';
import { RolesGuard } from 'src/common/guards/check-role.guard';
import { Roles } from 'src/common/decorators/check-role.decorator';
import { OwnershipGuard } from 'src/common/guards/check-ownership.guard';
import { CheckOwnership } from 'src/common/decorators/check-ownership.decorator';

@ApiTags('Product')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(UserRoles.ADMIN, UserRoles.SELLER)   
  @UseGuards(RolesGuard)
  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: UserPayload) {
    return this.productService.create(createProductDto, user.userId);
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
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
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
