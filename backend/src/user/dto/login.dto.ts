import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dto/output.dto';
import { User } from '../entity/user.entity';

export class LoginInput extends PickType(User, [
  'name',
  'password',
  'role',
] as const) {}

export class LoginOutput extends CoreOutput {
  @ApiProperty({ example: 'token', description: '로그인 성공 시 토큰 발행' })
  @IsString()
  token?: string;
}
