import {CanActivate, ExecutionContext, ForbiddenException, Injectable,  UnauthorizedException, } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserPayload } from 'src/auth/auth.types';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { Roles } from '../enums';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
        private readonly reflector: Reflector,
        private readonly prisma: PrismaService,
        private readonly userService: UserService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const usr: UserPayload = request.user;
        const resourceId = request.params.id;
        const resourceType = this.reflector.get<string>('resourceType', context.getHandler());
        const ownerKey = this.reflector.get<string>('ownerKey', context.getHandler());

        if (!resourceType) {
            throw new UnauthorizedException('Resource type is not specified');
        }

        if (!ownerKey) {
            throw new UnauthorizedException('Owner key is not specified');
        }

        const resource = await this.prisma[resourceType].findUnique({
            where: { id: Number(resourceId) },
        });

        const user = await this.userService.findOne(usr.userId)

        if (user.role == Roles.ADMIN) {
            return true
        } else if (!resource || resource[ownerKey] !== usr.userId) {
            throw new ForbiddenException('Access denied');
        }

        return true;
    }
}