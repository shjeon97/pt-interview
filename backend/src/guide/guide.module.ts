import { Module } from '@nestjs/common';
import { GuideService } from './guide.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuideController } from './guide.controller';
import { Guide } from './entity/guide.entity';
import { Norm } from 'src/norm/entity/norm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guide, Norm])],
  providers: [GuideService],
  controllers: [GuideController],
})
export class GuideModule {}
