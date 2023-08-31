import { PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Orientation } from '../entity/orientation.entity';

export class DeleteOrientationInput extends PickType(Orientation, [
  'normId',
  'page',
]) {}

export class DeleteOrientationOutput extends CoreOutput {}
