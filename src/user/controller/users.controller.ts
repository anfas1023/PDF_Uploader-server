import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { userservice } from '../service/users.service';
import { createUserDto } from '../dto/createUserDTo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { loginUserDto } from '../dto/loginUserDto.dto';
import { LocalGuard } from '../guards/local.guard';
import { Request, Response } from 'express';
import { JwtGuard } from '../guards/jwt.guard';
@Controller('user')
export class UserController {
  constructor(private userservice: userservice) {}

  @Post('signup')
  @UsePipes(new ValidationPipe())
  createUser(@Body() createUserDto: createUserDto) {
    console.log(createUserDto);
    return this.userservice.createUser(createUserDto);
  }

  @Post('upload/:userId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Directory to save files
        filename: (req, file, callback) => {
          const filename = `${Date.now()}${extname(file.originalname)}`;
          callback(null, filename);
        },
      }),
      limits: { fileSize: 1000000 },
    }),
  )
  async uploadFile(@UploadedFile() file: any, @Param('userId') userId: number) {
    console.log('file', file);
    return await this.userservice.handleFile(file, userId);
  }

  @Get('pdfs/:id')
  async getUserPdfs(@Param('id') userId: number) {
    try {
      // console.log(userId);

      const pdfs = await this.userservice.getPdf(userId);
      // console.log(pdfs);

      return { pdfs };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  @UseGuards(LocalGuard)
  async loginuser(
    @Body() loginUserDTo: loginUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.user;
    console.log('userId', userId);
    const { token, message } = await this.userservice.loginUser(userId);

    res.cookie('auth_token', token, {
      httpOnly: true,
      maxAge: 3600000,
    });

    return res.status(200).json({ token, message, userId });
  }

  @Get('status')
  @UseGuards(JwtGuard)
  async checkStatus(@Req() req: Request) {
    console.log('Inside AuthController status method');
    console.log(req.user);
    return req.user;
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    // Invalidate session or JWT on the server side
    console.log('sucess');

    res.clearCookie('auth_token'); // If you're using cookies
    res.status(200).send({ message: 'Logged out successfully' });
  }
}
