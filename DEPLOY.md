# 🚀 Guía de Despliegue en GitHub Pages

## ✅ Pre-requisitos

Tu proyecto está configurado correctamente para GitHub Pages con:

- ✅ `base: './'` en `vite.config.js`
- ✅ Workflow de GitHub Actions en `.github/workflows/deploy.yml`
- ✅ Archivo `.nojekyll` para evitar procesamiento de Jekyll
- ✅ `404.html` para manejo de rutas SPA

## 📦 Método 1: Deploy Automático (Recomendado)

### Configuración Inicial

1. **Habilita GitHub Pages en tu repositorio:**

   - Ve a Settings > Pages
   - Source: GitHub Actions
   - Guarda los cambios

2. **Push al repositorio:**

   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **El workflow se ejecutará automáticamente** y desplegará tu sitio

4. **Verifica el despliegue:**
   - Ve a Actions para ver el progreso
   - Tu sitio estará disponible en: `https://TU-USUARIO.github.io/TU-REPO/`

## 🔧 Método 2: Deploy Manual

```bash
# Instalar dependencias
npm install

# Construir el proyecto
npm run build

# Desplegar a GitHub Pages
npm run deploy
```

## 🌐 Rutas y Configuración

### Importante para GitHub Pages

Si tu repositorio se llama `python` y tu usuario es `usuario`, tu URL será:

```
https://usuario.github.io/python/
```

### Si usas dominio personalizado

1. Actualiza `vite.config.js`:

   ```javascript
   base: "/"; // Cambia './' por '/'
   ```

2. Agrega archivo `CNAME` en la carpeta `public`:
   ```
   tudominio.com
   ```

## 🐛 Solución de Problemas

### Error 404 al cargar recursos

**Causa:** Las rutas no son relativas
**Solución:** Verifica que `base: './'` en `vite.config.js`

### La página se ve en blanco

**Causa:** JavaScript no se carga
**Solución:**

1. Verifica que `.nojekyll` exista
2. Espera 5-10 minutos para propagación
3. Limpia caché del navegador (Ctrl+Shift+R)

### Los ejemplos Python no cargan

**Causa:** Rutas incorrectas a archivos en `/public/examples/`
**Solución:** Los ejemplos usan rutas relativas `./examples/` que funcionan en GitHub Pages

### El workflow falla

**Causa:** Permisos insuficientes
**Solución:**

1. Ve a Settings > Actions > General
2. En "Workflow permissions", selecciona "Read and write permissions"
3. Habilita "Allow GitHub Actions to create and approve pull requests"

## 📝 Checklist Final

Antes de desplegar, verifica:

- [ ] `index.html` tiene `<div id="root"></div>`
- [ ] `vite.config.js` tiene `base: './'`
- [ ] Archivo `.nojekyll` existe en la raíz
- [ ] Archivo `404.html` existe en `public/`
- [ ] GitHub Pages está habilitado (Source: GitHub Actions)
- [ ] Permisos de workflow configurados
- [ ] Push a rama `main`

## ✨ Características del Proyecto

Este proyecto incluye:

- ✅ React 18.3 con Vite 5.4
- ✅ Python 3.11 vía Pyodide
- ✅ Monaco Editor integrado
- ✅ 12 ejemplos profesionales
- ✅ Font Awesome para iconos
- ✅ Tailwind CSS via CDN
- ✅ Deploy automático con GitHub Actions

## 🔗 Enlaces Útiles

- [Documentación GitHub Pages](https://docs.github.com/en/pages)
- [Vite - Deploying a Static Site](https://vitejs.dev/guide/static-deploy.html)
- [Pyodide Documentation](https://pyodide.org/)

---

**¿Problemas?** Verifica:

1. Actions > Último workflow (debe ser ✅ verde)
2. Settings > Pages > Tu URL debe estar visible
3. Consola del navegador (F12) para errores JavaScript
