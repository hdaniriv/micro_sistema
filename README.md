# Microservicio Principal - Sistema de Gestión

Este es el microservicio principal del sistema de gestión empresarial, desarrollado con NestJS siguiendo arquitectura DDD (Domain-Driven Design). Se encarga de la gestión de usuarios, autenticación, autorización y coordinación con otros microservicios.

## Características

- **Arquitectura DDD**: Separación clara entre dominio, aplicación, infraestructura y presentación
- **Autenticación JWT**: Tokens de acceso y refresh tokens
- **Autorización basada en roles**: Administrador, Supervisor, Tecnico, Cliente
- **Base de datos MySQL**: Con Docker y TypeORM
- **Documentación Swagger**: API completamente documentada
- **Encriptación segura**: bcrypt para contraseñas
- **Manejo de errores robusto**: Filtros globales de excepciones
- **Transacciones**: Soporte para operaciones atómicas
- **Endpoint público**: Registro de clientes sin autenticación

## Prerequisitos

- Node.js (v18 o superior)
- Docker y Docker Compose
- Git

## Instalación

### Setup Automático (Recomendado)

Para configurar todo el entorno de desarrollo automáticamente:

**Windows:**

```powershell
.\setup-development.ps1
```

**Linux/Mac:**

```bash
chmod +x setup-development.sh
./setup-development.sh
```

Este script instalará dependencias, configurará VS Code, iniciará la base de datos y verificará que todo funcione correctamente.

### Setup Manual

Si prefieres configurar manualmente:

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env.development

# Editar el archivo con tus configuraciones
# Ver ENV_SETUP.md para instrucciones detalladas
```

**IMPORTANTE:** Los archivos `.env.development` y `.env.production` no están en el repositorio por seguridad. Debes crear tus propios archivos usando `.env.example` como plantilla.

### 3. Configurar VS Code

```bash
# Windows
.\setup-vscode-extensions.ps1

# Linux/Mac
chmod +x setup-vscode-extensions.sh
./setup-vscode-extensions.sh
```

### 4. Iniciar la base de datos MySQL

```bash
docker-compose up -d
```

### 3. Iniciar la aplicación

```bash
npm run start:dev
```

## Documentación

- **API Documentation**: Disponible en `http://localhost:3000/api/docs` (Swagger)
- **Arquitectura DDD**: El proyecto sigue principios de Domain-Driven Design
- **Autenticación JWT**: Sistema de tokens para autenticación y autorización

## Notas de integración con Gestiones

El gateway expone endpoints REST bajo `/api/gestion/gestiones` que proxyean al microservicio de Gestión.

- Respuestas de gestiones incluyen, además de los campos tradicionales, el campo `codigo` (string, 6 caracteres, formato YYNNNN) y `tecnicoNombre` (cuando aplica, como campo enriquecido para visualización).
- Reglas por rol:
  - Tecnico: sólo ve sus gestiones; puede establecer fechaInicio/fechaFin; no reasigna técnicos.
  - Cliente: sólo sus gestiones.
  - Supervisor/Admin: visibilidad ampliada según reglas.

## Archivos de Configuración

- **`DEVELOPMENT_SETUP.md`**: Guía completa para configurar el entorno de desarrollo
- **`ENV_SETUP.md`**: Instrucciones para configurar variables de entorno
- **`setup-development.ps1/sh`**: Scripts para configuración automática completa
- **`setup-vscode-extensions.ps1/sh`**: Scripts para instalar extensiones de VS Code
- **`.vscode/settings.json`**: Configuraciones de VS Code para el proyecto
- **`.prettierrc`**: Configuración de formateo de código
- **`.eslintrc.json`**: Reglas de linting para TypeScript
