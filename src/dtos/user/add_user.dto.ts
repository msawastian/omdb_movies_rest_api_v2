import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class AddUserDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  username: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  constructor(init?: Partial<AddUserDTO>) {
    Object.assign(this, init);
  }
}
