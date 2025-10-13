import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { CustomLoggerService } from '../shared/utils/logger.service';
import { GESTION_MS } from './microservices.module';

@Injectable()
export class StartupCheckService implements OnApplicationBootstrap {
  constructor(
    @Inject(GESTION_MS) private readonly gestionClient: ClientProxy,
    private readonly config: ConfigService,
    private readonly logger: CustomLoggerService
  ) {}

  async onApplicationBootstrap() {
    const pattern = { cmd: 'health.ping' };
    const payload = { userContext: { traceId: 'startup-check' } };
    const timeoutMs = Number(this.config.get('GESTION_MS_TIMEOUT') || 3000);
    try {
      const obs$ = this.gestionClient
        .send(pattern, payload)
        .pipe(timeout(timeoutMs));
      const res = await firstValueFrom(obs$);
      this.logger.log(`MS Gestión disponible: ${JSON.stringify(res)}`);
    } catch (err: any) {
      this.logger.warn(
        `MS Gestión no disponible en arranque (host=${this.config.get(
          'GESTION_MS_HOST'
        )}, port=${this.config.get('GESTION_MS_PORT')}): ${err?.message || err}`
      );
    }
  }
}
