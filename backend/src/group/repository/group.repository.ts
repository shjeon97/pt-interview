import { EntityRepository, Repository } from 'typeorm';
import { Group } from '../entity/group.entity';

@EntityRepository(Group)
export class GroupRepository extends Repository<Group> {
  async findByName(name: string): Promise<Group> {
    const oldGroup = await this.findOne({ name });
    return oldGroup;
  }
}
