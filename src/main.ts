import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'fastify-helmet';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import compression from 'fastify-compress';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfig, appConfiguration } from '@xact-checkout/api/configuration';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: true },
  );

  const appConfig = app.get<AppConfig>(appConfiguration.KEY);

  await app.register(compression, { encodings: ['gzip', 'deflate'] });
  await app.register(helmet.fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  await app.register(require('fastify-rate-limit'), {
    max: 100,
    timeWindow: '1 minute',
  });

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
