import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDTO {
  @ApiProperty({ example: 'admin2@gmail.com' })
  email: string;

  @ApiProperty({ example: 'password1234' })
  password: string;
}

export class LoginUserResponse {
  @ApiProperty({ example: 'login state' })
  message: string;
}
