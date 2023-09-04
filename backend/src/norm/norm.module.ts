import { Module } from '@nestjs/common';
import { NormService } from './norm.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NormController } from './norm.controller';
import { Norm } from './entity/norm.entity';
import { Orientation } from 'src/orientation/entity/orientation.entity';
import { Guide } from 'src/guide/entity/guide.entity';
import { Question } from 'src/question/entity/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Norm, Orientation, Guide, Question])],
  providers: [NormService],
  controllers: [NormController],
})
export class NormModule {}
