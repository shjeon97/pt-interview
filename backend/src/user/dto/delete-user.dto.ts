import { ApiProperty } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';

export class DeleteUserInput {
  @ApiProperty({ description: '삭제할 유저 id' })
  userId: number;
}

export class DeleteUserOutput extends CoreOutput {}
