import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDTO {
  @ApiProperty({ example: 'tomasm.leguizamon@solvd.com' })
  email: string;

  @ApiProperty({ example: 'password' })
  password: string;

  @ApiProperty({ example: 'Tomas' })
  firstName: string;

  @ApiProperty({ example: 'Leguizamon' })
  lastName: string;

  @ApiProperty({ example: ['admin'] })
  roles?: string[];
}

export class UserData {
  @ApiProperty({ example: 'someId' })
  id: string;

  @ApiProperty({ example: 'Tomas' })
  firstName?: string;

  @ApiProperty({ example: 'Leguizamon' })
  lastName?: string;

  @ApiProperty({ example: 'tomasm.leguizamon@solvd.com' })
  email: string;

  @ApiProperty({ example: ['admin'] })
  roles?: string[];
}

export class CreateUserDTO {
  @ApiProperty({ example: 'success', description: 'Success message' })
  status: string | undefined;

  @ApiProperty({ type: UserData, description: 'User data' })
  data: UserData | undefined;
}
