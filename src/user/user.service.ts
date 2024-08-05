import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ImageService } from 'src/image/image.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageService: ImageService
  ) {}

  async create(createUserDto: CreateUserDto, file?: Express.Multer.File) {
    const user = await this.prisma.user.create({
      data: createUserDto
    })

    if (file) {
      const image = await this.imageService.upload(user.id, 'User', file)

      return {...user, images: [image], pfp: image}
    }

    return user
  }

  async findAll() {
    return await this.prisma.user.findMany()
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findFirst({where: {email}})
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findFirstOrThrow({
      where: {id}
    })
    const images = await this.imageService.getImages(user.id, 'User')

    return {...user, images, pfp: images.at(-1)}
  }

  async update(id: number, updateUserDto: UpdateUserDto, file?: Express.Multer.File) {
    const user = await this.prisma.user.update({
      where: {id},
      data: updateUserDto
    })

    const images = await this.imageService.getImages(user.id, 'User')

    if (file) {
      const image = await this.imageService.upload(user.id, 'User', file)

      return {...user, images: [...images, image], pfp: image}
    }

    return {...user, images}
  }

  async remove(id: number) {
    return await this.prisma.user.delete({where: {id}})
  }
}
