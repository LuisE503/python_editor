# PyHub IDE 🐍

**Web-IDE profesional para ejecutar Python en el navegador - JavaScript Puro + Tailwind CSS**

PyHub IDE es un entorno de desarrollo integrado que se ejecuta completamente en el navegador, permitiendo escribir, ejecutar y testear código Python sin instalación. Utiliza **JavaScript vanilla**, **Tailwind CSS**, **Pyodide** y **Monaco Editor** para una experiencia premium y ultra-rápida.

## ✨ Características Premium

✅ **JavaScript Vanilla** ultrarrápido y liviano  
✅ **Tailwind CSS** para UI profesional y responsive  
✅ **Monaco Editor** con tema personalizado y autocompletado  
✅ **Pyodide** con carga lazy y manejo de errores  
✅ **Test Runner** avanzado (funciones simples + unittest)  
✅ **Seguridad**: validación, timeouts, sanitización  
✅ **Live Server** compatible - sin build steps  
✅ **3 ejemplos** interactivos listos para usar  
✅ **UI premium** con efectos glassmorphism y gradientes  
✅ **Responsive** perfecto para móvil y desktop

## 🛠️ Tecnologías

- **JavaScript Vanilla** - Sin frameworks, máximo rendimiento
- **Tailwind CSS** - Framework CSS utilitario
- **Pyodide** - Python en WebAssembly
- **Monaco Editor** - Editor de código (VS Code)
- **Live Server** - Desarrollo local sin build

## 📦 Instalación y Desarrollo

### Requisitos Previos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Extensión Live Server para VS Code (recomendado)
- Git (opcional)

### Instalación Súper Simple

1. **Descargar archivos**
   ```bash
   git clone https://github.com/tu-usuario/pyhub-ide.git
   cd pyhub-ide
   ```

2. **Abrir con Live Server**
   - Abre `index.html` en VS Code
   - Click derecho → "Open with Live Server"
   - ¡Listo! El IDE se abrirá automáticamente

### Alternativa Sin VS Code

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js
npx serve .

# Luego abre: http://localhost:8000
```

**✨ Sin instalaciones complejas, sin build steps, sin configuraciones.**

## 🚀 Desplegar en GitHub Pages

### Súper Fácil - Sin Build

1. **Subir a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tu-usuario/pyhub-ide.git
   git push -u origin main
   ```

2. **Configurar GitHub Pages**
   - Ve a Settings → Pages en tu repositorio
   - Source: Deploy from a branch
   - Branch: `main` / `root`
   - Guarda los cambios

3. **¡Listo!** Tu IDE estará en:
   `https://tu-usuario.github.io/pyhub-ide/`

### Actualizaciones

Solo haz push a main:
```bash
git add .
git commit -m "Update"
git push
```

**Sin npm, sin build, sin complicaciones.**

## 📚 Uso

### Escribir y Ejecutar Código

1. Escribe tu código Python en el editor
2. Haz clic en **"▶️ Ejecutar"** o presiona `Ctrl+Enter`
3. La salida aparecerá en el panel derecho

### Ejecutar Tests

1. Define funciones que empiecen con `test_`:
   ```python
   def test_suma():
       assert 2 + 2 == 4
       print("✓ Test pasado")
   ```

2. Haz clic en **"🧪 Tests"**
3. Los resultados aparecerán con estadísticas detalladas

### Cargar Ejemplos

Usa el menú desplegable **"📚 Ejemplos..."** para cargar código de ejemplo:
- Hola Mundo - Introducción básica
- Fibonacci - Algoritmos y recursión
- Tests Unitarios - Ejemplo de testing

### Reiniciar Entorno

Haz clic en **"🔄 Reiniciar"** para limpiar todas las variables y resetear el intérprete de Python.

## 🏗️ Estructura del Proyecto

```
pyhub-ide/
├── index.html             # Aplicación principal
├── js/                    # JavaScript modules
│   ├── app.js                 # Aplicación principal
│   ├── pyodide-service.js     # Servicio de Pyodide
│   └── test-runner.js         # Ejecutor de tests
├── examples/              # Ejemplos de Python
│   ├── hello_world.py         # Introducción básica
│   ├── fibonacci.py           # Algoritmos avanzados
│   └── tests_example.py       # Tests unitarios
└── README.md             # Documentación
```

**🎯 Estructura minimalista y eficiente**

## 🔒 Seguridad

PyHub IDE implementa múltiples capas de seguridad:

- **Sandboxing de Pyodide**: El código se ejecuta en un entorno aislado de WebAssembly
- **Timeouts**: Límite de 30 segundos por ejecución
- **Validación de código**: Detecta patrones potencialmente peligrosos
- **Limitación de salida**: La salida se trunca después de 10,000 caracteres
- **Sin acceso al sistema**: No puede acceder a archivos locales o hacer peticiones no autorizadas

## ⚡ Optimizaciones de Rendimiento

- **Lazy loading de Pyodide**: Solo se carga cuando se inicia la app
- **Code splitting**: Chunks separados para React y Monaco Editor
- **Carga desde CDN**: Pyodide se carga desde CDN de jsDelivr
- **Build optimizado**: Minificación y tree-shaking con Vite

## 🧪 Tests

### Crear Tests

Los tests deben seguir estas convenciones:

```python
# Función a testear
def suma(a, b):
    return a + b

# Test
def test_suma():
    assert suma(2, 3) == 5
    assert suma(-1, 1) == 0
    print("✓ test_suma pasado")
```

### Ejecutar Tests

Haz clic en el botón **"🧪 Tests"**. El runner:
1. Descubre todas las funciones que empiecen con `test_`
2. Ejecuta cada test
3. Captura aserciones fallidas y excepciones
4. Muestra resultados con estadísticas

## 🤝 Contribuir

Las contribuciones son bienvenidas:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Roadmap

- [ ] Soporte para múltiples archivos/pestañas
- [ ] Instalación de paquetes PyPI
- [ ] Compartir código vía URL
- [ ] Temas personalizables
- [ ] Autocompletado con IA
- [ ] Guardado en localStorage
- [ ] Export de código
- [ ] Colaboración en tiempo real

## 🐛 Problemas Conocidos

- **Paquetes limitados**: Solo paquetes disponibles en Pyodide
- **Performance**: Código intensivo en CPU puede ser lento
- **Tamaño**: Primera carga descarga ~30MB de Pyodide

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [Pyodide](https://pyodide.org/) - Python en WebAssembly
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Editor de VS Code
- [Vite](https://vitejs.dev/) - Build tool ultrarrápido
- [React](https://react.dev/) - Framework de UI

## 📧 Contacto

¿Preguntas o sugerencias? Abre un issue en GitHub.

---

**¡Disfruta programando Python en tu navegador! 🐍✨**
