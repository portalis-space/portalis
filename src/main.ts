import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { grpcClientOptions } from './grpc-client.options';
import { ValidationPipe as CustomValidationPipe } from './utils/pipe/validation-pipe';
import { AllExceptionsFilter } from '@utils/exception-fileter';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigSwagger } from '@config/app/config';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, whitelist: true }),
    new CustomValidationPipe(),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix(process.env.GLOBAL_PREFIX);
  // console.log(await test.hash('asdqwe123'));
  // app.connectMicroservice<MicroserviceOptions>(grpcClientOptions);
  app.enableCors();
  const document = SwaggerModule.createDocument(app, ConfigSwagger);
  // if (process.env.ENV == 'development')
  SwaggerModule.setup(process.env.GLOBAL_PREFIX, app, document);

  // fs.writeFileSync(
  //   './docs/swagger-spec.json',
  //   JSON.stringify(document, null, 2),
  // );

  // await app.startAllMicroservices();
  await app.listen(process.env.PORT);
}
bootstrap();
