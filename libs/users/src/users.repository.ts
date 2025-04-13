import { BaseRepository } from '@gearspace/common/base/base.repository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '@gearspace/database';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectDataSource()
    protected readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository, dataSource);
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({
        where: { email },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error finding user by email');
    }
  }

  async longProcess() {
    await this.withTransaction(async (manager) => {
      const user = manager.create(User, {
        email: 'test@test.com',
        passwordHash: 'test',
      });
      await manager.save(user);

      const user2 = manager.create(User, {
        email: 'test2@test.com',
        passwordHash: 'test',
      });
      await manager.save(user2);
    });
  }
}
