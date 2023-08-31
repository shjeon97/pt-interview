import { PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Question } from '../entity/question.entity';

export class DeleteQuestionInput extends PickType(Question, [
  'normId',
  'page',
]) {}

export class DeleteQuestionOutput extends CoreOutput {}
