import { IsString, IsEmail, MinLength } from 'class-validator';

export class loginUserDto {

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}