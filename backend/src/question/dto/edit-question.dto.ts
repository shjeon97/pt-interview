import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Question } from '../entity/question.entity';

export class EditQuestionInput extends PickType(Question, ['normId', 'page']) {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}

export class EditQuestionOutput extends CoreOutput {}
