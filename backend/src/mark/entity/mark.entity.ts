import { ApiProperty } from '@nestjs/swagger';
import { CoreEntity } from 'src/common/entity/core.entity';
import { User } from 'src/user/entity/user.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@Entity()
export class Mark extends CoreEntity {
  @ApiProperty({ description: '지원자 정보' })
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({ description: '지원자 id' })
  @RelationId((mark: Mark) => mark.user)
  userId: number;

  @ApiProperty({ description: '마크' })
  @Column({ nullable: true })
  mark?: string;

  @ApiProperty({ description: '메모' })
  @Column({ nullable: true })
  memo?: string;

  @ApiProperty({ description: '남은시간' })
  @Column()
  timeRemaining: number;

  @ApiProperty({ description: '시작시간' })
  @Column({ nullable: true })
  startDate?: Date;

  @ApiProperty({ description: '종료시간' })
  @Column({ nullable: true })
  endDate?: Date;
}
