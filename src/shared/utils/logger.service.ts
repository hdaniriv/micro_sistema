import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CustomLoggerService extends Logger {
  private logsDir = path.join(process.cwd(), 'logs');

  constructor() {
    super('CustomLogger');
    this.ensureLogsDirectory();
  }

  private ensureLogsDirectory() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  private getCurrentDateString(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Log de errores con stack trace completo
   */
  logError(message: string, trace: string, context?: string) {
    const timestamp = this.getTimestamp();
    const logEntry = `[${timestamp}] ERROR [${context || 'Unknown'}] ${message}\n${trace}\n${'='.repeat(80)}\n`;
    
    // Log en consola
    super.error(message, trace, context);
    
    // Log en archivo
    const errorLogFile = path.join(this.logsDir, `error-${this.getCurrentDateString()}.log`);
    this.writeToFile(errorLogFile, logEntry);
  }

  /**
   * Log de requests HTTP
   */
  logHttp(method: string, url: string, statusCode: number, message: string, userAgent?: string, ip?: string) {
    const timestamp = this.getTimestamp();
    const logEntry = `[${timestamp}] ${method} ${url} - ${statusCode} - ${message}${userAgent ? ` - ${userAgent}` : ''}${ip ? ` - IP: ${ip}` : ''}\n`;
    
    // Log solo errores en consola
    if (statusCode >= 400) {
      if (statusCode >= 500) {
        super.error(`${method} ${url} - ${statusCode} - ${message}`);
      } else {
        super.warn(`${method} ${url} - ${statusCode} - ${message}`);
      }
    }
    
    // Log en archivo
    const httpLogFile = path.join(this.logsDir, `http-${this.getCurrentDateString()}.log`);
    this.writeToFile(httpLogFile, logEntry);
  }

  /**
   * Log específico de base de datos
   */
  logDatabase(error: any, context: string = 'DatabaseError') {
    const timestamp = this.getTimestamp();
    const logEntry = `[${timestamp}] DB_ERROR [${context}]\n` +
      `Code: ${error.code || 'Unknown'}\n` +
      `Message: ${error.message || 'No message'}\n` +
      `SQL: ${error.sql || 'No SQL'}\n` +
      `Parameters: ${error.parameters ? JSON.stringify(error.parameters, null, 2) : 'No parameters'}\n` +
      `Stack: ${error.stack || 'No stack trace'}\n` +
      `${'='.repeat(80)}\n`;

    // Log en consola
    super.error(`Database Error [${context}]: ${error.message}`, error.stack);
    
    // Log en archivo específico de BD
    const dbLogFile = path.join(this.logsDir, `database-${this.getCurrentDateString()}.log`);
    this.writeToFile(dbLogFile, logEntry);
  }

  /**
   * Log de aplicación general
   */
  logApplication(level: 'info' | 'warn' | 'error', message: string, context?: string, data?: any) {
    const timestamp = this.getTimestamp();
    const logEntry = `[${timestamp}] ${level.toUpperCase()} [${context || 'Application'}] ${message}${data ? `\nData: ${JSON.stringify(data, null, 2)}` : ''}\n`;
    
    // Log solo errores y warnings en consola
    switch (level) {
      case 'warn':
        super.warn(message, context);
        break;
      case 'error':
        super.error(message, '', context);
        break;
    }
    
    // Log en archivo
    const appLogFile = path.join(this.logsDir, `application-${this.getCurrentDateString()}.log`);
    this.writeToFile(appLogFile, logEntry);
  }

  /**
   * Log de autenticación y seguridad
   */
  logSecurity(event: string, details: any, ip?: string, userAgent?: string) {
    const timestamp = this.getTimestamp();
    const logEntry = `[${timestamp}] SECURITY [${event}]\n` +
      `IP: ${ip || 'Unknown'}\n` +
      `User-Agent: ${userAgent || 'Unknown'}\n` +
      `Details: ${JSON.stringify(details, null, 2)}\n` +
      `${'='.repeat(80)}\n`;

    // Log solo eventos críticos de seguridad en consola
    if (event.includes('FAILED') || event.includes('BLOCKED') || event.includes('UNAUTHORIZED')) {
      super.warn(`Security Event [${event}]: ${JSON.stringify(details)}`);
    }
    
    // Log en archivo de seguridad
    const securityLogFile = path.join(this.logsDir, `security-${this.getCurrentDateString()}.log`);
    this.writeToFile(securityLogFile, logEntry);
  }

  /**
   * Log de performance/métricas
   */
  logPerformance(operation: string, duration: number, details?: any) {
    const timestamp = this.getTimestamp();
    const logEntry = `[${timestamp}] PERFORMANCE [${operation}] ${duration}ms${details ? `\nDetails: ${JSON.stringify(details, null, 2)}` : ''}\n`;
    
    // Log en consola solo si es lento (>1000ms)
    if (duration > 1000) {
      super.warn(`Slow operation [${operation}]: ${duration}ms`);
    }
    
    // Log en archivo
    const perfLogFile = path.join(this.logsDir, `performance-${this.getCurrentDateString()}.log`);
    this.writeToFile(perfLogFile, logEntry);
  }

  /**
   * Escribir a archivo de forma segura
   */
  private writeToFile(filePath: string, content: string) {
    try {
      fs.appendFileSync(filePath, content, 'utf8');
    } catch (error) {
      super.error(`Failed to write to log file ${filePath}:`, error);
    }
  }

  /**
   * Limpiar logs antiguos
   */
  cleanOldLogs(daysToKeep: number = 30) {
    try {
      const files = fs.readdirSync(this.logsDir);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      files.forEach(file => {
        const filePath = path.join(this.logsDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime < cutoffDate) {
          fs.unlinkSync(filePath);
          super.log(`Deleted old log file: ${file}`);
        }
      });
    } catch (error) {
      super.error('Failed to clean old logs:', error);
    }
  }

  /**
   * Obtener estadísticas de logs
   */
  getLogStats(): { [key: string]: any } {
    try {
      const files = fs.readdirSync(this.logsDir);
      const stats: { [key: string]: any } = {
        totalFiles: files.length,
        filesByType: {},
        totalSize: 0
      };

      files.forEach(file => {
        const filePath = path.join(this.logsDir, file);
        const fileStats = fs.statSync(filePath);
        const fileType = file.split('-')[0];
        
        stats.totalSize += fileStats.size;
        stats.filesByType[fileType] = (stats.filesByType[fileType] || 0) + 1;
      });

      return stats;
    } catch (error) {
      super.error('Failed to get log stats:', error);
      return {};
    }
  }
}