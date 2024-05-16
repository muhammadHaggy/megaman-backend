import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/interfaces/jwt.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService
  ) {}
  async validateJwt(payload: JwtPayload) {
    return await this.usersService.findById(Number(payload.id));
  }

  async login(email: string, password: string) {
    const user = await this.usersService.verifyCredentials(email, password);
    if (!user) {
      throw new NotFoundException('Email atau password salah!');
    }
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(username: string, password: string, email: string) {
    return this.usersService.addUser({ username, password, email });
  }
}
