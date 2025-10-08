# Instalar extensiones esenciales de VS Code
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

Write-Host "🚀 Instalando extensiones de VS Code para el proyecto..." -ForegroundColor Cyan
Write-Host ""

foreach ($extension in $extensions) {
    Write-Host "📦 Instalando $extension..." -ForegroundColor Green
    try {
        code --install-extension $extension --force
        Write-Host "   ✅ Instalado correctamente" -ForegroundColor DarkGreen
    }
    catch {
        Write-Host "   ❌ Error al instalar $extension" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "🎉 ¡Proceso de instalación completado!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Reinicia Visual Studio Code" -ForegroundColor White
Write-Host "2. Abre el proyecto en VS Code" -ForegroundColor White
Write-Host "3. Las configuraciones se aplicarán automáticamente" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tip: Usa Ctrl+Shift+P y escribe 'Extensions' para verificar las extensiones instaladas" -ForegroundColor DarkCyan

# Pausa para que el usuario vea el resultado
Read-Host "Presiona Enter para continuar..."
