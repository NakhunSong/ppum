import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return { result };
    }
    return null;
  }

  async login(user: any) {
    const { result } = user;
    const payload = {
      userId: result.id,
      username: result.username,
      displayname: result.displayname,
      // iat: +new Date(),
      // exp: +new Date(),
    };
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
