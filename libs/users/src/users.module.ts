import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule, User } from '@gearspace/database';
import { UserRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [DatabaseModule.forFeature([User])],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository, TypeOrmModule],
})
export class UsersModule {}
