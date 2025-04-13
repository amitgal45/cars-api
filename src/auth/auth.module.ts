import { Module } from '@nestjs/common';
import { AuthModule, AuthService } from '@gearspace/auth';
import { ClientAuthController } from './auth.controller';

@Module({
  imports: [AuthModule.register()],
  controllers: [ClientAuthController],
  providers: [AuthService],
})
export class ClientAuthModule {}
