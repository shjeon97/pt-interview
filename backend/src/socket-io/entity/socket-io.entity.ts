import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core.entity';
import { User } from 'src/user/entity/user.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

export enum State {
  TestPending = 'TestPending', // 검사 대기
  TestInProgress = 'TestInProgress', // 검사 진행중
  TestForceQuit = 'TestForceQuit', // 검사 강제종료
  TestForceExit = 'TestForceExit', // 검사 강제퇴장
  Except = 'Except', // 예외
}

@Entity('socketIo')
export class SocketIo extends CoreEntity {
  @ApiProperty({ description: '소켓 ID' })
  @Column()
  clientId: string;

  @ApiProperty({ description: '지원자 정보' })
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({ description: '지원자 id' })
  @RelationId((socketIo: SocketIo) => socketIo.user)
  userId: number;

  @ApiProperty({
    example: State.TestInProgress,
    description: '유저 상태',
    enum: State,
  })
  @Column({ type: 'enum', enum: State, default: State.TestInProgress })
  @IsEnum(State)
  state: State;

  @ApiProperty({ description: '지원자 토큰' })
  @Column()
  token: string;
}
