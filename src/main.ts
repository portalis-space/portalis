import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { grpcClientOptions } from './grpc-client.options';
import { ValidationPipe as CustomValidationPipe } from './utils/pipe/validation-pipe';
import { AllExceptionsFilter } from '@utils/exception-fileter';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigSwagger } from '@config/app/config';
import { SwaggerModule } from '@nestjs/swagger';
import * as argon from 'argon2';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, whitelist: true }),
    new CustomValidationPipe(),
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix(process.env.GLOBAL_PREFIX);
  app.enableCors();
  const document = SwaggerModule.createDocument(app, ConfigSwagger);
  SwaggerModule.setup(process.env.GLOBAL_PREFIX, app, document);
  await app.listen(process.env.PORT);
}
bootstrap();
