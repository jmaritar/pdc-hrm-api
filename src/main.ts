import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { apiReference } from '@scalar/nestjs-api-reference';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('API Reference')
    .setDescription('Documentación de la API con Swagger')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/v1/docs', app, document);

  app.use(
    '/reference',
    apiReference({
      spec: {
        openapi: '3.0.0',
        info: {
          title: 'API Reference',
          version: '1.0',
        },
        content: document,
      },
    })
  );

  await app.listen(3000);
}
bootstrap();
