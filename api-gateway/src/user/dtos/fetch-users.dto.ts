import { ApiProperty } from '@nestjs/swagger';
import { UserData } from '../../auth/dtos/register-user-dto';
import { UserPayload } from './user-payload.dto';

export class UserResponseDTO {
  @ApiProperty({ example: 'success', description: 'Success message' })
  status: string | undefined;

  @ApiProperty({ type: UserData, description: 'User data' })
  data: UserPayload | undefined;
}

export class UsersResponseDTO {
  @ApiProperty({ example: 'success', description: 'Success message' })
  status: string | undefined;

  @ApiProperty({ type: UserData, description: 'User data' })
  data: UserPayload[] | undefined;
}
