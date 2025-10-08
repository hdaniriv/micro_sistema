# Configuración del Entorno de Desarrollo

## Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js**: versión 18 o superior
- **npm**: versión 8 o superior (incluido con Node.js)
- **MySQL**: versión 8.0 o superior
- **Docker**: versión 20.10 o superior (opcional)
- **Docker Compose**: versión 2.0 o superior (opcional)
- **Git**: para control de versiones
- **Visual Studio Code**: editor recomendado

### Verificar Instalaciones

```bash
node --version    # v18.0.0 o superior
npm --version     # 8.0.0 o superior
mysql --version   # 8.0.0 o superior
docker --version  # 20.10.0 o superior
git --version     # cualquier versión reciente
```

## Setup Inicial del Proyecto

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd micro_sistema/sistema
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Copiar el archivo de ejemplo y configurar las variables:

```bash
# Windows
copy .env.example .env.development

# Linux/Mac
cp .env.example .env.development
```

Editar `.env.development` con tus configuraciones:

```env
# Configuración de Base de Datos
DB_HOST=localhost
DB_PORT=3307
DB_USERNAME=root
DB_PASSWORD=tu_password_mysql
DB_DATABASE=gestion_sistema

# Configuración del Servidor
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=tu_jwt_secret_minimo_32_caracteres
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=tu_refresh_secret_minimo_32_caracteres
JWT_REFRESH_EXPIRATION=7d

# Configuración de Encriptación
BCRYPT_ROUNDS=12
```

### 4. Configurar Base de Datos

#### Opción A: Con Docker (Recomendado)

```bash
# Levantar MySQL con Docker
docker-compose up -d

# Verificar que el contenedor esté corriendo
docker ps
```

#### Opción B: MySQL Local

1. Instalar MySQL 8.0
2. Crear la base de datos:

```sql
CREATE DATABASE gestion_sistema;
CREATE USER 'tu_usuario'@'localhost' IDENTIFIED BY 'tu_password';
GRANT ALL PRIVILEGES ON gestion_sistema.* TO 'tu_usuario'@'localhost';
FLUSH PRIVILEGES;
```

### 5. Ejecutar la Aplicación

```bash
# Modo desarrollo
npm run start:dev

# La aplicación estará disponible en:
# http://localhost:3000
# Swagger: http://localhost:3000/api/docs
```

## Configuración de Visual Studio Code

### Extensiones Recomendadas

Instalar automáticamente con el script:

#### Windows (PowerShell)

```powershell
# Crear y ejecutar el script de instalación
@"
Write-Host "Instalando extensiones de VS Code..." -ForegroundColor Cyan

code --install-extension ms-vscode.vscode-typescript-next
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-json
code --install-extension formulahendry.auto-rename-tag
code --install-extension christian-kohler.path-intellisense
code --install-extension ms-vscode.vscode-npm-script
code --install-extension ritwickdey.liveserver
code --install-extension ms-vscode.vscode-jest
code --install-extension humao.rest-client
code --install-extension ms-vscode.vscode-docker

Write-Host "Todas las extensiones han sido instaladas!" -ForegroundColor Cyan
"@ | Out-File -FilePath "install-extensions.ps1" -Encoding UTF8

.\install-extensions.ps1
```

#### Linux/Mac (Bash)

```bash
#!/bin/bash
echo "Instalando extensiones de VS Code..."

code --install-extension ms-vscode.vscode-typescript-next
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-json
code --install-extension formulahendry.auto-rename-tag
code --install-extension christian-kohler.path-intellisense
code --install-extension ms-vscode.vscode-npm-script
code --install-extension ritwickdey.liveserver
code --install-extension ms-vscode.vscode-jest
code --install-extension humao.rest-client
code --install-extension ms-vscode.vscode-docker

echo "Todas las extensiones han sido instaladas!"
```

### Configuraciones Incluidas

El proyecto ya incluye configuraciones optimizadas:

#### `.vscode/settings.json`
- Formateo automático al guardar
- Configuración de Prettier y ESLint
- Configuraciones específicas para TypeScript
- Auto import y organización automática

#### `.prettierrc`
- Estilo de código consistente
- Configuración para TypeScript y JSON
- Reglas de formateo automático

#### `.eslintrc.json`
- Reglas de linting para TypeScript
- Configuraciones específicas para NestJS
- Integración con Prettier

### Configuración Manual (Opcional)

Si prefieres configurar manualmente:

1. **Instalar extensiones** desde el marketplace de VS Code
2. **Configurar settings.json** en tu workspace
3. **Configurar Prettier** para formateo automático
4. **Configurar ESLint** para análisis de código

## Scripts de Setup Automatizado

### Script de Windows (PowerShell)

```powershell
# setup-development.ps1
Write-Host "Configurando entorno de desarrollo..." -ForegroundColor Green

# Instalar dependencias
Write-Host "Instalando dependencias de Node.js..." -ForegroundColor Yellow
npm install

# Configurar variables de entorno
if (-not (Test-Path ".env.development")) {
    Write-Host "Creando archivo de configuración..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.development"
    Write-Host "IMPORTANTE: Edita .env.development con tus configuraciones" -ForegroundColor Red
}

# Instalar extensiones de VS Code
Write-Host "Instalando extensiones de VS Code..." -ForegroundColor Yellow
# ... código de extensiones ...

Write-Host "Setup completado!" -ForegroundColor Green
Write-Host "Siguiente paso: Configurar .env.development y ejecutar 'npm run start:dev'" -ForegroundColor Cyan
```

### Script de Linux/Mac (Bash)

```bash
#!/bin/bash
echo "Configurando entorno de desarrollo..."

# Instalar dependencias
echo "Instalando dependencias de Node.js..."
npm install

# Configurar variables de entorno
if [ ! -f ".env.development" ]; then
    echo "Creando archivo de configuración..."
    cp .env.example .env.development
    echo "IMPORTANTE: Edita .env.development con tus configuraciones"
fi

# Instalar extensiones de VS Code
echo "Instalando extensiones de VS Code..."
# ... código de extensiones ...

echo "Setup completado!"
echo "Siguiente paso: Configurar .env.development y ejecutar 'npm run start:dev'"
```

## Configuración de Seguridad

### JWT Configuration

Generar secretos seguros para JWT:

```bash
# Generar secret aleatorio (32+ caracteres)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Configuración de Base de Datos

Para producción, usar configuraciones seguras:

```env
# Usar contraseñas fuertes
DB_PASSWORD=contraseña_muy_segura_y_compleja

# Configurar host específico en producción
DB_HOST=tu-servidor-mysql.com

# Usar SSL en producción
DB_SSL=true
```

### Variables de Entorno por Ambiente

Crear archivos específicos por ambiente:

- `.env.development` - Desarrollo local
- `.env.production` - Producción
- `.env.test` - Testing

## Verificación de la Instalación

### 1. Verificar Dependencias

```bash
npm list --depth=0
```

### 2. Verificar Base de Datos

```bash
# Si usas Docker
docker exec -it mysql-container mysql -u root -p -e "SHOW DATABASES;"

# Si usas MySQL local
mysql -u root -p -e "SHOW DATABASES;"
```

### 3. Verificar Aplicación

```bash
# Ejecutar la aplicación
npm run start:dev

# En otra terminal, verificar health check
curl http://localhost:3000/health
```

### 4. Verificar Swagger

Abrir en el navegador: http://localhost:3000/api/docs

## Solución de Problemas Comunes

### Puerto 3000 en Uso

```bash
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000

# Cambiar puerto en .env.development
PORT=3001
```

### Error de Conexión a MySQL

1. Verificar que MySQL esté corriendo
2. Verificar credenciales en `.env.development`
3. Verificar que la base de datos existe

### Errores de TypeScript

```bash
# Limpiar cache de TypeScript
npm run build
rm -rf dist/
npm run start:dev
```

**Configuración completa!**

Tu entorno de desarrollo está listo. Ejecuta `npm run start:dev` para comenzar a desarrollar.