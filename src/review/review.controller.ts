import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { GetUser } from 'src/common/decorators/extract-user.decorator';
import { UserPayload } from 'src/auth/auth.types';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { Roles as UserRoles} from 'src/common/enums';
import { RolesGuard } from 'src/common/guards/check-role.guard';
import { Roles } from 'src/common/decorators/check-role.decorator';
import { CheckOwnership } from 'src/common/decorators/check-ownership.decorator';
import { OwnershipGuard } from 'src/common/guards/check-ownership.guard';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/cloudinary/multer.config';

@ApiTags('Review')
@Controller('/')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('products/:productId/reviews')
  @Roles(UserRoles.ADMIN, UserRoles.SELLER)   
  @UseGuards(RolesGuard)
  @UseGuards(AccessTokenGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  create(
    @Body() createReviewDto: CreateReviewDto, 
    @GetUser() user: UserPayload, 
    @Param('productId') productId: string,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.reviewService.create(createReviewDto, user.userId, +productId, files);
  }

  @Get('products/:productId/reviews')
  findAll(@Param('productId') productId: string) {
    return this.reviewService.findAll(+productId);
  }

  @Get('reviews/:id')
  findOne(@Param('id') id: string, @Param('productId') productId: string) {
    return this.reviewService.findOne(+id, +productId);
  }

  @Patch('reviews/:id')
  @Roles(UserRoles.ADMIN, UserRoles.SELLER)   
  @UseGuards(RolesGuard)
  @CheckOwnership('review')
  @UseGuards(OwnershipGuard)
  @UseGuards(AccessTokenGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto, @UploadedFiles() files: Express.Multer.File[]) {
    return this.reviewService.update(+id, updateReviewDto, files);
  }

  @Delete('reviews/:id')
  @Roles(UserRoles.ADMIN, UserRoles.SELLER)   
  @UseGuards(RolesGuard)
  @CheckOwnership('review')
  @UseGuards(OwnershipGuard)
  @UseGuards(AccessTokenGuard)
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }
}
