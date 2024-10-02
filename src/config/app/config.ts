import { registerAs } from '@nestjs/config';
import { DocumentBuilder } from '@nestjs/swagger';

export default registerAs('app', () => ({
  env: process.env.ENV,
  name: process.env.APP_NAME,
  url: process.env.APP_URL,
  port: +(process.env.PORT || 3000),
}));

export const ConfigSwagger = new DocumentBuilder()
  .setTitle('Portalis API')
  .setDescription('API Documentation')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
