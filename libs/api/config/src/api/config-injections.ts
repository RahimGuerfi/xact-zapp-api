import { Inject } from '@nestjs/common';
import { appConfiguration } from '@xact-checkout/api/configuration';

export const InjectAppConfig = () => Inject(appConfiguration.KEY);
