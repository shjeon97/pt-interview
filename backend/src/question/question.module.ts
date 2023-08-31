import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NormRepository } from 'src/norm/repository/norm.repository';
import { QuestionService } from './question.service';
import { QuestionRepository } from './repository/question.repository';
import { QuestionController } from './question.controller';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionRepository, NormRepository])],
  providers: [QuestionService],
  controllers: [QuestionController],
})
export class QuestionModule {}
