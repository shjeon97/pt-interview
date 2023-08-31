import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/pagination.dto';
import { Question } from '../entity/question.entity';

export class SearchQuestionInput extends PaginationInput {
  @ApiProperty({ description: '규준 ID' })
  normid: number;
}

export class DetailQuestion extends PickType(Question, [
  'id',
  'normId',
  'page',
]) {
  @ApiProperty({ description: '이미지 url' })
  imageUrl: string;
}

export class SearchQuestionOutput extends PaginationOutput {
  @ApiProperty({ description: '문제 리스트' })
  result?: DetailQuestion[];
}
