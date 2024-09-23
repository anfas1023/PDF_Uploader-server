
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
// import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('inside guard');
    const request = context.switchToHttp().getRequest();
    // console.log(request);
    
    const cookies = request.cookies.auth_token;

    console.log('Cookies:', cookies);
    
    return super.canActivate(context);
  }
}