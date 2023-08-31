import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Guide } from '../entity/guide.entity';

export class CreateGuideInput extends PickType(Guide, ['normId', 'page']) {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}

export class CreateGuideOutput extends CoreOutput {}
