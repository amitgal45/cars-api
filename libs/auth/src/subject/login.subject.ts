import { ApiProperty } from '@nestjs/swagger';
import { ITokens } from '../interfaces/token.interface';

export class LoginSubject implements ITokens {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
