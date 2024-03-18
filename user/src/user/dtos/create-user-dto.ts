import { IsArray, IsEmail, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  user_id: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsArray()
  roles: string[];
}
