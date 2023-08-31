import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Guide } from '../entity/guide.entity';

export class EditGuideInput extends PickType(Guide, ['normId', 'page']) {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}

export class EditGuideOutput extends CoreOutput {}
