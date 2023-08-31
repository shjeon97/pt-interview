import { EntityRepository, Repository } from 'typeorm';
import { SocketIo } from '../entity/socket-io.entity';

@EntityRepository(SocketIo)
export class SocketIoRepository extends Repository<SocketIo> {}
