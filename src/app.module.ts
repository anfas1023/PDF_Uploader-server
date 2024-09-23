import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User';
import { UserModule } from './user/user.module';
import { Pdf } from './entities/Pdf';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'newuser',
      password: 'root',
      database: 'pdfuser',
      entities: [Pdf,User],
      synchronize: true,   
    }),

    UserModule
  ],
  controllers: [],  
  providers: [],
})
export class AppModule {}
