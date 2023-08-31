import { ApiProperty } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Mark } from 'src/mark/entity/mark.entity';
import { User } from 'src/user/entity/user.entity';
import { Group } from '../entity/group.entity';

export class DetailUser {
  @ApiProperty({ description: '유저정보' })
  user: User;
  @ApiProperty({ description: '유저 마크정보' })
  mark?: Mark;
}

export class DetailGroupInput {
  @ApiProperty({ description: '공고 id' })
  groupId: number;
}

export class DetailGroupOutput extends CoreOutput {
  @ApiProperty({ description: '유저 리스트' })
  result?: {
    detailUserList?: DetailUser[];
    group: Group;
  };
}
