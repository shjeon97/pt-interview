import { ApiProperty } from '@nestjs/swagger';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/pagination.dto';
import { User, UserRole } from '../entity/user.entity';

export class SearchUserInput extends PaginationInput {
  @ApiProperty({ description: '유저 타입' })
  role: UserRole;
}

export class SearchUserOutput extends PaginationOutput {
  @ApiProperty({ description: '유저 리스트' })
  result?: User[];
}
