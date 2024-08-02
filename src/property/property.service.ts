import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PropertyService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async create(createPropertyDto: CreatePropertyDto) { 
    const types = await this.prisma.type.findMany({
      select: {id: true}
    })
    const typesId = types.map(type => type.id)

    if (!typesId.includes(createPropertyDto.typeId)) {
      throw new BadRequestException("Unknown type ID")
    }

    return await this.prisma.property.create({
      data: {name: createPropertyDto.name, type: {connect: {id: createPropertyDto.typeId}}}
    })
  }

  async findAll() {
    return await this.prisma.property.findMany()
  }

  async findOne(id: number) {
    return await this.prisma.property.findFirstOrThrow({where: {id}})
  }

  async update(id: number, updatePropertyDto: UpdatePropertyDto) {
    return await this.prisma.property.update({
      where: {id},
      data: {name: updatePropertyDto.name}
    })
  }

  async remove(id: number) {
    return await this.prisma.property.delete({where: {id}})
  }
}
