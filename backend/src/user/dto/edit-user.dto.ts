import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { User } from '../entity/user.entity';

export class EditUserInput extends PartialType(
  PickType(User, ['name', 'password', 'ptTime'] as const),
) {
  @ApiProperty({ description: '수정할 유저 id' })
  userId: number;
  @ApiProperty({ description: '공고 리스트', nullable: true })
  groupIdList?: number[];
}

export class EditUserOutput extends CoreOutput {}
