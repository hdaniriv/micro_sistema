#!/bin/bash

# Script para instalar extensiones de VS Code en Linux/Mac
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

echo "🚀 Instalando extensiones de VS Code para el proyecto..."
echo ""

for extension in "${extensions[@]}"; do
    echo "📦 Instalando $extension..."
    if code --install-extension $extension --force; then
        echo "   ✅ Instalado correctamente"
    else
        echo "   ❌ Error al instalar $extension"
    fi
    echo ""
done

echo "🎉 ¡Proceso de instalación completado!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Reinicia Visual Studio Code"
echo "2. Abre el proyecto en VS Code"
echo "3. Las configuraciones se aplicarán automáticamente"
echo ""
echo "💡 Tip: Usa Ctrl+Shift+P y escribe 'Extensions' para verificar las extensiones instaladas"

read -p "Presiona Enter para continuar..."
