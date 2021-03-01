import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  
  async create(createUserDto: CreateUserDto) {
    try {
      const user = new User();
      user.email = createUserDto.email;
      user.name = createUserDto.name;
      user.password = createUserDto.password;
      await this.usersRepository.save(user);
    } catch (e) {
      console.error(e);
    }
  }
  
  async findAll(): Promise<User[]> {
    try {
      return this.usersRepository.find();
    } catch (e) {
      console.error(e);
    }
  }
}
