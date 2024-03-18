import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { AuthService } from '../auth/auth.service';
import { Response } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() registerDto: RegisterUserDto): Promise<any> {
    return this.authService.registerUser(registerDto);
  }
  @Post('/login')
  async logIn(@Body() body: {email: string, password: string}, @Res() res: Response){
    try{
      const  customToken  = await this.authService.loginUser(body.email, body.password);

      const cookieOptions = {
        httpOnly: true,

      }
    
      res.cookie('token', customToken, cookieOptions)
      res.status(HttpStatus.OK).send({message: 'Login successful'})
    }catch(error){
      res.status(HttpStatus.UNAUTHORIZED).send({message: 'invalid credentials'})
    }
  }
}
