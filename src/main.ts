import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { setupSwagger } from './config/swagger.config';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { kafkaConfig } from './config/kafka.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);

  // get config from app namespace
  const port = configService.get<number>('app.port') || 3000;
  const corsOrigin = configService.get<string>('app.cors.origin');
  // const corsEnabled = configService.get<boolean>('app.cors.enabled');

  kafkaConfig(app, configService);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
    }),
  );
  setupSwagger(app);

  await app.startAllMicroservices();

  await app.listen(port, () => {
    console.log('server start with port:', port);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
