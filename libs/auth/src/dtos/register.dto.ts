import { IsEmail, IsString, IsOptional, MinLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Match } from '@gearspace/common';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Password (min 8 chars, 1 uppercase, 1 lowercase, 1 number)',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/, {
    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number',
  })
  password: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Confirm password',
  })
  @Match('password', { message: 'Passwords do not match' })
  passwordConfirm: string;

  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;
}
