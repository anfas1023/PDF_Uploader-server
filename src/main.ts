import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { join } from 'path';
import * as fs from 'fs';
import * as cookieParser from 'cookie-parser';

import * as serveStatic from 'serve-static';
async function bootstrap() {
  
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:5173', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };



  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOptions);
  app.use(cookieParser());
  const uploadsPath = join(__dirname, '..', 'uploads');
  // console.log('Uploads path:', uploadsPath);

  if (fs.existsSync(uploadsPath)) {
    console.log('Uploads directory exists.');
  } else {
    console.error('Uploads directory does not exist.');
  }

  app.use('/uploads', serveStatic(uploadsPath));


  await app.listen(3000);
}
bootstrap();

