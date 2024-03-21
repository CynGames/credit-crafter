import { ApiProperty } from '@nestjs/swagger';
import { FinancialDataDTO } from './financial-data.dto';

export class UserPayload {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier of the user',
  })
  id: string;

  @ApiProperty({ example: 'John', description: 'First name of the user' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the user',
  })
  email: string;

  @ApiProperty({
    example: ['user', 'admin'],
    description: 'Roles assigned to the user',
  })
  roles: string[];

  @ApiProperty({
    example: '2020-01-01T00:00:00.000Z',
    description: 'Date when the user was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2020-01-01T00:00:00.000Z',
    description: 'Date when the user was last updated',
  })
  updatedAt: Date;

  @ApiProperty({
    type: FinancialDataDTO,
    description: 'Financial data associated with the user',
    required: false,
  })
  financialData?: FinancialDataDTO;
}
