import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketIoGateway } from './socket-io.gateway';
import { User } from 'src/user/entity/user.entity';
import { Mark } from 'src/mark/entity/mark.entity';
import { SocketIo } from './entity/socket-io.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Mark, SocketIo]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
    }),
  ],
  providers: [SocketIoGateway],
  exports: [SocketIoGateway],
})
export class SocketIoModule {}
