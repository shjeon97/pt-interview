import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SocketIoAdapter } from './adapter/socket-io.adapter';
// import { IoAdapter } from '@nestjs/platform-socket.io';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useWebSocketAdapter(new SocketIoAdapter(app));
  if (process.env.NODE_ENV === 'prod') {
    app.enableCors({
      origin: ['https://pt-interview.prod.kro.kr'],
      credentials: true,
    });
  } else {
    app.enableCors({
      origin: true,
      credentials: true,
    });
  }

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public',
  });

  const config = new DocumentBuilder()
    .setTitle('PT-INTERVIEW API')
    .setDescription('PT-INTERVIEW 개발을 위한 API 문서입니다.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ? +process.env.PORT : 4000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
