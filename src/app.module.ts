import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LocationModule } from './location/location.module';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './common/decorators/auth-guard';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { JwtStrategy } from './auth/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWTCONSTANTS } from './common/constants/jwt';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersService } from './users/users.service';
import { AssetsModule } from './assets/assets.module';
import { TrackersModule } from './trackers/trackers.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LocationModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: JWTCONSTANTS.secret,
    }),
    UsersModule,
    AssetsModule,
    TrackersModule,
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtStrategy,
    AuthService,
    Reflector,
    UsersService,
    PrismaService,
  ],
})
export class AppModule {}
