import { EntityRepository, Repository } from 'typeorm';
import { Mark } from '../entity/mark.entity';

@EntityRepository(Mark)
export class MarkRepository extends Repository<Mark> {}
