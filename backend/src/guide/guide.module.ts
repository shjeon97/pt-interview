import { Module } from '@nestjs/common';
import { GuideService } from './guide.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuideRepository } from './repository/guide.repository';
import { NormRepository } from 'src/norm/repository/norm.repository';
import { GuideController } from './guide.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GuideRepository, NormRepository])],
  providers: [GuideService],
  controllers: [GuideController],
})
export class GuideModule {}
