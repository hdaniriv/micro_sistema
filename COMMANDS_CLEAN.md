# Comandos Rápidos

## Setup Inicial

```bash
# Setup completo automático
# Windows
.\setup-development.ps1

# Linux/Mac
chmod +x setup-development.sh && ./setup-development.sh

# Solo extensiones de VS Code
npm run setup:vscode:win    # Windows
npm run setup:vscode:unix   # Linux/Mac
```

## Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run start:dev

# Ejecutar con watch mode
npm run start:dev

# Build del proyecto
npm run build

# Ejecutar en producción
npm run start:prod
```

## Base de Datos

```bash
# Ver logs de MySQL
docker logs mysql-container

# Conectar a MySQL
docker exec -it mysql-container mysql -u root -p

# Backup de la base de datos
docker exec mysql-container mysqldump -u root -p gestion_sistema > backup.sql

# Restaurar base de datos
docker exec -i mysql-container mysql -u root -p gestion_sistema < backup.sql
```

## Docker

```bash
# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar servicios
docker-compose down

# Rebuild servicios
docker-compose up --build

# Ver contenedores activos
docker ps
```

## Testing

```bash
# Ejecutar todos los tests
npm run test

# Tests con watch mode
npm run test:watch

# Tests con coverage
npm run test:cov

# Tests end-to-end
npm run test:e2e
```

## Producción

```bash
# Build optimizado
npm run build

# Ejecutar en producción
npm run start:prod

# Verificar health check
curl http://localhost:3000/health
```

## Atajos de VS Code

- `Ctrl + Shift + P` - Command Palette
- `Ctrl + Shift + E` - Explorer
- `Ctrl + Shift + F` - Buscar en archivos
- `Ctrl + Shift + G` - Source Control
- `Ctrl + Shift + D` - Debug
- `F5` - Start Debugging
- `Ctrl + F5` - Run Without Debugging

## URLs Importantes

- **Aplicación**: http://localhost:3000
- **Swagger UI**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/health
- **Database**: localhost:3307

## Credenciales por Defecto

### Usuario Administrador
- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@sistema.com`

### Base de Datos MySQL
- **Host**: `localhost`
- **Puerto**: `3307`
- **Usuario**: `root`
- **Contraseña**: (configurada en .env)
- **Base de Datos**: `gestion_sistema`

## Estructura del Proyecto

```
src/
├── application/         # Casos de uso y servicios
├── domain/             # Entidades y reglas de negocio
├── infrastructure/     # Implementaciones técnicas
├── presentation/       # Controladores y DTOs
└── shared/            # Utilidades compartidas
```