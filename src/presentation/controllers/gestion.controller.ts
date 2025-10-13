import {
  Controller,
  GatewayTimeoutException,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Request,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { firstValueFrom, timeout } from 'rxjs';
import { GESTION_MS } from '../../application/microservices.module';
import { CustomLoggerService } from '../../shared/utils/logger.service';

@ApiTags('Gestión')
@Controller('gestion')
export class GestionController {
  constructor(
    @Inject(GESTION_MS) private readonly gestionClient: ClientProxy,
    private readonly logger: CustomLoggerService,
    private readonly config: ConfigService
  ) {}

  @Get('health')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Health check MS Gestión (RPC health.ping) — público',
  })
  @ApiOkResponse({
    description: 'MS Gestión operativo',
    schema: {
      properties: {
        status: { type: 'string', example: 'ok' },
        service: { type: 'string', example: 'gestion' },
        time: { type: 'string', format: 'date-time' },
        traceId: { type: 'string', nullable: true },
      },
    },
  })
  @ApiResponse({ status: 504, description: 'Gestión no respondió a tiempo' })
  @ApiResponse({ status: 503, description: 'Gestión no disponible' })
  async health(@Request() req: any) {
    const user = req.user;
    const userContext = {
      userId: user?.sub,
      roles: user?.roles || [],
      username: user?.username,
      traceId: req.headers['x-trace-id'] || undefined,
    };

    const pattern = { cmd: 'health.ping' };
    const payload = { userContext };
    try {
      const timeoutMs = Number(this.config.get('GESTION_MS_TIMEOUT') || 3000);
      const obs$ = this.gestionClient
        .send(pattern, payload)
        .pipe(timeout(timeoutMs));
      return await firstValueFrom(obs$);
    } catch (err: any) {
      const msg = 'Error comunicando con MS Gestión (health)';
      this.logger.logError(err, msg, 'GestionController.health');
      if (err?.name === 'TimeoutError') {
        throw new GatewayTimeoutException('Gestión no respondió a tiempo');
      }
      throw new ServiceUnavailableException('Gestión no disponible');
    }
  }
}
