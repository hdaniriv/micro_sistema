# INSTRUCCIONES PARA CONFIGURAR EL ENTORNO DE DESARROLLO

## 1. Copiar archivo de ejemplo
Copia este archivo como `.env.development`:
```bash
cp .env.example .env.development
```

## 2. Configurar variables de desarrollo
Edita `.env.development` y configura:

### Base de Datos (Desarrollo)
- DB_HOST=localhost
- DB_PORT=3307 (puerto del contenedor Docker)
- DB_USERNAME=root
- DB_PASSWORD=G3sti0n..$45 (contraseña del contenedor MySQL)
- DB_DATABASE=gestion_sistema

### JWT Secrets (Generar claves seguras)
Genera claves secretas seguras para JWT:
- JWT_SECRET=tu_clave_secreta_jwt_minimo_32_caracteres
- JWT_REFRESH_SECRET=tu_clave_secreta_refresh_jwt_minimo_32_caracteres

### Ejemplo de generación de claves seguras:
```bash
# Generar clave JWT (Linux/Mac)
openssl rand -base64 32

# Generar clave JWT (Windows PowerShell)
[System.Web.Security.Membership]::GeneratePassword(32, 0)

# O usar Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 3. Configurar para Producción
Para producción, crea `.env.production` con:
- Contraseñas de base de datos seguras
- JWT secrets únicos y complejos
- URLs de CORS específicas del dominio
- LOG_LEVEL=warn o error

## ⚠️ IMPORTANTE
- NEVER commitear archivos .env con credenciales reales
- Usar diferentes credenciales para cada entorno
- Rotar secrets periódicamente en producción