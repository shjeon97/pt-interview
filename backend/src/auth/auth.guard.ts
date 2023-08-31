import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { MarkRepository } from 'src/mark/repository/mark.repository';
import { UserRole } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { AllowedRole } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
    private readonly mark: MarkRepository,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const role = this.reflector.get<AllowedRole>('role', context.getHandler());
    if (!role) {
      return true;
    }
    const httpHeader = context.switchToHttp().getRequest()['headers'];

    const token = httpHeader['x-jwt'];

    if (token) {
      const decoded = this.jwtService.verify(token.toString(), {
        secret: process.env.PRIVATE_KEY,
      });
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const { user } = await this.userService.findById(decoded['id']);
        if (user) {
          const checkSession = await this.userService.checkSession(
            decoded['id'],
          );
          if (!checkSession) {
            return false;
          }
          httpHeader['user'] = user;

          if (role.includes('Any')) {
            return true;
          } else if (
            role.includes('SuperAdmin_Admin') &&
            user.role !== UserRole.Tester
          ) {
            return true;
          } else if (user.role === UserRole.Tester && user.isAttend) {
            const mark = await this.mark.findOne({ user });
            httpHeader['mark'] = mark;
          }

          return role.includes(user.role);
        }
      }
    }
    return false;
  }
}
