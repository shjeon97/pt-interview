import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarkRepository } from 'src/mark/repository/mark.repository';
import { UserRepository } from 'src/user/repository/user.repository';
import { SocketIoRepository } from './repository/socket-io.repository';
import { SocketIoGateway } from './socket-io.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      MarkRepository,
      SocketIoRepository,
    ]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
    }),
  ],
  providers: [SocketIoGateway],
  exports: [SocketIoGateway],
})
export class SocketIoModule {}
