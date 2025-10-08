# Sistema de Gestión - Documentación Técnica

## Descripción del Proyecto

Sistema de gestión universitario desarrollado con NestJS y TypeScript, implementando arquitectura hexagonal (Clean Architecture) con patrones DDD (Domain Driven Design). El sistema permite la gestión de usuarios, autenticación JWT, control de roles y monitoreo de accesos.

## Tecnologías Utilizadas

- **Backend**: NestJS 10+, TypeScript
- **Base de Datos**: MySQL 8.0 con TypeORM
- **Autenticación**: JWT (JSON Web Tokens)
- **Documentación**: Swagger/OpenAPI
- **Logging**: Sistema personalizado con rotación diaria
- **Contenedores**: Docker y Docker Compose
- **Validación**: class-validator, class-transformer

## Arquitectura del Sistema

### Patrón Hexagonal (Clean Architecture)

El proyecto está estructurado siguiendo los principios de Clean Architecture:

```
src/
├── domain/                    # Capa de dominio
│   ├── entities/             # Entidades de negocio
│   └── repositories/         # Interfaces de repositorios
├── application/              # Casos de uso
│   ├── auth/                # Servicios de autenticación
│   ├── users/               # Servicios de usuarios
│   └── roles/               # Servicios de roles
├── infrastructure/           # Capa de infraestructura
│   ├── database/            # Configuración de BD
│   └── repositories/        # Implementaciones concretas
├── presentation/            # Capa de presentación
│   ├── controllers/         # Controladores REST
│   ├── dto/                # Objetos de transferencia
│   └── guards/             # Guards de seguridad
└── shared/                 # Utilidades compartidas
    ├── exceptions/         # Manejo de excepciones
    └── utils/             # Servicios utilitarios
```

### Entidades Principales

#### Usuario
- Gestión completa de usuarios del sistema
- Validación de datos con decoradores
- Relaciones con roles y registros de actividad

#### Rol
- Sistema de roles jerárquico
- Control de permisos por funcionalidad
- Roles predefinidos: Administrador, Supervisor, Técnico, Cliente

#### IntentoAcceso
- Registro de intentos de login fallidos
- Seguimiento de credenciales utilizadas
- Control de seguridad por IP y dispositivo

#### Visita
- Registro de accesos exitosos al sistema
- Monitoreo de actividad de usuarios
- Análisis de patrones de uso

## Funcionalidades Implementadas

### Autenticación y Autorización
- Login con username/email y contraseña
- Tokens JWT con refresh token
- Middleware de autenticación automática
- Control de acceso basado en roles

### Gestión de Usuarios
- CRUD completo de usuarios
- Validación de datos de entrada
- Encriptación de contraseñas con bcrypt
- Estados activo/inactivo

### Sistema de Logging
- Logs categorizados por tipo (Error, HTTP, Database, Security, Performance)
- Rotación diaria automática
- Almacenamiento en archivos separados
- Integración con manejo de excepciones

### Seguridad
- Filtro global de excepciones
- Validación de entrada de datos
- Rate limiting configurable
- CORS habilitado para desarrollo

## Configuración de Base de Datos

### Estructura de Tablas

```sql
-- Tabla de usuarios
Usuario (
  id, username, password, email, nombre, activo,
  fechaCreacion, fechaModificacion, idUsuarioCreador
)

-- Tabla de roles
Rol (
  id, nombre, descripcion,
  fechaCreacion, fechaModificacion, idUsuarioCreador
)

-- Relación usuario-rol
UsuarioRol (
  id, idUsuario, idRol,
  fechaCreacion, fechaModificacion, idUsuarioCreador
)

-- Registro de intentos de acceso
IntentoAcceso (
  id, username, password, fecha, ip, dispositivo
)

-- Registro de visitas exitosas
Visita (
  id, idUsuario, username, fecha, ip, dispositivo
)
```

### Datos Iniciales

El sistema incluye datos de prueba iniciales:
- Usuario administrador: `admin` / `admin123`
- Roles base: Administrador, Supervisor, Técnico, Cliente

## API Endpoints

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/refresh` - Renovar token

### Usuarios
- `GET /usuarios` - Listar usuarios (Admin/Supervisor)
- `GET /usuarios/active` - Usuarios activos
- `GET /usuarios/:id` - Obtener usuario por ID
- `POST /usuarios` - Crear usuario
- `PUT /usuarios/:id` - Actualizar usuario
- `DELETE /usuarios/:id` - Eliminar usuario
- `POST /usuarios/change-password` - Cambiar contraseña

### Roles
- `GET /roles` - Listar roles
- `POST /roles` - Crear rol (Solo Admin)
- `PUT /roles/:id` - Actualizar rol
- `DELETE /roles/:id` - Eliminar rol

## Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- MySQL 8.0
- Docker (opcional)

### Variables de Entorno

Copiar `.env.example` a `.env.development` y configurar:

```env
# Base de datos
DB_HOST=localhost
DB_PORT=3307
DB_USERNAME=root
DB_PASSWORD=tu_password
DB_DATABASE=gestion_sistema

# JWT
JWT_SECRET=tu_jwt_secret_minimo_32_caracteres
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=tu_refresh_secret
JWT_REFRESH_EXPIRATION=7d

# Servidor
PORT=3000
NODE_ENV=development
```

### Comandos de Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run start:dev

# Construir para producción
npm run build

# Ejecutar tests
npm run test
```

### Docker

```bash
# Levantar base de datos
docker-compose up -d

# Verificar contenedores
docker ps
```

## Testing

El proyecto incluye configuración para testing con Jest:
- Tests unitarios para servicios
- Tests de integración para controladores
- Mocks para repositorios y dependencias

## Monitoreo y Logs

### Archivos de Log
- `logs/error-YYYY-MM-DD.log` - Errores del sistema
- `logs/http-YYYY-MM-DD.log` - Requests HTTP
- `logs/database-YYYY-MM-DD.log` - Operaciones de BD
- `logs/security-YYYY-MM-DD.log` - Eventos de seguridad
- `logs/performance-YYYY-MM-DD.log` - Métricas de rendimiento

### Comandos de Monitoreo

```bash
# Ver logs en tiempo real
tail -f logs/error-$(date +%Y-%m-%d).log

# Buscar errores específicos
grep "QueryFailedError" logs/database-*.log

# Contar requests por día
wc -l logs/http-*.log
```

## Documentación API

La documentación interactiva está disponible en:
- **Desarrollo**: http://localhost:3000/api/docs
- **Swagger UI**: Interfaz completa con ejemplos
- **OpenAPI**: Especificación exportable

## Contribución

### Estándares de Código
- TypeScript estricto habilitado
- ESLint y Prettier configurados
- Convenciones de nomenclatura consistentes
- Documentación de métodos públicos

### Estructura de Commits
- feat: Nueva funcionalidad
- fix: Corrección de errores
- docs: Documentación
- refactor: Refactorización de código
- test: Agregado de tests

## Licencia

Proyecto académico desarrollado para fines educativos.