import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateUserInput } from './create-user.dto';
import { CoreOutput } from 'src/common/dto/output.dto';
import { UserRole } from '../entity/user.entity';

export class UploadUser extends PickType(CreateUserInput, [
  'name',
  'password',
  'groupIdList',
  'ptTime',
] as const) {}

export class UploadUserListInput {
  userList: UploadUser[];

  @ApiProperty({ description: '유저 타입' })
  role: UserRole;
}

export class UploadUserListOutput extends CoreOutput {}
