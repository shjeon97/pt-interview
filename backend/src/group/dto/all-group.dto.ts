import { ApiProperty } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Group } from '../entity/group.entity';

export class AllGroupOutput extends CoreOutput {
  @ApiProperty({ description: '규준 리스트' })
  result?: Group[];
}
