import { RegisterUserDTO } from '../dtos/register-user-dto';

export interface IAuthService {
  validateUser(token: string): Promise<any>;
  registerUser(registerDto: RegisterUserDTO): Promise<any>;
}
