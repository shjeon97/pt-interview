import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/pagination.dto';
import { Guide } from '../entity/guide.entity';

export class SearchGuideInput extends PaginationInput {
  @ApiProperty({ description: '규준 ID' })
  normid: number;
}

export class SearchDetailGuide extends PickType(Guide, [
  'id',
  'normId',
  'page',
]) {
  @ApiProperty({ description: '이미지 url' })
  imageUrl: string;
}

export class SearchGuideOutput extends PaginationOutput {
  @ApiProperty({ description: '가이드 리스트' })
  result?: SearchDetailGuide[];
}
