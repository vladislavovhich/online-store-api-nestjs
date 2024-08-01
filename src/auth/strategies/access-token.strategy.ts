import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { extractTokenFromCookies } from 'src/common/helpers/jwt-token.helper';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractTokenFromCookies("jwt")]),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  validate(payload) {
   return payload
  }
}