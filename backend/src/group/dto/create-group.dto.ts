import { PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Group } from '../entity/group.entity';

export class CreateGroupInput extends PickType(Group, [
  'name',
  'normId',
  'startDate',
  'endDate',
]) {}

export class CreateGroupOutput extends CoreOutput {}
