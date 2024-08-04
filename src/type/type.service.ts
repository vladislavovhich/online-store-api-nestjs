import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';

@Injectable()
export class TypeService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async create(createTypeDto: CreateTypeDto) {
    await this.prisma.type.create({data: createTypeDto})
  }

  async findAll() {
    return await this.prisma.type.findMany()
  }

  async findOne(id: number) {
    return await this.prisma.type.findFirstOrThrow({
      where: {id}
    })
  }

  async update(id: number, updateTypeDto: UpdateTypeDto) {
    return await this.prisma.type.update({
      where: {id},
      data: updateTypeDto
    })
  }

  async remove(id: number) {
    return await this.prisma.type.delete({where: {id}})
  }
}
