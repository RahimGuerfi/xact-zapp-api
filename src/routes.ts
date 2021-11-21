import { Routes } from 'nest-router';
import { ApiSdkModule } from '@xact-checkout/api/sdk';

export const routes: Routes = [
  {
    path: 'v1',
    children: [
      {
        path: 'sdk',
        module: ApiSdkModule,
      },
    ],
  },
];
