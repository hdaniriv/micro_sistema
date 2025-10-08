#!/bin/bash

# 🚀 Script de Setup Completo para Desarrollo
# Este script configura todo el entorno de desarrollo automáticamente

echo "🎯 Configurando entorno de desarrollo del microservicio..."
echo "=================================================="

# Verificar prerrequisitos
echo "🔍 Verificando prerrequisitos..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js v18+ desde https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js versión $NODE_VERSION detectada. Se requiere v18 o superior."
    exit 1
fi

echo "✅ Node.js $(node --version) detectado"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    exit 1
fi
echo "✅ npm $(npm --version) detectado"

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker Desktop"
    exit 1
fi
echo "✅ Docker $(docker --version | cut -d' ' -f3 | tr -d ',') detectado"

# Verificar VS Code
if ! command -v code &> /dev/null; then
    echo "❌ VS Code no está instalado o no está en PATH"
    echo "   Por favor instala VS Code desde https://code.visualstudio.com/"
    exit 1
fi
echo "✅ VS Code detectado"

echo ""
echo "🔧 Iniciando configuración..."

# 1. Instalar dependencias del proyecto
echo "📦 Instalando dependencias del proyecto..."
if npm install; then
    echo "✅ Dependencias instaladas correctamente"
else
    echo "❌ Error al instalar dependencias"
    exit 1
fi

# 2. Configurar variables de entorno
echo "🔐 Configurando variables de entorno..."
if [ ! -f ".env.development" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env.development
        echo "✅ Archivo .env.development creado desde .env.example"
        echo "⚠️  IMPORTANTE: Edita .env.development con tus configuraciones específicas"
    else
        echo "❌ No se encontró .env.example"
    fi
else
    echo "✅ .env.development ya existe"
fi

# 3. Configurar Docker y base de datos
echo "🐳 Configurando base de datos..."
if docker-compose up -d --quiet-pull; then
    echo "✅ Base de datos MySQL iniciada correctamente"
    echo "   Puerto: 3307"
    echo "   Usuario: root"
    echo "   Base de datos: gestion_sistema"
else
    echo "❌ Error al iniciar la base de datos"
    echo "   Verifica que Docker Desktop esté ejecutándose"
fi

# 4. Instalar extensiones de VS Code
echo "🎨 Instalando extensiones de VS Code..."
chmod +x setup-vscode-extensions.sh
if ./setup-vscode-extensions.sh; then
    echo "✅ Extensiones de VS Code instaladas"
else
    echo "⚠️  Algunas extensiones podrían no haberse instalado correctamente"
fi

# 5. Verificar configuración
echo "🧪 Verificando configuración..."

# Esperar un poco para que la BD esté lista
echo "⏳ Esperando que la base de datos esté lista..."
sleep 10

# Verificar conexión a la base de datos
echo "🔍 Verificando conexión a la base de datos..."
if timeout 30s npm run start:dev &> /dev/null; then
    echo "✅ Conexión a la base de datos exitosa"
else
    echo "⚠️  No se pudo verificar la conexión automáticamente"
    echo "   Ejecuta 'npm run start:dev' manualmente para verificar"
fi

echo ""
echo "🎉 ¡Configuración completada!"
echo "=================================================="
echo ""
echo "📋 Resumen de la configuración:"
echo "✅ Dependencias del proyecto instaladas"
echo "✅ Variables de entorno configuradas (.env.development)"
echo "✅ Base de datos MySQL ejecutándose (puerto 3307)"
echo "✅ Extensiones de VS Code instaladas"
echo "✅ Configuraciones de formateo aplicadas"
echo ""
echo "🚀 Próximos pasos:"
echo "1. Edita el archivo .env.development con tus configuraciones"
echo "2. Reinicia VS Code para aplicar las extensiones"
echo "3. Ejecuta 'npm run start:dev' para iniciar el servidor"
echo "4. Visita http://localhost:3000/api/docs para ver Swagger"
echo ""
echo "💡 Comandos útiles:"
echo "   npm run start:dev    # Iniciar en modo desarrollo"
echo "   npm run db:logs      # Ver logs de la base de datos"
echo "   npm run format       # Formatear código"
echo "   docker-compose down  # Detener base de datos"
echo ""
echo "📖 Para más información, consulta DEVELOPMENT_SETUP.md"
