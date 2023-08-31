import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { User } from '../entity/user.entity';

export class EditTesterInput extends PickType(User, ['testState'] as const) {
  @ApiProperty({ description: '지원자 id' })
  userId: number;
  @ApiProperty({ description: '남은시간' })
  timeRemaining: number;
}

export class EditTesterOutput extends CoreOutput {}
