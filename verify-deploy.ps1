# 🔍 Verificación Pre-Deploy - PyHub IDE

Write-Host "🚀 Verificando configuración para GitHub Pages..." -ForegroundColor Cyan
Write-Host ""

$errors = @()
$warnings = @()
$success = @()

# 1. Verificar index.html
Write-Host "📄 Verificando index.html..." -ForegroundColor Yellow
if (Test-Path "index.html") {
    $content = Get-Content "index.html" -Raw
    if ($content -match '<div id="root"></div>') {
        $success += "✅ index.html tiene div#root"
    } else {
        $errors += "❌ index.html NO tiene <div id='root'></div>"
    }

    if ($content -match 'src="/src/main.jsx"') {
        $success += "✅ index.html tiene script de Vite"
    } else {
        $errors += "❌ index.html NO tiene script de Vite"
    }

    if ($content -match 'font-awesome') {
        $success += "✅ Font Awesome integrado"
    } else {
        $warnings += "⚠️  Font Awesome no encontrado"
    }
} else {
    $errors += "❌ index.html NO existe"
}

# 2. Verificar vite.config.js
Write-Host "⚙️  Verificando vite.config.js..." -ForegroundColor Yellow
if (Test-Path "vite.config.js") {
    $content = Get-Content "vite.config.js" -Raw
    if ($content -match "base:\s*['\`"]\.\/['\`"]") {
        $success += "✅ vite.config.js tiene base: './'"
    } else {
        $errors += "❌ vite.config.js NO tiene base: './'"
    }
} else {
    $errors += "❌ vite.config.js NO existe"
}

# 3. Verificar .nojekyll
Write-Host "🚫 Verificando .nojekyll..." -ForegroundColor Yellow
if (Test-Path ".nojekyll") {
    $success += "✅ Archivo .nojekyll existe"
} else {
    $errors += "❌ Archivo .nojekyll NO existe"
}

# 4. Verificar 404.html
Write-Host "📄 Verificando 404.html..." -ForegroundColor Yellow
if (Test-Path "public/404.html") {
    $success += "✅ Archivo 404.html existe"
} else {
    $warnings += "⚠️  Archivo 404.html no encontrado en public/"
}

# 5. Verificar workflow
Write-Host "⚙️  Verificando GitHub Actions..." -ForegroundColor Yellow
if (Test-Path ".github/workflows/deploy.yml") {
    $success += "✅ Workflow de deploy existe"
} else {
    $errors += "❌ Workflow de deploy NO existe"
}

# 6. Verificar ejemplos
Write-Host "📚 Verificando ejemplos..." -ForegroundColor Yellow
$exampleFiles = @(
    "hello_world.py",
    "fibonacci.py",
    "tests_example.py",
    "data_visualization.py",
    "animations.py",
    "algorithms.py",
    "machine_learning.py",
    "games.py",
    "cryptography.py",
    "web_scraping.py",
    "web_automation.py",
    "data_structures_advanced.py"
)

$missingExamples = @()
foreach ($file in $exampleFiles) {
    if (!(Test-Path "public/examples/$file")) {
        $missingExamples += $file
    }
}

if ($missingExamples.Count -eq 0) {
    $success += "✅ Todos los 12 ejemplos existen"
} else {
    $errors += "❌ Faltan ejemplos: $($missingExamples -join ', ')"
}

# 7. Verificar src/App.jsx
Write-Host "⚛️  Verificando App.jsx..." -ForegroundColor Yellow
if (Test-Path "src/App.jsx") {
    $content = Get-Content "src/App.jsx" -Raw
    if ($content -match "\.\/examples\/") {
        $success += "✅ App.jsx usa rutas relativas para ejemplos"
    } else {
        $warnings += "⚠️  Verificar rutas de ejemplos en App.jsx"
    }
} else {
    $errors += "❌ src/App.jsx NO existe"
}

# 8. Verificar package.json
Write-Host "📦 Verificando package.json..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    $content = Get-Content "package.json" -Raw | ConvertFrom-Json
    if ($content.scripts.build) {
        $success += "✅ Script 'build' existe"
    } else {
        $errors += "❌ Script 'build' NO existe"
    }
} else {
    $errors += "❌ package.json NO existe"
}

# Mostrar resultados
Write-Host ""
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "               📊 RESULTADOS                        " -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($success.Count -gt 0) {
    Write-Host "✅ ÉXITOS ($($success.Count)):" -ForegroundColor Green
    foreach ($item in $success) {
        Write-Host "  $item" -ForegroundColor Green
    }
    Write-Host ""
}

if ($warnings.Count -gt 0) {
    Write-Host "⚠️  ADVERTENCIAS ($($warnings.Count)):" -ForegroundColor Yellow
    foreach ($item in $warnings) {
        Write-Host "  $item" -ForegroundColor Yellow
    }
    Write-Host ""
}

if ($errors.Count -gt 0) {
    Write-Host "❌ ERRORES ($($errors.Count)):" -ForegroundColor Red
    foreach ($item in $errors) {
        Write-Host "  $item" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "🔧 Por favor corrige los errores antes de desplegar" -ForegroundColor Red
    exit 1
} else {
    Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host "   🎉 ¡TODO LISTO PARA DESPLEGAR!                   " -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Próximos pasos:" -ForegroundColor Cyan
    Write-Host "1. git add ." -ForegroundColor White
    Write-Host "2. git commit -m 'Deploy to GitHub Pages'" -ForegroundColor White
    Write-Host "3. git push origin main" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 Tu sitio estará en: https://TU-USUARIO.github.io/TU-REPO/" -ForegroundColor Cyan
    Write-Host ""
}
