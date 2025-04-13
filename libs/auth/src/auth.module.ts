import { Module, DynamicModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModuleOptions, PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersModule } from '@gearspace/users';

export interface IAuthModuleOptions extends AuthModuleOptions {
  isAdmin?: boolean;
  global?: boolean;
}

@Module({})
export class AuthModule {
  static register(options: IAuthModuleOptions = {}): DynamicModule {
    const guards = options.global
      ? [
          {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
          },
        ]
      : [];

    return {
      module: AuthModule,
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: options.isAdmin
              ? configService.get('JWT_ADMIN_ACCESS_SECRET')
              : configService.get('JWT_ACCESS_SECRET'),
            signOptions: {
              expiresIn: options.isAdmin
                ? configService.get('JWT_ADMIN_ACCESS_EXPIRATION', '15m')
                : configService.get('JWT_ACCESS_EXPIRATION', '15m'),
            },
          }),
        }),
        UsersModule,
      ],
      providers: [
        {
          provide: 'AUTH_OPTIONS',
          useValue: options,
        },
        AuthService,
        JwtStrategy,
        ...guards,
      ],
      exports: [AuthService, JwtModule, UsersModule],
      global: options.global,
    };
  }
}
