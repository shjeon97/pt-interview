import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Norm } from '../entity/norm.entity';

export class SelectNormInput extends PickType(Norm, ['id']) {}

export class SelectNormOutput extends CoreOutput {
  @ApiProperty({ description: '규준' })
  result?: Norm;
}
