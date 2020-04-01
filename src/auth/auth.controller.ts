import { Controller, Request, Post, UseGuards, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { AddUserDTO } from '~dtos/user/add_user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: AddUserDTO) {
    return this.authService.register(dto);
  }
}