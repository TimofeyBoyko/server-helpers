import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, Repository } from 'typeorm';
import { User } from './user.entity';

export type TGetAllUsersSearchParams = {
  page?: number;
  count?: number;

  sortBy?: 'age' | 'name';
  sortOrder?: 'asc' | 'desc';

  age?: number;
  name?: string;
};

export type TGetAllUsersDTO = {
  total: number;
  page: number;
  count: number;
  data: User[];
};

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(name: string, age: number): Promise<User> {
    const user = this.userRepository.create({ name, age });
    return this.userRepository.save(user);
  }

  async getUser(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async getAllUsers(
    searchParams: TGetAllUsersSearchParams,
  ): Promise<TGetAllUsersDTO> {
    const {
      page = 1,
      count = 100,
      sortBy = 'age',
      sortOrder = 'asc',
      age,
      name,
    } = searchParams;
    const skip = page * count - count;

    const ageOrder: FindOptionsOrder<User> = {
      age: sortOrder === 'asc' ? 'ASC' : 'DESC',
    };
    const nameOrder: FindOptionsOrder<User> = {
      name: sortOrder === 'asc' ? 'ASC' : 'DESC',
    };

    const [users, total] = await this.userRepository.findAndCount({
      take: count,
      skip,
      order: sortBy === 'age' ? { ...ageOrder } : { ...nameOrder },
      where: { age, name },
    });

    return { page, count, total, data: users } as TGetAllUsersDTO;
  }

  async updateUser(id: string, name: string, age: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    user.name = name;
    user.age = age;

    return this.userRepository.save(user);
  }

  async deleteUser(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    return this.userRepository.remove(user);
  }
}
