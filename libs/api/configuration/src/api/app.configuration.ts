import { ConfigType, registerAs } from '@nestjs/config';

export const appConfiguration = registerAs('app', () => ({
  host: process.env.APP_HOST,
  port: process.env.APP_PORT,
  domain: process.env.APP_DOMAIN,
  sdkApi: process.env.XACT_SDK_API,
}));

export type AppConfig = ConfigType<typeof appConfiguration>;
