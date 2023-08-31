import { ApiProperty } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { User } from '../entity/user.entity';

export class UserProfileInput {
  @ApiProperty({ description: '해당 유저 id' })
  userId: number;
}

export class UserProfileOutput extends CoreOutput {
  @ApiProperty({ type: User, description: '유저 정보', nullable: true })
  user?: User;
}
