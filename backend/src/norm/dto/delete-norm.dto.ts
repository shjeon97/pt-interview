import { PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Norm } from '../entity/norm.entity';

export class DeleteNormInput extends PickType(Norm, ['id']) {}

export class DeleteNormOutput extends CoreOutput {}
