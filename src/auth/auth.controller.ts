import { Controller, Post, Body } from '@nestjs/common';

import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authSrv: AuthService) {}

  @ApiOperation({
    summary: 'User login',
  })
  @Post('login')
  @Public()
  async login(@Body() credentials: LoginInput) {
    return this.authSrv.login(credentials.email, credentials.password);
  }

  @ApiOperation({
    summary: 'User register',
  })
  @Post('register')
  @Public()
  async register(@Body() userDto: RegisterInput) {
    return this.authSrv.register(
      userDto.username,
      userDto.password,
      userDto.email
    );
  }
}
