import { EntityRepository, Repository } from 'typeorm';
import { Norm } from '../entity/norm.entity';

@EntityRepository(Norm)
export class NormRepository extends Repository<Norm> {}
