# 🚀 Guía de Deployment en GitHub Pages

## 📋 Requisitos Previos

- ✅ Cuenta de GitHub
- ✅ Repositorio creado en GitHub
- ✅ Node.js 18+ instalado localmente (solo para desarrollo)

---

## 🎯 Método 1: Deployment Automático con GitHub Actions (Recomendado)

### Paso 1: Preparar el Repositorio

1. **Crear repositorio en GitHub** (si no existe):

   ```bash
   # Desde la carpeta del proyecto
   git init
   git add .
   git commit -m "🎉 Initial commit: PyHub IDE"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/pyhub-ide.git
   git push -u origin main
   ```

2. **Verificar que existe el archivo `.github/workflows/deploy.yml`** ✅
   - Este archivo ya está incluido en el proyecto

### Paso 2: Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**
4. En **Source**, selecciona: **GitHub Actions**
5. ¡Listo! El deployment es automático

### Paso 3: Push y Deploy

```bash
git add .
git commit -m "✨ Update: New features"
git push
```

**¡El sitio se desplegará automáticamente!**

La URL será: `https://TU-USUARIO.github.io/pyhub-ide/`

---

## 🛠️ Método 2: Deployment Manual con gh-pages

### Paso 1: Instalar dependencias

```bash
npm install
```

### Paso 2: Build del proyecto

```bash
npm run build
```

Esto generará la carpeta `dist/` con los archivos estáticos.

### Paso 3: Deploy a GitHub Pages

```bash
npm run deploy
```

Este comando:

1. Hace build del proyecto
2. Publica la carpeta `dist/` en la rama `gh-pages`
3. GitHub Pages automáticamente sirve el sitio

### Paso 4: Configurar GitHub Pages (primera vez)

1. Ve a **Settings** → **Pages**
2. En **Source**, selecciona: **Deploy from a branch**
3. En **Branch**, selecciona: `gh-pages` y carpeta `/ (root)`
4. Click en **Save**

**URL del sitio:** `https://TU-USUARIO.github.io/pyhub-ide/`

---

## ⚙️ Configuración de Base Path

### Si el repositorio se llama diferente

Edita `vite.config.js`:

```javascript
export default defineConfig({
  base: "/nombre-de-tu-repo/", // Cambia esto
  // ... resto de la configuración
});
```

### Para dominio custom

Si tienes dominio propio:

1. Crea archivo `public/CNAME` con tu dominio:

   ```
   tudominio.com
   ```

2. En GitHub Settings → Pages → Custom domain, agrega tu dominio

3. Configura DNS:
   - Tipo A: apunta a las IPs de GitHub Pages
   - O tipo CNAME: apunta a `TU-USUARIO.github.io`

---

## 🔧 Troubleshooting

### Error: "Page not found"

**Solución**: Verifica que `base` en `vite.config.js` coincida con el nombre del repositorio:

```javascript
base: './', // Para repo principal
// o
base: '/nombre-repo/', // Para repo con nombre específico
```

### Error: "404 on refresh"

**Solución**: Crea archivo `public/404.html` que redirija a `index.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <script>
      sessionStorage.redirect = location.href;
    </script>
    <meta http-equiv="refresh" content="0;URL='/'" />
  </head>
</html>
```

### Error: "CORS o Pyodide no carga"

**Causa**: GitHub Pages no soporta algunos headers HTTP necesarios.

**Solución**: Los headers CORS ya están configurados correctamente en el código. Pyodide se carga desde CDN externo (jsdelivr.net).

### Sitio no se actualiza

1. Limpia caché del navegador (Ctrl+Shift+R)
2. Espera 1-2 minutos (GitHub Pages puede tardar)
3. Verifica en Actions que el workflow terminó correctamente

---

## 📦 Estructura del Proyecto para GitHub Pages

```
pyhub-ide/
├── .github/
│   └── workflows/
│       └── deploy.yml          # ✅ GitHub Actions workflow
├── .nojekyll                   # ✅ Previene Jekyll processing
├── public/
│   ├── examples/               # ✅ Ejemplos Python
│   ├── site.webmanifest        # ✅ PWA manifest
│   └── CNAME                   # ⚙️ Opcional: dominio custom
├── src/
│   ├── components/             # ✅ Componentes React
│   ├── services/               # ✅ Lógica de negocio
│   └── App.jsx                 # ✅ App principal
├── dist/                       # 📦 Generado por build
├── index.html                  # ✅ HTML principal
├── package.json                # ✅ Dependencias
└── vite.config.js              # ✅ Configuración Vite
```

---

## 🎨 Personalización del Deployment

### Cambiar rama de deployment

En `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches:
      - main # Cambia a: develop, master, etc.
```

### Deploy solo en tags

```yaml
on:
  push:
    tags:
      - "v*" # Deploy solo en tags como v1.0.0
```

### Deploy con preview en PRs

Agrega un job adicional:

```yaml
preview:
  if: github.event_name == 'pull_request'
  runs-on: ubuntu-latest
  steps:
    # ... build steps
    - name: Deploy Preview
      uses: rossjrw/pr-preview-action@v1
```

---

## ✅ Checklist Pre-Deployment

Antes de hacer deploy, verifica:

- [ ] `npm run build` funciona sin errores
- [ ] `base` en `vite.config.js` está correctamente configurado
- [ ] Archivo `.nojekyll` existe en la raíz
- [ ] Meta tags en `index.html` tienen URLs correctas
- [ ] Todos los recursos usan rutas relativas o CDN
- [ ] PWA manifest tiene URLs correctas
- [ ] README.md tiene la URL correcta del sitio

---

## 🚀 Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build

# Preview del build localmente
npm run preview

# Deploy manual a gh-pages
npm run deploy

# Verificar errores antes de deploy
npm run build && npm run preview
```

---

## 🌐 URLs Importantes

### Después del deploy:

- **Sitio web**: `https://TU-USUARIO.github.io/pyhub-ide/`
- **Repositorio**: `https://github.com/TU-USUARIO/pyhub-ide`
- **Actions**: `https://github.com/TU-USUARIO/pyhub-ide/actions`
- **Settings**: `https://github.com/TU-USUARIO/pyhub-ide/settings/pages`

---

## 🎯 Ventajas de GitHub Pages para este Proyecto

✅ **Hosting gratuito ilimitado**
✅ **HTTPS automático**
✅ **CDN global de GitHub**
✅ **Sin configuración de servidor**
✅ **Deployment automático**
✅ **100% estático** (perfecto para React + Pyodide)
✅ **Sin costos de infraestructura**
✅ **Fácil integración con CI/CD**

---

## 📊 Monitoring y Analytics

### Google Analytics (Opcional)

Agrega a `index.html`:

```html
<!-- Google Analytics -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-XXXXXXXXXX");
</script>
```

### GitHub Stats

GitHub Pages automáticamente trackea:

- Visitas totales
- Visitantes únicos
- Referrers
- Popular paths

Ve a: **Insights** → **Traffic** en tu repositorio

---

## 🔒 Seguridad en GitHub Pages

### Mejores Prácticas

✅ **No incluyas secretos** en el código
✅ **Usa variables de entorno** para APIs (si aplica)
✅ **Habilita HTTPS** (automático en GitHub Pages)
✅ **Configura CSP headers** (en meta tags)
✅ **Mantén dependencias actualizadas**

### Content Security Policy

Ya incluido en `index.html`:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self';
               script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdn.tailwindcss.com;
               style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;"
/>
```

---

## 🎉 ¡Listo!

Tu PyHub IDE ahora está desplegado en GitHub Pages y accesible desde cualquier lugar del mundo.

**Próximos pasos:**

1. Comparte la URL con otros
2. Agrega el link a tu README
3. Considera agregar un dominio custom
4. Monitorea el uso en GitHub Insights

---

**¿Preguntas o problemas?** Abre un issue en el repositorio.

**¡Happy coding!** 🐍✨
