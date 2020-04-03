import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '~entities/user.entity';
import { AddUserDTO } from '~dtos/user/add_user.dto';
import { UserDTO } from '~dtos/user/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepo.findOne({ username });
  }

  async save(addUserDTO: AddUserDTO): Promise<UserDTO> {
    const user = User.deserialize(addUserDTO);
    const savedUser = await this.userRepo.save(user);
    const { password, id, ...rest } = savedUser;

    return rest as UserDTO;
  }
}
