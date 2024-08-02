import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { Roles as UserRoles} from 'src/common/enums';
import { RolesGuard } from 'src/common/guards/check-role.guard';
import { Roles } from 'src/common/decorators/check-role.decorator';

@ApiTags('Property')
@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @Roles(UserRoles.ADMIN)   
  @UseGuards(RolesGuard)
  @UseGuards(AccessTokenGuard)
  create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertyService.create(createPropertyDto);
  }

  @Get()
  findAll() {
    return this.propertyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRoles.ADMIN)   
  @UseGuards(RolesGuard)
  @UseGuards(AccessTokenGuard)
  update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto) {
    return this.propertyService.update(+id, updatePropertyDto);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN)   
  @UseGuards(RolesGuard)
  @UseGuards(AccessTokenGuard)
  remove(@Param('id') id: string) {
    return this.propertyService.remove(+id);
  }
}
