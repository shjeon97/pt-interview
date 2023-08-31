import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async sign(id: number): Promise<string> {
    return this.jwtService.sign({ id });
  }
}
