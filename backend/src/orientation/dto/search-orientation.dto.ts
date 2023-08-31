import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/pagination.dto';
import { Orientation } from '../entity/orientation.entity';

export class SearchOrientationInput extends PaginationInput {
  @ApiProperty({ description: '규준 ID' })
  normid: number;
}

export class DetailOrientation extends PickType(Orientation, [
  'id',
  'normId',
  'page',
]) {
  @ApiProperty({ description: '이미지 url' })
  imageUrl: string;
}

export class SearchOrientationOutput extends PaginationOutput {
  @ApiProperty({ description: '오리엔테이션 리스트' })
  result?: DetailOrientation[];
}
