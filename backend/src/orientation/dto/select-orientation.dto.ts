import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Orientation } from '../entity/orientation.entity';

export class SelectOrientationInput extends PickType(Orientation, [
  'normId',
  'page',
]) {}

export class SelectOrientationOutput extends CoreOutput {
  @ApiProperty({ description: '이미지 url' })
  imageUrl?: string;
}
