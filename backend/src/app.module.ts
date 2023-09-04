import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import * as Joi from 'joi';
import { User } from './user/entity/user.entity';
import { NormModule } from './norm/norm.module';
import { QuestionModule } from './question/question.module';
import { OrientationModule } from './orientation/orientation.module';
import { GroupModule } from './group/group.module';
import { Norm } from './norm/entity/norm.entity';
import { Orientation } from './orientation/entity/orientation.entity';
import { Question } from './question/entity/question.entity';
import { Group } from './group/entity/group.entity';
import { AuthModule } from './auth/auth.module';
import { GuideModule } from './guide/guide.module';
import { Guide } from './guide/entity/guide.entity';
import { MarkModule } from './mark/mark.module';
import { Mark } from './mark/entity/mark.entity';
import { CommonModule } from './common/common.module';
import { User_Group } from './user/entity/user_group.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { UserLoginSession } from './user/entity/user-login-session.entity';
import { SocketIoModule } from './socket-io/socket-io.module';
import { SocketIo } from './socket-io/entity/socket-io.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.prod',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'test', 'prod').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        MAIL_HOST: Joi.string().required(),
        MAIL_PORT: Joi.string().required(),
        MAIL_FROM: Joi.string().required(),
        SMS_ID: Joi.string().required(),
        SMS_API_KEY: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
        SERVER_ADDRESS: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'prod',
      // logging: process.env.NODE_ENV !== 'prod',
      logging: false,
      keepConnectionAlive: true,
      entities: [
        User,
        Norm,
        Group,
        Orientation,
        Question,
        Guide,
        Mark,
        User_Group,
        UserLoginSession,
        SocketIo,
      ],
    }),
    UserModule,
    NormModule,
    QuestionModule,
    OrientationModule,
    GroupModule,
    AuthModule.register(process.env.PRIVATE_KEY),
    GuideModule,
    MarkModule,
    CommonModule,
    ScheduleModule.forRoot(),
    SocketIoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
