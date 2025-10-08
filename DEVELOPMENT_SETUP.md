# 🔧 Configuración del Entorno de Desarrollo

Este documento contiene todas las instrucciones para configurar el entorno de desarrollo completo en una nueva máquina.

## 📋 Prerrequisitos

### Software Requerido

- **Node.js** (v18 o superior) - [Descargar aquí](https://nodejs.org/)
- **npm** (incluido con Node.js)
- **Git** - [Descargar aquí](https://git-scm.com/)
- **Docker Desktop** - [Descargar aquí](https://www.docker.com/products/docker-desktop)
- **Visual Studio Code** - [Descargar aquí](https://code.visualstudio.com/)

### Verificar Instalaciones

```bash
node --version    # Debe mostrar v18+
npm --version     # Debe mostrar versión
git --version     # Debe mostrar versión
docker --version  # Debe mostrar versión
```

## 🚀 Setup Inicial del Proyecto

### 1. Clonar el Repositorio

```bash
git clone https://github.com/hdaniriv/micro_sistema.git
cd micro_sistema/sistema
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

```bash
# Windows
copy .env.example .env.development

# Linux/Mac
cp .env.example .env.development
```

Editar el archivo `.env.development` con tus configuraciones locales (ver `ENV_SETUP.md` para detalles).

### 4. Iniciar Base de Datos

```bash
docker-compose up -d
```

### 5. Verificar Conexión a BD

```bash
npm run start:dev
```

## 🎨 Configuración de Visual Studio Code

### Extensiones Requeridas

Ejecutar estos comandos en la terminal para instalar todas las extensiones necesarias:

```bash
# Extensiones esenciales para TypeScript/NestJS
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-json

# Extensiones para desarrollo
code --install-extension christian-kohler.path-intellisense
code --install-extension formulahendry.auto-rename-tag
code --install-extension ms-vscode.vscode-eslint
code --install-extension aaron-bond.better-comments

# Extensiones para Docker y Git
code --install-extension ms-vscode-remote.remote-containers
code --install-extension ms-azuretools.vscode-docker
code --install-extension eamodio.gitlens

# Extensiones para bases de datos
code --install-extension cweijan.vscode-mysql-client2

# Temas y iconos (opcional)
code --install-extension pkief.material-icon-theme
code --install-extension zhuangtongfa.material-theme
```

### Script de Instalación Automática

Crear y ejecutar este script para instalar todas las extensiones de una vez:

**Windows (PowerShell):**

```powershell
# setup-vscode-extensions.ps1
$extensions = @(
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json",
    "christian-kohler.path-intellisense",
    "formulahendry.auto-rename-tag",
    "ms-vscode.vscode-eslint",
    "aaron-bond.better-comments",
    "ms-vscode-remote.remote-containers",
    "ms-azuretools.vscode-docker",
    "eamodio.gitlens",
    "cweijan.vscode-mysql-client2",
    "pkief.material-icon-theme",
    "zhuangtongfa.material-theme"
)

foreach ($extension in $extensions) {
    Write-Host "Instalando $extension..." -ForegroundColor Green
    code --install-extension $extension
}

Write-Host "✅ Todas las extensiones han sido instaladas!" -ForegroundColor Cyan
```

**Linux/Mac (Bash):**

```bash
#!/bin/bash
# setup-vscode-extensions.sh

extensions=(
    "esbenp.prettier-vscode"
    "ms-vscode.vscode-typescript-next"
    "bradlc.vscode-tailwindcss"
    "ms-vscode.vscode-json"
    "christian-kohler.path-intellisense"
    "formulahendry.auto-rename-tag"
    "ms-vscode.vscode-eslint"
    "aaron-bond.better-comments"
    "ms-vscode-remote.remote-containers"
    "ms-azuretools.vscode-docker"
    "eamodio.gitlens"
    "cweijan.vscode-mysql-client2"
    "pkief.material-icon-theme"
    "zhuangtongfa.material-theme"
)

echo "🚀 Instalando extensiones de VS Code..."

for extension in "${extensions[@]}"; do
    echo "Instalando $extension..."
    code --install-extension $extension
done

echo "✅ Todas las extensiones han sido instaladas!"
```

## ⚙️ Configuraciones Incluidas

El proyecto ya incluye estas configuraciones:

### `.vscode/settings.json`

- Formateo automático al guardar
- Prettier como formateador por defecto
- Organización automática de imports
- Configuración de indentación (2 espacios)

### `.prettierrc`

- Configuración de formato de código
- Comillas simples, semi-colons, etc.

### `.eslintrc.json`

- Reglas de linting para TypeScript
- Validación de calidad de código

## 🔨 Scripts Útiles

```bash
# Desarrollo
npm run start:dev          # Iniciar en modo desarrollo
npm run build             # Compilar proyecto
npm run start:prod        # Iniciar en producción

# Formateo y Linting
npm run format            # Formatear todo el código
npm run lint              # Ejecutar linter
npm run lint:fix          # Corregir errores de linting automáticamente

# Base de datos
docker-compose up -d      # Iniciar BD en background
docker-compose down       # Detener BD
docker-compose logs       # Ver logs de la BD
```

## 🐳 Docker y Base de Datos

### Configuración incluida:

- `docker-compose.yml` - Configuración de MySQL
- Scripts de inicialización en `database/init.sql`
- Puerto MySQL: 3307 (para evitar conflictos)

### Comandos útiles:

```bash
# Verificar contenedores
docker ps

# Acceder a MySQL
docker exec -it mysql_PrincipalContainer mysql -u root -p

# Reiniciar base de datos
docker-compose restart
```

## 🔐 Configuración de Seguridad

### Variables de Entorno

1. Copiar `.env.example` a `.env.development`
2. Configurar valores según `ENV_SETUP.md`
3. **NUNCA** commitear archivos `.env.*`

### Archivos importantes:

- `.env.example` - Plantilla de configuración
- `ENV_SETUP.md` - Instrucciones detalladas
- `.gitignore` - Excluye archivos sensibles

## 🧪 Verificar Configuración

### 1. Formateo Automático

- Abrir cualquier archivo `.ts`
- Presionar `Ctrl+S` (debe formatear automáticamente)
- Usar `Shift+Alt+F` para formatear manualmente

### 2. Linting

- Los errores de linting deben aparecer subrayados
- `Ctrl+Shift+P` → "ESLint: Fix all auto-fixable problems"

### 3. IntelliSense

- Autocompletado debe funcionar en TypeScript
- Imports automáticos al escribir clases/funciones

### 4. Base de Datos

```bash
npm run start:dev
# Debe conectar sin errores
# Swagger disponible en: http://localhost:3000/api/docs
```

## ❓ Resolución de Problemas

### Puerto 3306 ocupado

- El proyecto usa puerto 3307 por defecto
- Cambiar en `docker-compose.yml` si es necesario

### Extensiones no funcionan

- Recargar VS Code: `Ctrl+Shift+P` → "Developer: Reload Window"
- Verificar que las extensiones estén habilitadas

### Formateo no automático

- Verificar que Prettier esté configurado como formateador por defecto
- `Ctrl+Shift+P` → "Format Document With..." → Seleccionar Prettier

### Errores de TypeScript

- Ejecutar: `npm install`
- Recargar VS Code
- Verificar versión de Node.js (debe ser v18+)

## 📞 Soporte

Si tienes problemas con la configuración:

1. Revisar este documento paso a paso
2. Verificar logs de error en la terminal
3. Consultar documentación de NestJS/TypeScript
4. Revisar issues del repositorio

---

**¡Configuración completa!** 🎉
Ya tienes todo listo para desarrollar en el microservicio.
