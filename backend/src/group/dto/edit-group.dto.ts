import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Group } from '../entity/group.entity';

export class EditGroupInput extends PartialType(
  PickType(Group, ['name', 'normId', 'startDate', 'endDate']),
) {
  @ApiProperty({ description: '공고 id' })
  groupId: number;
}

export class EditGroupOutput extends CoreOutput {}
