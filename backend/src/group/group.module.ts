import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarkRepository } from 'src/mark/repository/mark.repository';
import { NormRepository } from 'src/norm/repository/norm.repository';
import { User_Group } from 'src/user/entity/user_group.entity';
import { UserRepository } from 'src/user/repository/user.repository';
import { GroupService } from './group.service';
import { GroupRepository } from './repository/group.repository';
import { GroupController } from './group.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GroupRepository,
      NormRepository,
      UserRepository,
      MarkRepository,
      User_Group,
    ]),
  ],
  providers: [GroupService],
  controllers: [GroupController],
})
export class GroupModule {}
