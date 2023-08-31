import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Question } from '../entity/question.entity';

export class SelectQuestionInput extends PickType(Question, [
  'normId',
  'page',
]) {}

export class SelectQuestionOutput extends CoreOutput {
  @ApiProperty({ description: '이미지 base64' })
  imageUrl?: string;
}
