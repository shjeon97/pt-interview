import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { Question } from './entity/question.entity';
import { Norm } from 'src/norm/entity/norm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Norm])],
  providers: [QuestionService],
  controllers: [QuestionController],
})
export class QuestionModule {}
