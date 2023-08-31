import { PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { CreateGroupInput } from './create-group.dto';

export class UploadGroup extends PickType(CreateGroupInput, [
  'name',
  'normId',
  'startDate',
  'endDate',
] as const) {}

export class UploadGroupListInput {
  groupList: UploadGroup[];
}

export class UploadGroupListOutput extends CoreOutput {}
