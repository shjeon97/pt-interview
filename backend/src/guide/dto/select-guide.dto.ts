import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Guide } from '../entity/guide.entity';

export class SelectGuideInput extends PickType(Guide, ['normId', 'page']) {}

export class SelectGuideOutput extends CoreOutput {
  @ApiProperty({ description: '가이드 이미지' })
  imageUrl?: string;
}
