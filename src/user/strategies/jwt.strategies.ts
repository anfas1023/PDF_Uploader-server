import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
// import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        let token = null;
        if (req && req.cookies) {
          token = req.cookies.auth_token;
        }
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: "abc123",
    });
  }

  async validate(payload: any) {
    console.log("jgj",payload.userId);
    return payload.userId
  }
}