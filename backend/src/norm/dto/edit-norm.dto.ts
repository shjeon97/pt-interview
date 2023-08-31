import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Norm } from '../entity/norm.entity';

export class EditNormInput extends PartialType(
  PickType(Norm, ['name', 'timeLimit']),
) {
  @ApiProperty({ description: '규준 id' })
  normId: number;
}

export class EditNormOutput extends CoreOutput {}
