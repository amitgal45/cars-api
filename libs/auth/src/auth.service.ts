import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ITokens } from './interfaces/token.interface';
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from './constants/auth.constant';
import { RegisterDto } from './dtos/register.dto';
import { RegisterSubject } from './subject/register.subject';
import { Role } from './enums/roles.enum';
import { ILoginRequest } from './interfaces/auth.interface';
import { DatabaseService, User } from '@gearspace/database';
import { UsersService } from '@gearspace/users';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly databaseService: DatabaseService,
  ) {}

  private async hashData(data: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
  }

  private async getTokens(userId: string, email: string, role: string = Role.USER): Promise<ITokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: ACCESS_TOKEN_TTL,
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, role },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: REFRESH_TOKEN_TTL,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(payload: ILoginRequest): Promise<User> {
    try {
      const user = await this.userService.findByEmail(payload.email);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('Account is deactivated');
      }

      const passwordMatches = await bcrypt.compare(payload.password, user.passwordHash);
      if (!passwordMatches) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Error validating user');
    }
  }

  async login(loginDto: ILoginRequest): Promise<ITokens> {
    try {
      const user = await this.validateUser(loginDto);

      const tokens = await this.getTokens(user.id, user.email);

      // Update last login and refresh token hash
      await this.userService.updateLastLogin(user.id);
      await this.userService.updateRefreshToken(user.id, await this.hashData(tokens.refreshToken));

      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Login failed');
    }
  }

  async logout(userId: string): Promise<boolean> {
    try {
      await this.userService.updateRefreshToken(userId, null);
      return true;
    } catch (error) {
      throw new InternalServerErrorException('Logout failed');
    }
  }

  async refreshTokens(refreshToken: string): Promise<ITokens> {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.userService.findById(decoded.sub);
      if (!user || !user.refreshTokenHash) {
        throw new UnauthorizedException('Access Denied');
      }

      const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshTokenHash);

      if (!refreshTokenMatches) {
        throw new UnauthorizedException('Access Denied');
      }

      const tokens = await this.getTokens(user.id, user.email);
      await this.userService.updateRefreshToken(user.id, await this.hashData(tokens.refreshToken));

      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Token refresh failed');
    }
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
    try {
      const user = await this.userService.findById(userId);
      const passwordMatches = await bcrypt.compare(oldPassword, user.passwordHash);

      if (!passwordMatches) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      const newPasswordHash = await this.hashData(newPassword);
      await this.userService.changePassword(userId, newPasswordHash);

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Password change failed');
    }
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async register(registerDto: RegisterDto): Promise<RegisterSubject> {
    return this.databaseService.runTransaction(async (manager) => {
      try {
        // Check if email exists
        const existingUser = await this.userService.findByEmail(registerDto.email);

        if (existingUser) {
          throw new ConflictException('Email already registered');
        }

        // Validate password match
        if (registerDto.password !== registerDto.passwordConfirm) {
          throw new BadRequestException('Passwords do not match');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(registerDto.password, salt);

        // Create user
        const user = await this.userService.create({
          email: registerDto.email,
          passwordHash: hashedPassword,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          isActive: true,
        });

        // Generate tokens
        const tokens = await this.getTokens(user.id, user.email);
        const expiresAt = this.getTokenExpiration();

        // Update refresh token in database
        const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
        await this.userService.updateRefreshToken(user.id, refreshTokenHash);

        // Return response
        return {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        };
      } catch (error) {
        if (error instanceof ConflictException || error instanceof BadRequestException) {
          console.log(error);
          throw error;
        }
        console.log(error);

        throw new InternalServerErrorException('Registration failed');
      }
    });
  }

  private getTokenExpiration(): Date {
    const expirationTime = this.configService.get<string>('JWT_ACCESS_EXPIRATION', '15m');
    const duration = parseInt(expirationTime) || 15;
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + duration);
    return expiresAt;
  }
}
