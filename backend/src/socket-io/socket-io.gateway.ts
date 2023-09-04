import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
// import { MarkRepository } from 'src/mark/repository/mark.repository';
import { UserRepository } from 'src/user/repository/user.repository';
import { Not } from 'typeorm';
import { SocketIo, State } from './entity/socket-io.entity';
import { SocketIoRepository } from './repository/socket-io.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';

@WebSocketGateway({ cors: true })
export class SocketIoGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectRepository(User) private readonly user: UserRepository,
    // private readonly mark: MarkRepository,
    @InjectRepository(SocketIo) private readonly socketIo: SocketIoRepository,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  //소켓 연결시
  handleConnection(client: Socket): void {
    console.log('connected', client.id);
  }

  //소켓 연결 해제시 제거
  handleDisconnect(client: Socket): void {
    console.log('disonnected', client.id);
    this.socketIo.delete({ clientId: client.id });
  }

  // 검사 시작시 생성
  @SubscribeMessage('startTestToServer')
  async startTest(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { token: string },
  ): Promise<void> {
    try {
      if (!data.token) {
        this.server.emit('startTestToClient', {
          ok: false,
          error: '존재하지 않는 지원자 입니다.',
        });
        return;
      }

      const decoded = this.jwtService.verify(data.token.toString(), {
        secret: process.env.PRIVATE_KEY,
      });

      if (!decoded) {
        this.server.emit('startTestToClient', {
          ok: false,
          error: '존재하지 않는 지원자 입니다.',
        });
        return;
      }

      const testerExists = await this.user.findOne({ id: decoded['id'] });
      if (!testerExists) {
        this.server.emit('startTestToClient', {
          ok: false,
          error: '존재하지 않는 지원자 입니다.',
        });
        return;
      }

      const socketIoExists = await this.socketIo.findOne({
        where: {
          user: testerExists,
          token: Not(data.token),
        },
      });
      console.log(socketIoExists);

      // 다중 접속 차단 기능 미흡
      if (socketIoExists) {
        await this.socketIo.delete({ user: testerExists });

        this.server.to(socketIoExists.clientId).emit('logoutTesterToClient', {
          ok: true,
          error: '다중 접속 감지되어 로그아웃 됩니다.',
        });
      }
      this.socketIo.save(
        this.socketIo.create({
          user: testerExists,
          state: State.TestInProgress,
          clientId: client.id,
          token: data.token,
        }),
      );

      this.server.to(client.id).emit('startTestToClient', {
        ok: true,
      });
    } catch (error) {
      console.log(error);
      this.server.to(client.id).emit('startTestToClient', {
        ok: false,
        error: '지원자 검사시작 실패',
      });
    }
  }

  logoutTester(user: SocketIo, errorMessage: string) {
    this.server.to(user.clientId).emit('logoutTesterToClient', {
      ok: true,
      error: errorMessage,
    });
  }

  //   //메시지가 전송되면 모든 유저에게 메시지 전송
  //   @SubscribeMessage('sendMessage')
  //   sendMessage(client: Socket, message: string): void {
  //     for (const [id, thisClient] of Object.entries(this.client)) {
  //       thisClient.emit('getMessage', {
  //         id: client.id,
  //         nickname: thisClient.data.nickname,
  //         message,
  //       });
  //     }
  //   }

  //   //처음 접속시 닉네임 등 최초 설정
  //   @SubscribeMessage('setInit')
  //   setInit(client: Socket, payload: any) {
  //     if (client.data.isInit) {
  //       return;
  //     }
  //     client.data.nickname = payload.nickname
  //       ? payload.nickname
  //       : '낯선사람' + client.id;
  //     client.data.isInit = true;
  //     return {
  //       nickname: client.data.nickname,
  //     };
  //   }

  //   //닉네임 변경
  //   @SubscribeMessage('setNickname')
  //   setNickname(client: Socket, payload: string): void {
  //     client.data.nickname = payload;
  //   }
}
