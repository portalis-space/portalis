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
  // console.log(await argon.hash(process.env.ADMIN_PASSWORD));
  // console.log(
  //   new URLSearchParams([
  //     [
  //       'user',
  //       JSON.stringify({
  //         id: 99281932,
  //         first_name: 'Andrew',
  //         last_name: 'Rogue',
  //         username: 'rogue',
  //         language_code: 'en',
  //         is_premium: true,
  //         allows_write_to_pm: true,
  //       }),
  //     ],
  //     [
  //       'hash',
  //       '89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31',
  //     ],
  //     ['auth_date', '1716922846'],
  //     ['start_param', 'debug'],
  //     ['chat_type', 'sender'],
  //     ['chat_instance', '8428209589180549439'],
  //   ]).toString(),
  // );
  // fs.writeFileSync(
  //   './docs/swagger-spec.json',
  //   JSON.stringify(document, null, 2),
  // );

  // await app.startAllMicroservices();
  await app.listen(process.env.PORT);
}
bootstrap();
