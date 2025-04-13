import { ApiProperty } from '@nestjs/swagger';
import { ITokens } from '../interfaces/token.interface';

export class RegisterSubject implements ITokens {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT refresh token',
  })
  refreshToken: string;

  @ApiProperty({
    example: '2024-01-21T15:30:00.000Z',
    description: 'Token expiration timestamp',
  })
  expiresAt: Date;

  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
    },
    description: 'Basic user information',
  })
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}
