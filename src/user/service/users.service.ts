import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/User";
import { Repository } from "typeorm";
import { createUserDto } from "../dto/createUserDTo.dto";
import * as bcrypt from 'bcrypt';
import { Pdf } from "src/entities/Pdf";
import { Express } from "express";
import { loginUserDto } from "../dto/loginUserDto.dto";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class userservice {
    constructor(@InjectRepository(User) private userRepository : Repository<User>,
    private jwtService: JwtService,
    @InjectRepository(Pdf) private pdfRepository : Repository<Pdf>){}


    async createUser(createUser:createUserDto){
        const {email,password,username}= createUser
        const hashedPassword = await bcrypt.hash(password, 10);

        await this.userRepository.query(
            `INSERT INTO user (username, email, password, createdAt) VALUES (?, ?, ?, ?)`,
            [username, email, hashedPassword,new Date()]
        );

        return { message: 'User and profile created successfully' };
          
    }

    async handleFile(file:any,userId:number) {
        // console.log('File received:', file);

        const user = await this.userRepository.findOneBy({ id: userId });

        if (!user) {
            throw new Error('User not found');
        }
        const normalizedPath = file.path.replace(/\\/g, '/');
        const newPdf = this.pdfRepository.create({
            path:normalizedPath,  // Path where the file is stored
            name: file.originalname,  // Original name of the file
            user,  // Reference to the user entity
        });

        // Save the PDF in the database
        await this.pdfRepository.save(newPdf);

        return  newPdf;
 
      }

      async getPdf(userId:number){
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['pdfs']  
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user.pdfs;
      }


      async loginUser(userId:any) {
        // const { email, password } = loginUserDto;

        // Find the user by email
        // const user = await this.userRepository.findOne({ where: { email } });

        // // If user doesn't exist, throw an unauthorized exception
        // if (!user) {
        //     throw new UnauthorizedException('Invalid credentials');
        // }

        // // Compare passwords
        // const isPasswordValid = await bcrypt.compare(password, user.password);

        // // If password doesn't match, throw an unauthorized exception
        // if (!isPasswordValid) {
        //     throw new UnauthorizedException('Invalid credentials');
        // }

        // // If login is successful, generate JWT token
        // // const payload = { username: user.username, sub: user.id };
        // // const token = this.jwtService.sign(payload);

        // // Return the JWT token and user information
        // return {
        //     message: 'Login successful',
        //     // token,
        //     user: {
        //         id: user.id,
        //         username: user.username,
        //         email: user.email,
        //     },
        // };

        const payload = { userId };

        const token = this.jwtService.sign(payload);
        console.log(token);
    
        return {
          message: 'Login successful',
          token,
        };
    }


    async validateUser(email: string, password: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
          throw new UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid credentials');
        }
    
        return { id: user.id };
      }
}