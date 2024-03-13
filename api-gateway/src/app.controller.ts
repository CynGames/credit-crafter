import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ServerStatusPayload } from './dto/types-dto-constants';
import { RegisterUserDto } from './auth/dto/register-user.dto';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get('/health')
  async getHealthStatus(): Promise<ServerStatusPayload> {
    return await this.appService.createHealthRequestMessage();
  }

  @Post('/register')
  async register(@Body() registerDto: RegisterUserDto): Promise<any> {
    return this.authService.registerUser(registerDto);
  }

  // @Get('/secured')
  // @UseGuards(FirebaseAuthGuard)
  // getSecuredData(@Req() request: Request & { user: string }): string {
  //   // Access user info via request.user
  //   return request.user;
  // }

  // @Post('/login')
  // async login(@Body() loginDto: LoginDto): Promise<any> {
  //   return this.authService.validateUser(loginDto);
  // }

  // @Post('/login')
  // async loginUser(@Body() loginUserDto: LoginUserDto): Promise<any> {
  //   // try {
  //   //   const decodedToken = await admin.auth().verifyIdToken(loginUserDto.token);
  //   //   // Optionally, lookup or do something with the user's data
  //   //   // For example, check if the user exists in your database
  //   //   return { userId: decodedToken.uid, message: 'Login successful' };
  //   // } catch (error) {
  //   //   throw new Error('Token verification failed');
  //   // }
  //
  //   // Logic to validate user with Firebase
  //   const userRecord = await admin.auth().getUserByEmail('email3@example.com');
  //   const userData: UserRecord = await admin.auth().getUser(userRecord.uid);
  //   // Verify the password (usually done client-side with Firebase)
  //   // Return user details or validation result
  //   return { userId: userRecord.uid, userData };
  // }

  // @Post('/register')
  // async registerUser(@Body() registerUserDto: RegisterUserDto): Promise<any> {
  //   // Create a new user in Firebase Authentication
  //   const userRecord = await admin.auth().createUser({
  //     email: registerUserDto.email,
  //     password: registerUserDto.password,
  //   });
  //
  //   // Optionally, store additional user info in Firestore
  //   const db = admin.firestore();
  //   const userRef = db.collection('users-auth').doc(userRecord.uid);
  //   await userRef.set({
  //     firstName: registerUserDto.firstName,
  //     lastName: registerUserDto.lastName,
  //     email: registerUserDto.email,
  //   });
  //
  //   const token = await admin.auth().createCustomToken(userRecord.uid);
  //
  //   return {
  //     userId: userRecord.uid,
  //     token: token,
  //   };
  // }
}

/*
Step 1: Login con Firebase API
Step 2: Get Token
Step 3: Poner el token en el auth header

Sabemos que del token podemos sacar el userId, lo que valida que el usuario existe.
Del userId, podemos sacar el resto de la data del usuario.

Step 4: En los sendmessage protegidos, primero validar que el token esta bien, lo que garantiza que la cadena entera esta cubierta.
Step 5: En los sendmessages, shippear el userData en un campo del header. UserRecord
 */
