import { DynamicModule, Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Mark } from 'src/mark/entity/mark.entity';

@Global()
@Module({})
export class AuthModule {
  static register(privateKey: string): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: privateKey,
        }),
        UserModule,
        TypeOrmModule.forFeature([Mark]),
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
        AuthService,
      ],
      exports: [AuthService],
    };
  }
}
