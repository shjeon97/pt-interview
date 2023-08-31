import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Orientation } from '../entity/orientation.entity';

export class EditOrientationInput extends PickType(Orientation, [
  'normId',
  'page',
]) {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}

export class EditOrientationOutput extends CoreOutput {}
