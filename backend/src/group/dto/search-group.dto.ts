import { ApiProperty } from '@nestjs/swagger';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/pagination.dto';
import { Group } from '../entity/group.entity';

export class SearchGroupInput extends PaginationInput {}

export class SearchGroupOutput extends PaginationOutput {
  @ApiProperty({ description: '공고 리스트' })
  result?: Group[];
}
