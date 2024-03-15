import { RegisterUserDto } from '../dtos/register-user.dto';

export interface IAuthService {
  validateUser(token: string): Promise<any>;
  registerUser(registerDto: RegisterUserDto): Promise<any>;
}
