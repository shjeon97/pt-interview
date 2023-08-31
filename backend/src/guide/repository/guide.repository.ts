import { EntityRepository, Repository } from 'typeorm';
import { Guide } from '../entity/guide.entity';

@EntityRepository(Guide)
export class GuideRepository extends Repository<Guide> {}
