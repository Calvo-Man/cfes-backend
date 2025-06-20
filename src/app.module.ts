import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiembrosModule } from './miembros/miembros.module';
import { RolesModule } from './roles/roles.module';
import { AseosModule } from './aseos/aseos.module';
import { RoleSeedModule } from './roles/roles-seed.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        connectTimeout: 40000,
        autoLoadEntities: true,
        // ssl: {
        //   rejectUnauthorized: true
        // },
      }),
      inject: [ConfigService],
    }),
    MiembrosModule,
    RolesModule,
    AseosModule,
    RoleSeedModule
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}