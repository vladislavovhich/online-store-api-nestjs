import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from "bcrypt"
import { create } from 'domain';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor (
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) {}

    async signUp(createUserDto: CreateUserDto) {
       const isExist = await this.userService.findByEmail(createUserDto.email)

       if (isExist) {
        throw new BadRequestException("Email is already taken!")
       }

       const password = await bcrypt.hash(createUserDto.password, 10)
       const newUser = await this.userService.create({...createUserDto, password})
       const tokens = this.createTokens(newUser.id)

       await this.updateToken(newUser.id, tokens.refreshToken)
       
       return {user: newUser, tokens}
    }

    async signIn(loginUserDto: LoginDto) {
        const user = await this.userService.findByEmail(loginUserDto.email)

        if (!user) {
            throw new BadRequestException("Incorrect login or password.")
        }

        const passwordVerify = await bcrypt.compare(loginUserDto.password, user.password)

        if (!passwordVerify) {
            throw new BadRequestException("Incorrect login or password.")
        }

        const tokens = this.createTokens(user.id)

        await this.updateToken(user.id, tokens.refreshToken)

        return {user, tokens}
    }

    async refreshToken(userId: number, refreshToken: string) {
        try {
            this.jwtService.verify(refreshToken, {secret: process.env.JWT_REFRESH_SECRET})

            const tokens = this.createTokens(userId)

            await this.updateToken(userId, tokens.refreshToken)

            return tokens
        } catch (error) {
            throw new BadRequestException(error)
        }
    }

    async updateToken(userId: number, token: string) {
        await this.userService.update(userId, {token})
    }

    createTokens(userId: number) {
        return {
            accessToken: this.createAccessToken(userId),
            refreshToken: this.jwtService.sign({userId}, {secret: process.env.JWT_REFRESH_SECRET, expiresIn: "1d"})
        }
    }

    createAccessToken(userId: number) {
        return this.jwtService.sign({userId}, {secret: process.env.JWT_ACCESS_SECRET, expiresIn: "30d"})
    }
}