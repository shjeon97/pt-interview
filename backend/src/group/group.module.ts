import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User_Group } from 'src/user/entity/user_group.entity';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { Group } from './entity/group.entity';
import { Norm } from 'src/norm/entity/norm.entity';
import { User } from 'src/user/entity/user.entity';
import { Mark } from 'src/mark/entity/mark.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, Norm, User, Mark, User_Group])],
  providers: [GroupService],
  controllers: [GroupController],
})
export class GroupModule {}
