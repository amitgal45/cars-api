import { CurrentUser, JwtAuthGuard, Public, RegisterDto } from '@gearspace/auth';
import { LoginDto } from '@gearspace/auth';
import { AuthService, RegisterSubject } from '@gearspace/auth';
import { LoginSubject } from '@gearspace/auth/subject/login.subject';
import { BaseController } from '@gearspace/common/controllers/base.controller';
import { TransformInterceptor } from '@gearspace/common/interceptors/transform.interceptor';
import { ValidationWithContextPipe } from '@gearspace/common/pipes/validation-with-context.pipe';
import { User } from '@gearspace/database';
import { Controller, Post, Body, UseGuards, Get, UsePipes, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiExtraModels } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
@ApiExtraModels(RegisterSubject, LoginSubject)
export class ClientAuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, type: LoginSubject })
  async login(@Body() loginDto: LoginDto) {
    const res = await this.authService.login({ ...loginDto, loginType: 'USER' });
    return this.objectResponse(res, LoginSubject, 'Login successful', 200);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, type: RegisterSubject })
  @UsePipes(ValidationWithContextPipe)
  @UseInterceptors(TransformInterceptor)
  async register(@Body() registerDto: RegisterDto) {
    const res = await this.authService.register(registerDto);
    return this.objectResponse(res, RegisterSubject, 'Registration successful', 201);
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
