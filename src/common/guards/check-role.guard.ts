import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector, 
    private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler()).map(role => role.toUpperCase());
    
    if (!roles) {
        return true; 
    }

    const request = context.switchToHttp().getRequest();
    const user = await this.userService.findOne(request.user.userId);

    if (!user) {
        throw new ForbiddenException('User not found');
    }

    if (!roles.includes(user.role.toUpperCase())) {
        throw new ForbiddenException('Access denied');
    }

    return true;
  }
}