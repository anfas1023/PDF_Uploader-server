import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/User";
import { UserController } from "./controller/users.controller";
import { userservice } from "./service/users.service";
import { Pdf } from "src/entities/Pdf";
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from "./strategies/local.strategies";
import { JwtStrategy } from "./strategies/jwt.strategies";

@Module({
  imports: [
    TypeOrmModule.forFeature([Pdf, User]),
    JwtModule.register({
      secret: 'abc123',
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule
  ],
  controllers: [UserController],
  providers: [userservice,LocalStrategy,JwtStrategy]
})

export class UserModule {}
