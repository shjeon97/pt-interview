import { CoreOutput } from 'src/common/dto/output.dto';
import { Mark } from '../entity/mark.entity';

export class CreateMarkOutput extends CoreOutput {
  mark?: Mark;
}
