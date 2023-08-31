import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NormRepository } from 'src/norm/repository/norm.repository';
import { OrientationService } from './orientation.service';
import { OrientationRepository } from './repository/orientation.repository';
import { OrientationController } from './orientation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrientationRepository, NormRepository])],
  providers: [OrientationService],
  controllers: [OrientationController],
})
export class OrientationModule {}
