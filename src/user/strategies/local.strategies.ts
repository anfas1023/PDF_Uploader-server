import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { userservice } from '../service/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: userservice) {
    super({ usernameField: 'email' }); 
  }

  async validate(email: string, password: string) {
    console.log("here");
    
    const user = await this.userService.validateUser(email, password);
    console.log("user",user);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user; 
  }
}