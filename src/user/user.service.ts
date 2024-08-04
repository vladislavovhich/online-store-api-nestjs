import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService
  ) {}

  async create(createUserDto: CreateUserDto) {
    console.log(createUserDto)
    const imageUploaded = await this.cloudinary.uploadImage(createUserDto.file)

    return await this.prisma.user.create({
      data: {
        email: createUserDto.email, 
        password: createUserDto.password,
        role: createUserDto.role,
        name: createUserDto.name,
        birthDate: createUserDto.birthDate,
        images: {
          create: {
            url: imageUploaded.url
          }
        },
      },
      include: {
        images: true
      }
    })
  }

  async findAll() {
    return await this.prisma.user.findMany()
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findFirst({where: {email}})
  }

  async findOne(id: number) {
    return await this.prisma.user.findFirstOrThrow({
      where: {id}
    })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: {id},
      data: updateUserDto
    })
  }

  async remove(id: number) {
    return await this.prisma.user.delete({where: {id}})
  }
}
