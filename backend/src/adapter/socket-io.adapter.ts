import { IoAdapter } from '@nestjs/platform-socket.io';
// import { createAdapter } from '@socket.io/cluster-adapter';

export class SocketIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);
    // server.adapter(createAdapter({ host: 'localhost', port: 6379 }));
    // setupWorker(server);
    return server;
  }
}
