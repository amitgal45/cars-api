import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserDto } from './dto/user.dto';
import { BaseController } from '@common/base.controller';

@Controller('auth')
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return this.transformToObject(user, UserDto, 'User registered successfully');
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return this.transformToObject(result, UserDto, 'Login successful');
  }

  @Get('users')
  async findAll() {
    const users = await this.authService.findAll();
    return this.transformToArray(users, UserDto, 'Users retrieved successfully');
  }
} 