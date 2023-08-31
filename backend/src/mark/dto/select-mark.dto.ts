import { CoreOutput } from 'src/common/dto/output.dto';
import { Mark } from '../entity/mark.entity';

export class SelectMarkOutput extends CoreOutput {
  mark?: Mark;
}
