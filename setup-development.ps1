# 🚀 Script de Setup Completo para Desarrollo (Windows)
# Este script configura todo el entorno de desarrollo automáticamente

Write-Host "🎯 Configurando entorno de desarrollo del microservicio..." -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Verificar prerrequisitos
Write-Host "🔍 Verificando prerrequisitos..." -ForegroundColor Yellow

# Verificar Node.js
try {
    $nodeVersion = node --version
    $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($versionNumber -lt 18) {
        Write-Host "❌ Node.js versión $nodeVersion detectada. Se requiere v18 o superior." -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Node.js $nodeVersion detectado" -ForegroundColor Green
}
catch {
    Write-Host "❌ Node.js no está instalado. Por favor instala Node.js v18+ desde https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Verificar npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm $npmVersion detectado" -ForegroundColor Green
}
catch {
    Write-Host "❌ npm no está instalado" -ForegroundColor Red
    exit 1
}

# Verificar Docker
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker detectado" -ForegroundColor Green
}
catch {
    Write-Host "❌ Docker no está instalado. Por favor instala Docker Desktop" -ForegroundColor Red
    Write-Host "   Descarga desde: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Verificar VS Code
try {
    code --version | Out-Null
    Write-Host "✅ VS Code detectado" -ForegroundColor Green
}
catch {
    Write-Host "❌ VS Code no está instalado o no está en PATH" -ForegroundColor Red
    Write-Host "   Por favor instala VS Code desde https://code.visualstudio.com/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🔧 Iniciando configuración..." -ForegroundColor Cyan

# 1. Instalar dependencias del proyecto
Write-Host "📦 Instalando dependencias del proyecto..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "✅ Dependencias instaladas correctamente" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
    exit 1
}

# 2. Configurar variables de entorno
Write-Host "🔐 Configurando variables de entorno..." -ForegroundColor Yellow
if (-not (Test-Path ".env.development")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env.development"
        Write-Host "✅ Archivo .env.development creado desde .env.example" -ForegroundColor Green
        Write-Host "⚠️  IMPORTANTE: Edita .env.development con tus configuraciones específicas" -ForegroundColor Yellow
    }
    else {
        Write-Host "❌ No se encontró .env.example" -ForegroundColor Red
    }
}
else {
    Write-Host "✅ .env.development ya existe" -ForegroundColor Green
}

# 3. Configurar Docker y base de datos
Write-Host "🐳 Configurando base de datos..." -ForegroundColor Yellow
try {
    docker-compose up -d
    Write-Host "✅ Base de datos MySQL iniciada correctamente" -ForegroundColor Green
    Write-Host "   Puerto: 3307" -ForegroundColor White
    Write-Host "   Usuario: root" -ForegroundColor White
    Write-Host "   Base de datos: gestion_sistema" -ForegroundColor White
}
catch {
    Write-Host "❌ Error al iniciar la base de datos" -ForegroundColor Red
    Write-Host "   Verifica que Docker Desktop esté ejecutándose" -ForegroundColor Yellow
}

# 4. Instalar extensiones de VS Code
Write-Host "🎨 Instalando extensiones de VS Code..." -ForegroundColor Yellow
try {
    .\setup-vscode-extensions.ps1
    Write-Host "✅ Extensiones de VS Code instaladas" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Algunas extensiones podrían no haberse instalado correctamente" -ForegroundColor Yellow
    Write-Host "   Ejecuta manualmente: .\setup-vscode-extensions.ps1" -ForegroundColor White
}

# 5. Verificar configuración
Write-Host "🧪 Verificando configuración..." -ForegroundColor Yellow

# Esperar un poco para que la BD esté lista
Write-Host "⏳ Esperando que la base de datos esté lista..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "🎉 ¡Configuración completada!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Resumen de la configuración:" -ForegroundColor Cyan
Write-Host "✅ Dependencias del proyecto instaladas" -ForegroundColor Green
Write-Host "✅ Variables de entorno configuradas (.env.development)" -ForegroundColor Green
Write-Host "✅ Base de datos MySQL ejecutándose (puerto 3307)" -ForegroundColor Green
Write-Host "✅ Extensiones de VS Code instaladas" -ForegroundColor Green
Write-Host "✅ Configuraciones de formateo aplicadas" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Edita el archivo .env.development con tus configuraciones" -ForegroundColor White
Write-Host "2. Reinicia VS Code para aplicar las extensiones" -ForegroundColor White
Write-Host "3. Ejecuta 'npm run start:dev' para iniciar el servidor" -ForegroundColor White
Write-Host "4. Visita http://localhost:3000/api/docs para ver Swagger" -ForegroundColor White
Write-Host ""
Write-Host "💡 Comandos útiles:" -ForegroundColor Cyan
Write-Host "   npm run start:dev    # Iniciar en modo desarrollo" -ForegroundColor White
Write-Host "   npm run db:logs      # Ver logs de la base de datos" -ForegroundColor White
Write-Host "   npm run format       # Formatear código" -ForegroundColor White
Write-Host "   docker-compose down  # Detener base de datos" -ForegroundColor White
Write-Host ""
Write-Host "📖 Para más información, consulta DEVELOPMENT_SETUP.md" -ForegroundColor Yellow

Read-Host "Presiona Enter para continuar..."
