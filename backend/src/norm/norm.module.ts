import { Module } from '@nestjs/common';
import { NormService } from './norm.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NormRepository } from './repository/norm.repository';
import { NormController } from './norm.controller';
import { OrientationRepository } from 'src/orientation/repository/orientation.repository';
import { GuideRepository } from 'src/guide/repository/guide.repository';
import { QuestionRepository } from 'src/question/repository/question.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NormRepository,
      OrientationRepository,
      GuideRepository,
      QuestionRepository,
    ]),
  ],
  providers: [NormService],
  controllers: [NormController],
})
export class NormModule {}
