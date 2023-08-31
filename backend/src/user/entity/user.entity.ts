import { InternalServerErrorException } from '@nestjs/common';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Group } from 'src/group/entity/group.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  Tester = 'Tester',
  Admin = 'Admin',
  SuperAdmin = 'SuperAdmin',
}

export enum UserTestState {
  Pending = 'Pending', // 대기
  InProgress = 'InProgress', // 진행중
  Done = 'Done', // 완료
  Except = 'Except', // 예외
}

@Entity()
export class User extends CoreEntity {
  @ApiProperty({
    example: UserRole.Tester,
    description: '권한',
    enum: UserRole,
  })
  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: '이름', description: '이름' })
  @Column()
  @IsString()
  name: string;

  @ApiProperty({ example: '비밀번호', description: '비밀번호' })
  @Column({ select: false })
  @IsString()
  password: string;

  @ManyToMany(() => Group, { eager: true, nullable: true })
  @JoinTable({ name: 'user_group' })
  group?: Group[];

  @ApiProperty({
    example: UserTestState.InProgress,
    description: '검사 상태',
    enum: UserTestState,
  })
  @Column({ type: 'enum', enum: UserTestState, default: UserTestState.Pending })
  @IsEnum(UserTestState)
  testState: UserTestState;

  @ApiProperty({
    example: '09:00:00',
    description: '면접 시간',
    nullable: true,
  })
  @Column('time', { nullable: true })
  @IsOptional()
  @IsString()
  ptTime?: Date;

  @ApiProperty({
    example: false,
    description: '출석 유무',
  })
  @Column({ default: false })
  isAttend: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password && this.role == UserRole.SuperAdmin) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(password, this.password);
      return ok;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
