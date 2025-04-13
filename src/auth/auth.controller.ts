import { CurrentUser, ITokens, JwtAuthGuard, Public, RegisterDto } from '@gearspace/auth';
import { LoginDto } from '@gearspace/auth';
import { AuthService, RegisterSubject } from '@gearspace/auth';
import { LoginSubject } from '@gearspace/auth/subject/login.subject';
import { User } from '@gearspace/database';
import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiExtraModels } from '@nestjs/swagger';


@ApiTags('Authentication')
@Controller('auth')
@ApiExtraModels(RegisterSubject,LoginSubject)
export class ClientAuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, type: LoginSubject })
  login(@Body() loginDto: LoginDto): Promise<ITokens> {
    return this.authService.login({ ...loginDto, loginType: 'USER' });
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, type: RegisterSubject })
  register(@Body() registerDto: RegisterDto): Promise<RegisterSubject> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ schema: { type: 'object', properties: { refreshToken: { type: 'string' } } } })
  @ApiResponse({ status: 200, type: LoginSubject })
  refreshToken(@Body('refreshToken') refreshToken: string): Promise<LoginSubject> {
    return this.authService.refreshTokens(refreshToken);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, type: User })
  getCurrentUser(@CurrentUser() user: User): User {
    return user;
  }
}
