import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Norm extends CoreEntity {
  @ApiProperty({ description: '규준 이름' })
  @Column({ unique: true })
  @IsString()
  name: string;

  @ApiProperty({ description: '제한시간' })
  @Column()
  @IsNumber()
  timeLimit: number;
}
