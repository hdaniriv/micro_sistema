import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const GESTION_MS = 'GESTION_MS';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: GESTION_MS,
        imports: [ConfigModule],
        useFactory: async (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('GESTION_MS_HOST') || '127.0.0.1',
            port: parseInt(config.get<string>('GESTION_MS_PORT') || '4010', 10),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class MicroservicesModule {}
