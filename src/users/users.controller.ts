import { Controller, UseGuards, Get, Request } from '@nestjs/common';
import { JwtAuthGuard } from '~auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfile(@Request() req) {
    return req.user;
  }
}
