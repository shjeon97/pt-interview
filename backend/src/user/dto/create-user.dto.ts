import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { User } from 'src/user/entity/user.entity';

export class CreateUserInput extends PickType(User, [
  'name',
  'password',
  'role',
  'testState',
  'ptTime',
] as const) {
  @ApiProperty({ description: '공고 리스트', nullable: true })
  groupIdList?: number[];
}

export class CreateUserOutput extends CoreOutput {}
