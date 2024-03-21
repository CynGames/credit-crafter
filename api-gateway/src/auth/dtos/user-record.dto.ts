import { ApiProperty } from '@nestjs/swagger';

export class UserRecord {
  @ApiProperty({ example: 'someUid12345' })
  readonly uid: string;

  @ApiProperty({ example: 'user@example.com', required: false })
  readonly email?: string;

  @ApiProperty({ example: true })
  readonly emailVerified: boolean;

  @ApiProperty({ example: 'Juan Pablo', required: false })
  readonly displayName?: string;

  @ApiProperty({ example: 'https://example.com/photo.jpg', required: false })
  readonly photoURL?: string;

  @ApiProperty({ example: '+11234567890', required: false })
  readonly phoneNumber?: string;

  @ApiProperty({ example: false })
  readonly disabled: boolean;

  @ApiProperty({ example: 'passwordHash', required: false })
  readonly passwordHash?: string;

  @ApiProperty({ example: 'passwordSalt', required: false })
  readonly passwordSalt?: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    example: { role: 'admin' },
    required: false,
  })
  readonly customClaims?: { [key: string]: any };

  @ApiProperty({ example: 'tenantId123', required: false })
  readonly tenantId?: string | null;

  @ApiProperty({ example: 'Mon, 20 Sep 2021 12:34:56 GMT', required: false })
  readonly tokensValidAfterTime?: string;
}
