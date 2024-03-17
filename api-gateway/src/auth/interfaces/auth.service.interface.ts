import { RegisterUserDTO } from '../dtos/register-user-d-t.o';

export interface IAuthService {
  validateUser(token: string): Promise<any>;
  registerUser(registerDto: RegisterUserDTO): Promise<any>;
}
