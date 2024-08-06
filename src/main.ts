import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import * as bodyParser from 'body-parser'
import { ParseFormDataJsonPipe } from './common/pipes/parse-form-data.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Online Store API')
    .setDescription('Online store API')
    .setVersion('1.0')
    .addServer('http://localhost:3000/', 'Local environment')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  
  SwaggerModule.setup('api-docs', app, document);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json())

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  await app.listen(3000);
}

bootstrap();