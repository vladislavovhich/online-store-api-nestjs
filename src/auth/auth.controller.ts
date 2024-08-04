import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { GetUser } from 'src/common/decorators/extract-user.decorator';
import { Request, Response} from "express"
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { UserPayload } from './auth.types';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/cloudinary/multer.config';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor (
      private readonly authService: AuthService,
      private readonly userService: UserService,
      private readonly cloudinary: CloudinaryService
  ) {}

  @Post('signin')
  async signIn(@Body() loginUserDto: LoginDto, @Res({ passthrough: true }) response: Response) { 
      const result = await this.authService.signIn(loginUserDto)

      response.cookie("jwt", result.tokens.accessToken, {httpOnly: true, secure: true})
      response.cookie("jwt-refresh", result.tokens.refreshToken, {httpOnly: true, secure: true})

      return result
  }

  @Post('signup') 
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @ApiConsumes('multipart/form-data')
  async signUp(@Body() createUserDto: CreateUserDto, @UploadedFile() file: Express.Multer.File, @Res({ passthrough: true }) response: Response) {
    createUserDto.file = file
    
    const result = await this.authService.signUp(createUserDto)

      response.cookie("jwt", result.tokens.accessToken, {httpOnly: true, secure: true})
      response.cookie("jwt-refresh", result.tokens.refreshToken, {httpOnly: true, secure: true})

      return result.user
  }

  @Get('logout') 
  @UseGuards(AccessTokenGuard)
  logout(@Res({ passthrough: true }) response: Response) {
      response.clearCookie('jwt')
      response.clearCookie('jwt-refresh')

      response.sendStatus(200)
  }

  @Get('refresh-token')
  @UseGuards(RefreshTokenGuard)
  async refreshToken(@Req() req: Request, @GetUser() u: UserPayload, @Res({ passthrough: true }) response: Response) {
      const tokens = await this.authService.refreshToken(u.userId, req.cookies['jwt-refresh'])

      response.cookie("jwt", tokens.accessToken, {httpOnly: true, secure: true})
      response.cookie("jwt-refresh", tokens.refreshToken, {httpOnly: true, secure: true})

      response.sendStatus(200)
  }
}
