import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TypeService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async create(name: string) {
    await this.prisma.type.create({data: {name}})
  }

  async findAll() {
    return await this.prisma.type.findMany()
  }

  async findOne(id: number) {
    return await this.prisma.type.findFirstOrThrow({
      where: {id}
    })
  }

  async update(id: number, name: string) {
    return await this.prisma.type.update({
      where: {id},
      data: {name}
    })
  }

  async remove(id: number) {
    return await this.prisma.type.delete({where: {id}})
  }
}
