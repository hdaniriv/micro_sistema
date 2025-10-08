import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { CustomLoggerService } from '../utils/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly customLogger = new CustomLoggerService();

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let details: any = null;

    const isDevelopment = process.env.NODE_ENV === 'development';

    // TypeORM QueryFailedError
    if (exception instanceof QueryFailedError) {
      // Log detallado del error de base de datos
      this.customLogger.logDatabase(exception, 'QueryFailedError');

      switch ((exception as any).code) {
        case '23505': // unique_violation (PostgreSQL)
        case 'ER_DUP_ENTRY': // 1062 (MySQL)
          message = 'Ya existe un registro con estos datos.';
          status = HttpStatus.CONFLICT;
          break;
        case '23503': // foreign_key_violation (PostgreSQL)
        case 'ER_NO_REFERENCED_ROW_2': // 1452 (MySQL)
          message = 'Referencia inválida: el dato relacionado no existe.';
          status = HttpStatus.BAD_REQUEST;
          break;
        case '23502': // not_null_violation (PostgreSQL)
        case 'ER_BAD_NULL_ERROR': // 1048 (MySQL)
          message = 'Hay campos obligatorios que no fueron completados.';
          status = HttpStatus.BAD_REQUEST;
          break;
        case '22001': // string_data_right_truncation (PostgreSQL)
        case 'ER_DATA_TOO_LONG': // 1406 (MySQL)
          message = 'Algún campo supera el largo permitido.';
          status = HttpStatus.BAD_REQUEST;
          break;
        case '42703': // undefined_column (PostgreSQL)
        case 'ER_BAD_FIELD_ERROR': // 1054 (MySQL)
          message = 'Campo desconocido en la base de datos.';
          status = HttpStatus.BAD_REQUEST;
          break;
        case 'ER_NO_SUCH_TABLE': // 1146 (MySQL)
          message = isDevelopment
            ? `Tabla no existe: ${(exception as any).sql}`
            : 'Error de configuración de base de datos.';
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          break;
        default:
          message = isDevelopment
            ? `Error BD: ${exception.message}`
            : 'Error en la base de datos. Por favor, verifica los datos ingresados.';
          status = HttpStatus.BAD_REQUEST;
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        details = (exceptionResponse as any).details || null;
      }
    } else {
      // Log unexpected errors con stack trace completo
      const errorMessage =
        exception instanceof Error ? exception.message : String(exception);
      const errorStack =
        exception instanceof Error
          ? exception.stack || errorMessage
          : String(exception);

      this.customLogger.logError(
        `Unexpected Error: ${errorMessage}`,
        errorStack,
        'UnexpectedError'
      );
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      ...(details && { details }),
    };

    // Don't expose internal errors in production
    if (
      status === HttpStatus.INTERNAL_SERVER_ERROR &&
      process.env.NODE_ENV === 'production'
    ) {
      errorResponse.message = 'Error interno del servidor';
    }

    // Log HTTP request con información adicional
    const userAgent = request.get('User-Agent');
    const clientIp = request.ip || request.connection.remoteAddress;

    this.customLogger.logHttp(
      request.method,
      request.url,
      status,
      message,
      userAgent,
      clientIp
    );

    response.status(status).json(errorResponse);
  }
}
