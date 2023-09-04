import { Module } from '@nestjs/common';
import { MarkService } from './mark.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarkController } from './mark.controller';
import { Group } from 'src/group/entity/group.entity';
import { Mark } from './entity/mark.entity';
import { User } from 'src/user/entity/user.entity';
import { Norm } from 'src/norm/entity/norm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mark, User, Group, Norm])],
  providers: [MarkService],
  controllers: [MarkController],
  exports: [MarkService],
})
export class MarkModule {}
