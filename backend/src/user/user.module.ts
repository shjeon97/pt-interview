import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { GroupRepository } from 'src/group/repository/group.repository';
import { MarkRepository } from 'src/mark/repository/mark.repository';
import { UserController } from './user.controller';
import { UserLoginSessionRepository } from './repository/user-login-session.repository';
import { MarkModule } from 'src/mark/mark.module';
import { SocketIoRepository } from 'src/socket-io/repository/socket-io.repository';
import { SocketIoModule } from 'src/socket-io/socket-io.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      GroupRepository,
      MarkRepository,
      UserLoginSessionRepository,
      SocketIoRepository,
    ]),
    MarkModule,
    SocketIoModule,
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
