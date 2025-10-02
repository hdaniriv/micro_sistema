# Microservicio Principal - Sistema de Gestión

Este es el microservicio principal del sistema de gestión empresarial, desarrollado con NestJS siguiendo arquitectura DDD (Domain-Driven Design). Se encarga de la gestión de usuarios, autenticación, autorización y coordinación con otros microservicios.

## 🚀 Características

- **Arquitectura DDD**: Separación clara entre dominio, aplicación, infraestructura y presentación
- **Autenticación JWT**: Tokens de acceso y refresh tokens
- **Autorización basada en roles**: Administrador, Supervisor, Técnico, Cliente
- **Base de datos MySQL**: Con Docker y TypeORM
- **Documentación Swagger**: API completamente documentada
- **Encriptación segura**: bcrypt para contraseñas
- **Manejo de errores robusto**: Filtros globales de excepciones
- **Transacciones**: Soporte para operaciones atómicas
- **Endpoint público**: Registro de clientes sin autenticación

## 📋 Prerequisitos

- Node.js (v18 o superior)
- Docker y Docker Compose
- Git

## ⚙️ Instalación

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar la base de datos MySQL
```bash
docker-compose up -d
```

### 3. Iniciar la aplicación
```bash
npm run start:dev
```

## 📚 Documentación API

http://localhost:3000/api/docs

## 🔐 Autenticación

Usuario administrador por defecto:
- Username: `admin`
- Password: `admin123`

## 🎯 Endpoints Principales

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/public/register/cliente` - Registro público de clientes
- `GET /api/usuarios` - Gestión de usuarios (requiere auth)
- `GET /api/roles` - Gestión de roles (requiere auth)
