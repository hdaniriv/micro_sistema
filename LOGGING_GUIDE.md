# Sistema de Logging Avanzado

## Características Implementadas

### Tipos de Logs Disponibles:

1. **Error Logs** (`logs/error-YYYY-MM-DD.log`)
   - Errores inesperados con stack trace completo
   - Información detallada para debugging

2. **Database Logs** (`logs/database-YYYY-MM-DD.log`)
   - Errores específicos de TypeORM/MySQL
   - Códigos de error, SQL queries, parámetros

3. **HTTP Logs** (`logs/http-YYYY-MM-DD.log`)
   - Todos los requests HTTP con status codes
   - User-Agent, IP del cliente, timestamps

4. **Security Logs** (`logs/security-YYYY-MM-DD.log`)
   - Eventos de autenticación/autorización
   - Intentos de acceso no autorizados

5. **Performance Logs** (`logs/performance-YYYY-MM-DD.log`)
   - Operaciones lentas (>1000ms)
   - Métricas de rendimiento

6. **Application Logs** (`logs/application-YYYY-MM-DD.log`)
   - Logs generales de la aplicación
   - Info, warnings, errores específicos

## Cómo Usar el Logger

### **En Servicios:**
```typescript
import { CustomLoggerService } from '../shared/utils/logger.service';

@Injectable()
export class MiServicio {
  constructor(private readonly customLogger: CustomLoggerService) {}

  async miMetodo() {
    // Log de aplicación
    this.customLogger.logApplication('info', 'Operación iniciada', 'MiServicio');
    
    try {
      // ... lógica
    } catch (error) {
      // Log de error
      this.customLogger.logError('Error en mi método', error.stack, 'MiServicio');
    }
  }
}
```

### **Para Eventos de Seguridad:**
```typescript
this.customLogger.logSecurity('LOGIN_ATTEMPT', {
  username: 'admin',
  success: false,
  reason: 'Invalid password'
}, request.ip, request.get('User-Agent'));
```

### **Para Performance:**
```typescript
const startTime = Date.now();
// ... operación
const duration = Date.now() - startTime;
this.customLogger.logPerformance('database_query', duration, { query: 'SELECT ...' });
```

## Estructura de Archivos de Log

```
logs/
├── error-2025-10-07.log          # Errores del día
├── database-2025-10-07.log       # Errores de BD del día
├── http-2025-10-07.log           # Requests HTTP del día
├── security-2025-10-07.log       # Eventos de seguridad del día
├── performance-2025-10-07.log    # Métricas de performance del día
├── application-2025-10-07.log    # Logs generales del día
└── .gitkeep                      # Mantiene el directorio en Git
```

## Comandos para Ver Logs

### **Ver logs en tiempo real:**
```bash
# Errores
tail -f logs/error-2025-10-07.log

# HTTP requests
tail -f logs/http-2025-10-07.log

# Base de datos
tail -f logs/database-2025-10-07.log
```

### **Buscar en logs:**
```bash
# Buscar errores específicos
grep "QueryFailedError" logs/database-*.log

# Buscar por IP
grep "192.168.1.100" logs/http-*.log

# Buscar intentos de login
grep "LOGIN_ATTEMPT" logs/security-*.log
```

### **Ver estadísticas:**
```bash
# Contar errores por día
wc -l logs/error-*.log

# Ver los últimos 50 requests
tail -50 logs/http-2025-10-07.log
```

## Mantenimiento Automático

### **Limpiar logs antiguos:**
```typescript
// En algún servicio o cron job
this.customLogger.cleanOldLogs(30); // Mantener solo 30 días
```

### **Obtener estadísticas:**
```typescript
const stats = this.customLogger.getLogStats();
console.log(stats);
// { totalFiles: 12, filesByType: { error: 2, http: 2, ... }, totalSize: 1024000 }
```

## Configuración

Los logs se generan automáticamente en `logs/` y son excluidos de Git excepto el `.gitkeep`.

### **Niveles de detalle:**
- **Desarrollo**: Información completa con stack traces
- **Producción**: Mensajes genéricos para el usuario, detalles en logs

## Beneficios

- **Debugging mejorado**: Stack traces completos y contexto detallado  
- **Monitoreo**: Seguimiento de todas las operaciones  
- **Seguridad**: Log de eventos sospechosos  
- **Performance**: Identificación de operaciones lentas  
- **Auditoría**: Historial completo de actividad  
- **Separación**: Logs organizados por tipo y fecha  
- **Rotación**: Un archivo por día para facilitar manejo  