import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { GetUser } from 'src/common/decorators/extract-user.decorator';
import { Request, Response} from "express"
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { UserPayload } from './auth.types';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor (
      private readonly authService: AuthService,
      private readonly userService: UserService
  ) {}

  @Post('signin')
  async signIn(@Body() loginUserDto: LoginDto, @Res({ passthrough: true }) response: Response) { 
      const result = await this.authService.signIn(loginUserDto)

      response.cookie("jwt", result.tokens.accessToken, {httpOnly: true, secure: true})
      response.cookie("jwt-refresh", result.tokens.refreshToken, {httpOnly: true, secure: true})

      return result
  }

  @Post('signup') 
  async signUp(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) response: Response) {
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
