import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core.entity';
import { Column, Entity } from 'typeorm';

@Entity('userLoginSession')
export class UserLoginSession extends CoreEntity {
  @ApiProperty({ description: '유저 id' })
  @IsNumber()
  @Column()
  userId: number;

  @ApiProperty({ description: '최근 접속날짜' })
  @Column()
  lastAccessDate: Date;
}
