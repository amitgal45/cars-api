import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { User } from '@gearspace/database';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(userData: Partial<User>): Promise<User> {
    return this.userRepository.withTransaction(async (manager) => {
      const user = await this.userRepository.create(userData);

      return this.findByIdWithFullProfile(user.id);
    });
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }

  async findByIdWithFullProfile(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.userRepository.findByPhoneNumber(phoneNumber);
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userRepository.update(userId, { lastLogin: new Date() });
  }

  async updateRefreshToken(userId: string, refreshTokenHash: string | null): Promise<void> {
    await this.userRepository.update(userId, { refreshTokenHash });
  }

  async changePassword(userId: string, newPasswordHash: string): Promise<void> {
    await this.userRepository.update(userId, { passwordHash: newPasswordHash });
  }

  async deactivateAccount(userId: string): Promise<void> {
    await this.userRepository.update(userId, { isActive: false });
  }
}
