import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { Roles as UserRoles } from 'src/common/enums';
import { RolesGuard } from 'src/common/guards/check-role.guard';
import { Roles } from 'src/common/decorators/check-role.decorator';
import { ApiTags } from '@nestjs/swagger';
import { AddPropertyDto } from './dto/add-property.dto';

@ApiTags('Category')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get(':id/properties')
  getCategoryProperties(@Param('id') id: string) {
    return this.categoryService.getCategoryProperties(+id);
  } 

  @Put(':categoryId/add-property/:propertyId')
  @Roles(UserRoles.ADMIN)   
  @UseGuards(RolesGuard)
  @UseGuards(AccessTokenGuard)
  addProperty(@Param() addPropertyDto: AddPropertyDto) {
    return this.categoryService.addProperty(addPropertyDto);
  }

  @Delete(':categoryId/remove-property/:propertyId')
  @Roles(UserRoles.ADMIN)   
  @UseGuards(RolesGuard)
  @UseGuards(AccessTokenGuard)
  removeProperty(@Param() addPropertyDto: AddPropertyDto) {
    return this.categoryService.removeProperty(addPropertyDto);
  }

  @Post()
  @Roles(UserRoles.ADMIN)   
  @UseGuards(RolesGuard)
  @UseGuards(AccessTokenGuard)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRoles.ADMIN)   
  @UseGuards(RolesGuard)
  @UseGuards(AccessTokenGuard)
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN)   
  @UseGuards(RolesGuard)
  @UseGuards(AccessTokenGuard)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
