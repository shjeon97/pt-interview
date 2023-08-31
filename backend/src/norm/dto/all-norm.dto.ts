import { ApiProperty } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';

import { Norm } from '../entity/norm.entity';

export class AllNormOutput extends CoreOutput {
  @ApiProperty({ description: '규준 리스트' })
  result?: Norm[];
}
