import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserPayload } from 'src/auth/auth.types';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { Roles } from 'src/common/decorators/check-role.decorator';
import { Roles as UserRoles} from 'src/common/enums';
import { RolesGuard } from 'src/common/guards/check-role.guard';
import { UpdateReviewDto } from 'src/review/dto/update-review.dto';
import { TypeService } from './type.service';
import { UpdateTypeDto } from './dto/update-type.dto';
import { CreateTypeDto } from './dto/create-type.dto';

@ApiTags('Type')
@Controller('types')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  @Post()
  @Roles(UserRoles.ADMIN)   
  @UseGuards(RolesGuard)
  @UseGuards(AccessTokenGuard)
  create(@Body() createTypeDto: CreateTypeDto) {
    return this.typeService.create(createTypeDto);
  }

  @Get()
  findAll() {
    return this.typeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRoles.ADMIN)   
  @UseGuards(RolesGuard)
  @UseGuards(AccessTokenGuard)
  update(@Param('id') id: string, @Body() updateTypeDto: UpdateTypeDto) {
    return this.typeService.update(+id, updateTypeDto);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN)   
  @UseGuards(RolesGuard)
  @UseGuards(AccessTokenGuard)
  remove(@Param('id') id: string) {
    return this.typeService.remove(+id);
  }
}
