import { PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Mark } from '../entity/mark.entity';

export class UpdateMarkInput extends PickType(Mark, [
  'mark',
  'memo',
  'timeRemaining',
]) {}

export class UpdateMarkOutput extends CoreOutput {}
