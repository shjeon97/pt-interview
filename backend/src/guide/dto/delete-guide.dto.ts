import { PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Guide } from '../entity/guide.entity';

export class DeleteGuideInput extends PickType(Guide, ['normId', 'page']) {}

export class DeleteGuideOutput extends CoreOutput {}
