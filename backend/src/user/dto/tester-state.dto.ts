import { ApiProperty } from '@nestjs/swagger';
import { Mark } from 'src/mark/entity/mark.entity';
import { User } from '../entity/user.entity';

export class TesterStateOutput {
  @ApiProperty({ type: User, description: '지원자 정보' })
  tester: User;

  @ApiProperty({ type: Mark, description: '지원자 마크', nullable: true })
  mark?: Mark;
}
