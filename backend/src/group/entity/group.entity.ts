import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core.entity';
import { Norm } from 'src/norm/entity/norm.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@Entity()
export class Group extends CoreEntity {
  @ApiProperty({ description: '이름' })
  @Column({ unique: true })
  @IsString()
  name: string;

  @ManyToOne(() => Norm)
  norm: Norm;

  @ApiProperty({ description: '규준 id' })
  @RelationId((group: Group) => group.norm)
  normId: number;

  @ApiProperty({ description: '검사 시작일' })
  @Column()
  startDate: Date;

  @ApiProperty({ description: '검사 종료일' })
  @Column()
  endDate: Date;
}
