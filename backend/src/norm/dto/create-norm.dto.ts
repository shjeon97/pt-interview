import { PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Norm } from '../entity/norm.entity';

export class CreateNormInput extends PickType(Norm, ['name', 'timeLimit']) {}

export class CreateNormOutput extends CoreOutput {}
