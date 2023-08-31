import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User_Group {
  @ApiProperty({
    description: '유저 id',
  })
  @PrimaryGeneratedColumn()
  userId: number;

  @ApiProperty({
    description: '공고 id',
  })
  @PrimaryGeneratedColumn()
  groupId: number;
}
