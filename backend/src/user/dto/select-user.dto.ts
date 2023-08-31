import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { User } from '../entity/user.entity';

export class SelectUserInput extends PickType(User, ['id']) {}

export class SelectUserOutput extends CoreOutput {
  @ApiProperty({ description: '유저 정보' })
  result?: User;
}
