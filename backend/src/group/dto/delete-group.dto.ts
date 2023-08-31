import { PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Group } from '../entity/group.entity';

export class DeleteGroupInput extends PickType(Group, ['id']) {}

export class DeleteGroupOutput extends CoreOutput {}
