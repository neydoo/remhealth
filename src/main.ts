import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'winston';
import { AppModule } from './app.module';
import { LOGGER } from './shared/constants/schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = app.get<Logger>(LOGGER);
  const port = configService.get<string>('port');

  logger.info(`starting server on port: ${port}`);

  const config = new DocumentBuilder()
    .setTitle('RemHealth API')
    .setDescription('The remHealth API description')
    .setVersion('1.0')
    .addTag('health')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port, '0.0.0.0');
  logger.info(`Server running on port: ${port}`);
}
bootstrap();
