import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, Unique } from "typeorm";
import { Expose, Exclude, plainToClass } from "class-transformer";
import { hash } from 'bcrypt';
import { AddUserDTO } from "~dtos/user/add_user.dto";

@Entity()
export class User {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Expose()
  @Column({ length: 64, unique: true })
  username: string;

  @Expose()
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    const saltRounds = 10;
    this.password = await hash(this.password, saltRounds);
  }

  static deserialize(dto: AddUserDTO): User {
    return plainToClass(User, dto);
  }

  constructor(init: Partial<User>) {
    Object.assign(this, init);
  }
}