# 🚀 Comandos Rápidos

## 📦 Setup Inicial

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

## 🔧 Desarrollo

```bash
# Iniciar aplicación
npm run start:dev           # Modo desarrollo con watch
npm run start:debug         # Modo debug
npm run start:prod          # Modo producción

# Formateo y linting
npm run format              # Formatear código
npm run format:check        # Verificar formato
npm run lint                # Ejecutar y corregir linting
npm run lint:check          # Solo verificar linting

# Build
npm run build               # Compilar TypeScript
```

## 🐳 Base de Datos

```bash
# Gestión de base de datos
npm run db:up               # Iniciar MySQL container
npm run db:down             # Detener MySQL container
npm run db:restart          # Reiniciar container
npm run db:logs             # Ver logs de MySQL

# Comandos Docker directos
docker-compose up -d        # Iniciar en background
docker-compose down         # Detener y remover
docker ps                   # Ver containers activos
```

## 🧪 Testing

```bash
# Tests
npm run test                # Ejecutar tests
npm run test:watch          # Tests en modo watch
npm run test:cov            # Tests con coverage
npm run test:e2e            # Tests end-to-end
```

## ⚡ Atajos de VS Code

```
Ctrl+S                      # Guardar y formatear automático
Shift+Alt+F                 # Formatear documento
Ctrl+K, Ctrl+F              # Formatear selección
Ctrl+Shift+P                # Command Palette
Ctrl+`                      # Abrir terminal
```

## 🌐 URLs Importantes

```
http://localhost:3000                   # API Principal
http://localhost:3000/api/docs          # Swagger Documentation
http://localhost:3307                   # MySQL Database
```

## 🔐 Credenciales por Defecto

```
MySQL:
- Host: localhost:3307
- Usuario: root
- Password: root123
- Base de datos: gestion_sistema

Admin por defecto:
- Usuario: admin
- Password: admin123
```

## 📁 Estructura del Proyecto

```
src/
├── application/           # Casos de uso y servicios
├── domain/               # Entidades y reglas de negocio
├── infrastructure/       # Implementaciones específicas
├── presentation/         # Controllers, DTOs, Guards
└── shared/              # Utilidades compartidas
```

## 🐛 Troubleshooting

```bash
# Puerto 3306 ocupado
# El proyecto usa 3307 por defecto

# Formateo no funciona
# Verificar que Prettier esté instalado:
code --install-extension esbenp.prettier-vscode

# Base de datos no conecta
docker-compose down && docker-compose up -d
npm run db:logs

# Dependencias desactualizadas
npm install
npm audit fix
```
