import { IsString, IsEmail, MinLength } from 'class-validator';

export class createUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}