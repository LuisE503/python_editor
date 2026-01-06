# PyHub IDE 🐍✨

**El IDE de Python más avanzado para navegadores - React + Pyodide + Monaco Editor**

PyHub IDE es un entorno de desarrollo integrado profesional que se ejecuta completamente en el navegador, permitiendo escribir, ejecutar y visualizar código Python sin instalación. Con soporte para visualización de datos, machine learning, animaciones y mucho más.

## 🌟 Características Extraordinarias

### 🎨 **Editor Profesional**
✅ **Monaco Editor** - El mismo editor de VS Code  
✅ **Temas personalizables** - Dark, Light, High Contrast, Monokai  
✅ **Autocompletado inteligente** - Snippets y sugerencias  
✅ **Ajuste de fuente** - Personaliza tamaño, números de línea y más  
✅ **Auto-guardado** - Tu código se guarda automáticamente

### 📊 **Visualización de Datos**
✅ **Matplotlib integrado** - Gráficos profesionales en el navegador  
✅ **NumPy incluido** - Computación científica  
✅ **Múltiples tipos de gráficos** - Líneas, barras, dispersión, circular  
✅ **Arte generativo** - Fractales, espirales de Fibonacci y más

### 💻 **Terminal REPL Interactivo**
✅ **REPL en tiempo real** - Ejecuta comandos Python línea por línea  
✅ **Historial de comandos** - Navega con ↑/↓  
✅ **Autocompletado** - Sugerencias contextuales  
✅ **Comandos especiales** - clear, help, history

### 📚 **Galería de Ejemplos**
✅ **8 ejemplos profesionales** categorizados:
- 🌱 **Básicos**: Hola Mundo, Fibonacci, Tests
- 📊 **Data Science**: Visualización con matplotlib
- 🎨 **Visual**: Arte generativo y fractales
- 🧮 **Algoritmos**: Ordenamiento, búsqueda, Dijkstra, Hanoi
- 🤖 **Machine Learning**: Regresión, clustering, redes neuronales
- 🎮 **Juegos**: Game of Life, Sudoku, laberintos, Tic-Tac-Toe
- 🧪 **Testing**: Unittest y TDD

### 🔗 **Compartir y Colaborar**
✅ **Compartir por URL** - Código codificado en el enlace  
✅ **Descargar archivos** - Exporta a .py  
✅ **Estadísticas** - Líneas, caracteres, tamaño  
✅ **Redes sociales** - Comparte en Twitter y LinkedIn

### ⚙️ **Personalización Total**
✅ **Panel de configuración** - Ajusta todo a tu gusto  
✅ **Temas del editor** - 4 temas profesionales  
✅ **Tamaño de fuente** - 10px a 24px  
✅ **Word wrap** - Ajuste automático de líneas  
✅ **Minimapa** - Navegación visual del código  
✅ **Auto-save** - Guardado automático en localStorage

### 🧪 **Testing Integrado**
✅ **Unittest framework** - Tests unitarios completos  
✅ **Resultados visuales** - Interfaz clara de resultados  
✅ **Cobertura de tests** - Estadísticas detalladas

### 🔒 **Seguridad**
✅ **Validación de código** - Previene código malicioso  
✅ **Timeouts** - Protección contra loops infinitos  
✅ **Sandboxing** - Ejecución aislada  
✅ **Sanitización** - Limpieza de salidas

## 🛠️ Tecnologías

- **React 18.3** - Biblioteca UI moderna y eficiente
- **Vite 5.4** - Build tool ultrarrápido
- **Monaco Editor** - Editor de código profesional (VS Code)
- **Pyodide 0.26** - Python 3.11 en WebAssembly
- **Matplotlib** - Visualización de datos científicos
- **NumPy** - Computación numérica
- **Tailwind CSS** - Framework CSS utilitario

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 18+ y npm/yarn
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Git (opcional)

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/pyhub-ide.git
cd pyhub-ide

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

Abre tu navegador en `http://localhost:5173` - ¡El IDE estará listo! 🎉

### Build para Producción

```bash
# Compilar para producción
npm run build

# Vista previa del build
npm run preview
```

## 🎯 Uso

### Editor de Código
- Escribe tu código Python en el editor Monaco
- **Ctrl+Enter** o clic en "Ejecutar" para correr el código
- El output aparece en el panel derecho
- Soporte completo de sintaxis y autocompletado

### Terminal REPL
- Haz clic en "💻 Terminal" para abrir el REPL
- Escribe comandos Python interactivos
- Usa ↑/↓ para navegar el historial
- **Ctrl+L** para limpiar la terminal

### Galería de Ejemplos
- Haz clic en "📚 Ejemplos"
- Explora 8 categorías con ejemplos profesionales
- Busca por nombre o descripción
- Carga cualquier ejemplo con un clic

### Visualización de Datos
```python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.plot(x, y)
plt.title('Función Seno')
plt.show()
```

### Compartir Código
- Clic en "🔗 Compartir"
- Genera URL con código incluido
- Descarga como archivo .py
- Comparte en redes sociales

### Personalización
- Clic en "⚙️ Ajustes"
- Cambia tema, fuente, y más
- Auto-guardado opcional
- Configuración persistente
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
