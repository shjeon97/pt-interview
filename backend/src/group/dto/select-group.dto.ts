import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Group } from '../entity/group.entity';

export class SelectGroupInput extends PickType(Group, ['id']) {}

export class SelectGroupOutput extends CoreOutput {
  @ApiProperty({ description: '공고정보' })
  result?: Group;
}
