import { Module } from '@nestjs/common';
import { SdkController } from './sdk.controller';
import { SdkService } from './sdk.service';
import { EventGateway } from './events.gateway';

@Module({
  controllers: [SdkController],
  providers: [SdkService, EventGateway],
  exports: [SdkService],
})
export class ApiSdkModule {}
