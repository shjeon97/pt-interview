import { ApiProperty } from '@nestjs/swagger';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/pagination.dto';
import { Norm } from '../entity/norm.entity';

export class SearchNormInput extends PaginationInput {}

export class SearchNormOutput extends PaginationOutput {
  @ApiProperty({ description: '유저 리스트' })
  result?: Norm[];
}
