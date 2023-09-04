import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { MarkModule } from 'src/mark/mark.module';
import { SocketIoModule } from 'src/socket-io/socket-io.module';
import { Group } from 'src/group/entity/group.entity';
import { User } from './entity/user.entity';
import { Mark } from 'src/mark/entity/mark.entity';
import { UserLoginSession } from './entity/user-login-session.entity';
import { SocketIo } from 'src/socket-io/entity/socket-io.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Group, Mark, UserLoginSession, SocketIo]),
    MarkModule,
    SocketIoModule,
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
