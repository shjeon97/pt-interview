import { Module } from '@nestjs/common';
import { MarkService } from './mark.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarkRepository } from './repository/mark.repository';
import { UserRepository } from 'src/user/repository/user.repository';
import { GroupRepository } from 'src/group/repository/group.repository';
import { NormRepository } from 'src/norm/repository/norm.repository';
import { MarkController } from './mark.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MarkRepository,
      UserRepository,
      GroupRepository,
      NormRepository,
    ]),
  ],
  providers: [MarkService],
  controllers: [MarkController],
  exports: [MarkService],
})
export class MarkModule {}
