import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfig, appConfiguration } from '@xact-checkout/api/configuration';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: true },
  );

  const appConfig = app.get<AppConfig>(appConfiguration.KEY);

  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);

  const swaggerDocOptions = new DocumentBuilder()
    .setTitle('Xact Checkout API')
    .setDescription('API documentation for Xact Checkout')
    .setVersion('1.0.0')
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerDocOptions);

  SwaggerModule.setup('api', app, swaggerDoc, {
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  });

  await app.listen(appConfig.port, '0.0.0.0');
}

bootstrap();
