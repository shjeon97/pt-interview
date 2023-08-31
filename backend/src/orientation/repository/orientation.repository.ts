import { EntityRepository, Repository } from 'typeorm';
import { Orientation } from '../entity/orientation.entity';

@EntityRepository(Orientation)
export class OrientationRepository extends Repository<Orientation> {}
