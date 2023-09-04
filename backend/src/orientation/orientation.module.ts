import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrientationService } from './orientation.service';
import { OrientationController } from './orientation.controller';
import { Orientation } from './entity/orientation.entity';
import { Norm } from 'src/norm/entity/norm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Orientation, Norm])],
  providers: [OrientationService],
  controllers: [OrientationController],
})
export class OrientationModule {}
