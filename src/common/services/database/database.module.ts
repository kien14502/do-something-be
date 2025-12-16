import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          username: configService.get<string>('DB_USERNAME', ''),
          host: configService.get<string>('DB_HOST', ''),
          database: configService.get<string>('DB_DATABASE', ''),
          password: configService.get<string>('DB_PASSWORD', ''),
          port: configService.get<number>('DB_PORT'),
          autoLoadEntities: true,
          // Chỉ sử dụng synchronize: true trong môi trường dev/staging
          synchronize: configService.get<string>('NODE_ENV') !== 'production',
          logging: true,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
