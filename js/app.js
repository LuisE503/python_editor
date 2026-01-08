/**
 * Aplicación principal de PyHub IDE
 * JavaScript vanilla con funcionalidades completas
 */

class PyHubIDE {
  constructor() {
    this.editor = null;
    this.isRunning = false;
    this.currentCode = this.getDefaultCode();
    this.testRunner = null;

    // Elementos del DOM
    this.elements = {};

    // Estado
    this.state = {
      pyodideReady: false,
      hasUnsavedChanges: false,
    };

    // Inicializar aplicación
    this.init();
  }

  /**
   * Inicialización principal
   */
  async init() {
    this.bindElements();
    this.setupEventListeners();
    this.testRunner = new TestRunner(window.pyodideService);

    // Inicializar Monaco Editor
    await this.initializeEditor();

    // Inicializar Pyodide
    await this.initializePyodide();
  }

  /**
   * Enlazar elementos del DOM
   */
  bindElements() {
    this.elements = {
      loadingOverlay: document.getElementById("loadingOverlay"),
      loadingText: document.getElementById("loadingText"),
      loadingProgress: document.getElementById("loadingProgress"),
      statusDot: document.getElementById("statusDot"),
      statusText: document.getElementById("statusText"),
      runBtn: document.getElementById("runBtn"),
      testBtn: document.getElementById("testBtn"),
      resetBtn: document.getElementById("resetBtn"),
      clearBtn: document.getElementById("clearBtn"),
      exampleSelect: document.getElementById("exampleSelect"),
      editorContainer: document.getElementById("editorContainer"),
      outputContent: document.getElementById("outputContent"),
      outputStatus: document.getElementById("outputStatus"),
    };
  }

  /**
   * Configurar event listeners
   */
  setupEventListeners() {
    // Botones de la barra de herramientas
    this.elements.runBtn.addEventListener("click", () => this.runCode());
    this.elements.testBtn.addEventListener("click", () => this.runTests());
    this.elements.resetBtn.addEventListener("click", () =>
      this.resetEnvironment()
    );
    this.elements.clearBtn.addEventListener("click", () => this.clearOutput());

    // Selector de ejemplos
    this.elements.exampleSelect.addEventListener("change", (e) => {
      if (e.target.value) {
        this.loadExample(e.target.value);
        e.target.value = ""; // Reset selector
      }
    });

    // Atajo de teclado global para ejecutar
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        if (this.state.pyodideReady && !this.isRunning) {
          this.runCode();
        }
      }
    });

    // Prevenir salida accidental con cambios sin guardar
    window.addEventListener("beforeunload", (e) => {
      if (this.state.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          "¿Estás seguro de que quieres salir? Hay cambios sin guardar.";
      }
    });
  }

  /**
   * Inicializar Monaco Editor
   */
  async initializeEditor() {
    return new Promise((resolve) => {
      require.config({
        paths: {
          vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs",
        },
      });

      require(["vs/editor/editor.main"], () => {
        // Configurar tema
        monaco.editor.defineTheme("pyhub-dark", {
          base: "vs-dark",
          inherit: true,
          rules: [
            { token: "comment", foreground: "6A9955" },
            { token: "keyword", foreground: "569CD6" },
            { token: "string", foreground: "CE9178" },
            { token: "number", foreground: "B5CEA8" },
          ],
          colors: {
            "editor.background": "#0f172a",
            "editor.lineHighlightBackground": "#1e293b",
            "editorLineNumber.foreground": "#475569",
            "editor.selectionBackground": "#334155",
          },
        });

        // Crear editor
        this.editor = monaco.editor.create(this.elements.editorContainer, {
          value: this.currentCode,
          language: "python",
          theme: "pyhub-dark",
          fontSize: 14,
          lineNumbers: "on",
          minimap: { enabled: true },
          automaticLayout: true,
          wordWrap: "on",
          tabSize: 4,
          insertSpaces: true,
          scrollBeyondLastLine: false,
          renderWhitespace: "selection",
          suggestOnTriggerCharacters: true,
          quickSuggestions: {
            other: true,
            comments: false,
            strings: false,
          },
        });

        // Event listeners del editor
        this.editor.onDidChangeModelContent(() => {
          this.currentCode = this.editor.getValue();
          this.state.hasUnsavedChanges = true;
        });

        // Añadir comandos personalizados
        this.editor.addCommand(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
          () => {
            if (this.state.pyodideReady && !this.isRunning) {
              this.runCode();
            }
          }
        );

        resolve();
      });
    });
  }

  /**
   * Inicializar Pyodide
   */
  async initializePyodide() {
    try {
      await window.pyodideService.initialize(
        (message, progress) => {
          this.updateLoadingProgress(message, progress);
        },
        (error) => {
          this.showError(`Error al inicializar Pyodide: ${error}`);
        }
      );

      this.state.pyodideReady = true;
      this.updateStatus("Python listo", "green");
      this.enableButtons(true);
      this.hideLoading();

      // Mostrar mensaje de bienvenida
      this.showOutput(
        "✅ ¡PyHub IDE listo!\n🐍 Python 3.11 ejecutándose en tu navegador\n\nComienza escribiendo código y presiona Ctrl+Enter para ejecutar.",
        "info"
      );
    } catch (error) {
      this.showError(`Error crítico: ${error.message}`);
      this.hideLoading();
    }
  }

  /**
   * Ejecutar código Python
   */
  async runCode() {
    if (!this.state.pyodideReady || this.isRunning) return;

    this.setRunning(true);
    this.showOutput("🔄 Ejecutando código...", "info");

    try {
      // Validar código
      const validation = window.pyodideService.validateCode(this.currentCode);

      if (!validation.valid) {
        this.showOutput(
          `❌ Errores de validación:\n${validation.errors.join("\\n")}`,
          "error"
        );
        return;
      }

      if (validation.warnings.length > 0) {
        this.showOutput(
          `⚠️ Advertencias:\n${validation.warnings.join("\\n")}\\n`,
          "warning"
        );
      }

      // Ejecutar código
      const result = await window.pyodideService.runCode(this.currentCode);

      if (result.success) {
        let output = result.output || "";

        if (
          result.result !== undefined &&
          result.result !== null &&
          result.result !== "None" &&
          result.result !== ""
        ) {
          output += `\\n\\n📤 Resultado: ${result.result}`;
        }

        this.showOutput(
          output || "✅ Código ejecutado correctamente (sin salida)",
          "success"
        );
      } else {
        const formattedError = window.pyodideService.formatError(result.error);
        this.showOutput(`❌ Error:\\n${formattedError}`, "error");
      }

      this.state.hasUnsavedChanges = false;
    } catch (error) {
      this.showOutput(`💥 Error inesperado:\\n${error.message}`, "error");
    } finally {
      this.setRunning(false);
    }
  }

  /**
   * Ejecutar tests
   */
  async runTests() {
    if (!this.state.pyodideReady || this.isRunning) return;

    this.setRunning(true);
    this.showOutput("🧪 Ejecutando tests...", "info");

    try {
      // Validar código de tests
      const validation = this.testRunner.validateTestCode(this.currentCode);

      if (!validation.valid) {
        this.showOutput(
          `❌ No se encontraron tests válidos:\\n${validation.errors.join(
            "\\n"
          )}`,
          "error"
        );
        return;
      }

      // Determinar tipo de test y ejecutar
      let result;
      if (validation.hasUnittest) {
        result = await this.testRunner.runUnitTests(this.currentCode);
      } else {
        result = await this.testRunner.runTests(this.currentCode);
      }

      if (result.success) {
        const formattedResults = this.testRunner.formatTestResults(
          result.results
        );
        this.showOutput(formattedResults, "success");

        // Mostrar estadísticas adicionales
        this.showTestSummary(result.results);
      } else {
        this.showOutput(
          `❌ Error al ejecutar tests:\\n${result.error}\\n\\n${
            result.output || ""
          }`,
          "error"
        );
      }
    } catch (error) {
      this.showOutput(
        `💥 Error inesperado en tests:\\n${error.message}`,
        "error"
      );
    } finally {
      this.setRunning(false);
    }
  }

  /**
   * Reiniciar entorno Python
   */
  async resetEnvironment() {
    if (!this.state.pyodideReady || this.isRunning) return;

    this.setRunning(true);
    this.showOutput("🔄 Reiniciando entorno Python...", "info");

    try {
      const result = await window.pyodideService.resetEnvironment();

      if (result.success) {
        this.showOutput(
          "✅ Entorno reiniciado correctamente\\nTodas las variables y módulos han sido limpiados.",
          "success"
        );
      } else {
        this.showOutput(`⚠️ ${result.error}`, "warning");
      }
    } catch (error) {
      this.showOutput(`❌ Error al reiniciar:\\n${error.message}`, "error");
    } finally {
      this.setRunning(false);
    }
  }

  /**
   * Cargar ejemplo de código
   */
  async loadExample(filename) {
    try {
      const response = await fetch(`examples/${filename}`);

      if (response.ok) {
        const exampleCode = await response.text();
        this.editor.setValue(exampleCode);
        this.currentCode = exampleCode;
        this.state.hasUnsavedChanges = false;

        const exampleName = this.getExampleName(filename);
        this.showOutput(
          `📚 Ejemplo cargado: ${exampleName}\\n\\n${this.getExampleDescription(
            filename
          )}`,
          "info"
        );
      } else {
        this.showOutput(
          `❌ No se pudo cargar el ejemplo: ${filename}`,
          "error"
        );
      }
    } catch (error) {
      this.showOutput(
        `❌ Error al cargar ejemplo:\\n${error.message}`,
        "error"
      );
    }
  }

  /**
   * Mostrar salida en el panel
   */
  showOutput(text, type = "normal") {
    const output = this.elements.outputContent;
    const limitedText = window.pyodideService.limitOutput(text);

    // Crear elemento de salida
    const outputDiv = document.createElement("div");
    outputDiv.className =
      "output-entry fade-in-up mb-3 p-3 rounded-lg border-l-4";

    // Aplicar estilos según el tipo
    switch (type) {
      case "error":
        outputDiv.className += " bg-red-900/20 border-red-500 text-red-300";
        break;
      case "warning":
        outputDiv.className +=
          " bg-yellow-900/20 border-yellow-500 text-yellow-300";
        break;
      case "success":
        outputDiv.className +=
          " bg-green-900/20 border-green-500 text-green-300";
        break;
      case "info":
        outputDiv.className += " bg-blue-900/20 border-blue-500 text-blue-300";
        break;
      default:
        outputDiv.className += " bg-gray-800 border-gray-600 text-gray-300";
    }

    // Formatear texto
    const formattedText = limitedText
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\\n/g, "<br>");

    outputDiv.innerHTML = `
            <div class="text-xs text-gray-400 mb-1">${new Date().toLocaleTimeString()}</div>
            <pre class="whitespace-pre-wrap font-mono text-sm">${formattedText}</pre>
        `;

    // Limpiar mensaje de bienvenida si existe
    if (output.querySelector(".text-gray-500")) {
      output.innerHTML = "";
    }

    output.appendChild(outputDiv);
    output.scrollTop = output.scrollHeight;

    this.updateOutputStatus(type);
  }

  /**
   * Mostrar resumen de tests
   */
  showTestSummary(results) {
    if (!results || !results.tests) return;

    const summary = document.createElement("div");
    summary.className =
      "mt-4 p-4 bg-gray-800 rounded-lg border border-gray-600";

    const successRate = results.success_rate || 0;
    const barColor =
      successRate >= 80 ? "green" : successRate >= 60 ? "yellow" : "red";

    summary.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <h4 class="font-semibold text-white">📊 Resumen de Tests</h4>
                <span class="text-sm text-gray-400">${
                  results.duration || 0
                }ms</span>
            </div>

            <div class="grid grid-cols-3 gap-4 mb-3 text-center">
                <div class="p-2 bg-gray-700 rounded">
                    <div class="text-lg font-bold text-blue-400">${
                      results.total
                    }</div>
                    <div class="text-xs text-gray-400">Total</div>
                </div>
                <div class="p-2 bg-gray-700 rounded">
                    <div class="text-lg font-bold text-green-400">${
                      results.passed
                    }</div>
                    <div class="text-xs text-gray-400">Pasados</div>
                </div>
                <div class="p-2 bg-gray-700 rounded">
                    <div class="text-lg font-bold text-red-400">${
                      results.failed || results.errors || 0
                    }</div>
                    <div class="text-xs text-gray-400">Fallidos</div>
                </div>
            </div>

            <div class="mb-2">
                <div class="flex justify-between text-xs mb-1">
                    <span>Tasa de éxito</span>
                    <span>${successRate}%</span>
                </div>
                <div class="w-full bg-gray-600 rounded-full h-2">
                    <div class="bg-${barColor}-500 h-2 rounded-full transition-all duration-300"
                         style="width: ${successRate}%"></div>
                </div>
            </div>
        `;

    this.elements.outputContent.appendChild(summary);
    this.elements.outputContent.scrollTop =
      this.elements.outputContent.scrollHeight;
  }

  /**
   * Limpiar panel de salida
   */
  clearOutput() {
    this.elements.outputContent.innerHTML = `
            <div class="text-gray-500 text-center py-8">
                <div class="text-4xl mb-2">🐍</div>
                <p class="mb-2">Panel limpiado</p>
                <p class="text-xs">La salida aparecerá aquí cuando ejecutes código</p>
            </div>
        `;
    this.updateOutputStatus("clear");
  }

  /**
   * Gestión del estado de ejecución
   */
  setRunning(running) {
    this.isRunning = running;
    this.enableButtons(!running);

    if (running) {
      this.updateStatus("Ejecutando...", "yellow");
      this.elements.statusDot.className =
        "status-dot bg-yellow-500 animate-pulse-slow";
    } else {
      this.updateStatus("Python listo", "green");
      this.elements.statusDot.className = "status-dot bg-green-500";
    }
  }

  /**
   * Habilitar/deshabilitar botones
   */
  enableButtons(enabled) {
    const buttons = [
      this.elements.runBtn,
      this.elements.testBtn,
      this.elements.resetBtn,
    ];
    buttons.forEach((btn) => {
      btn.disabled = !enabled || !this.state.pyodideReady;
    });
  }

  /**
   * Actualizar estado de la aplicación
   */
  updateStatus(text, color) {
    this.elements.statusText.textContent = text;

    const colorClasses = {
      green: "text-green-400",
      yellow: "text-yellow-400",
      red: "text-red-400",
      blue: "text-blue-400",
    };

    this.elements.statusText.className = colorClasses[color] || "text-gray-400";
  }

  /**
   * Actualizar progreso de carga
   */
  updateLoadingProgress(message, progress) {
    this.elements.loadingText.textContent = message;
    this.elements.loadingProgress.style.width = `${progress}%`;
  }

  /**
   * Actualizar estado del panel de salida
   */
  updateOutputStatus(type) {
    const statusMessages = {
      error: "Error en ejecución",
      warning: "Advertencias encontradas",
      success: "Ejecutado correctamente",
      info: "Información mostrada",
      clear: "Panel limpiado",
      normal: "Salida mostrada",
    };

    this.elements.outputStatus.textContent = statusMessages[type] || "Listo";
  }

  /**
   * Ocultar pantalla de carga
   */
  hideLoading() {
    this.elements.loadingOverlay.style.opacity = "0";
    setTimeout(() => {
      this.elements.loadingOverlay.style.display = "none";
    }, 300);
  }

  /**
   * Mostrar error crítico
   */
  showError(message) {
    this.updateStatus("Error crítico", "red");
    this.showOutput(message, "error");
  }

  /**
   * Obtener código por defecto
   */
  getDefaultCode() {
    return `# ¡Bienvenido a PyHub IDE! 🐍
# Escribe tu código Python aquí y presiona Ctrl+Enter para ejecutar

def saludar(nombre="Mundo"):
    """Función de ejemplo que saluda."""
    return f"¡Hola, {nombre}!"

# Ejemplo de uso
mensaje = saludar("PyHub IDE")
print(mensaje)

# Ejemplo con lista y bucle
lenguajes = ["Python", "JavaScript", "HTML", "CSS"]
print("\\nLenguajes utilizados en este IDE:")

for i, lenguaje in enumerate(lenguajes, 1):
    print(f"  {i}. {lenguaje}")

# Ejemplo de cálculo
import math

def area_circulo(radio):
    """Calcula el área de un círculo."""
    return math.pi * radio ** 2

radio = 5
area = area_circulo(radio)
print(f"\\nÁrea de un círculo con radio {radio}: {area:.2f}")

print("\\n✨ ¡Ejecutado correctamente desde el navegador!")`;
  }

  /**
   * Obtener nombre del ejemplo
   */
  getExampleName(filename) {
    const names = {
      "hello_world.py": "Hola Mundo - Introducción a Python",
      "fibonacci.py": "Secuencia de Fibonacci",
      "tests_example.py": "Tests Unitarios - Ejemplo completo",
      "data_visualization.py": "Visualización de Datos con Matplotlib",
      "animations.py": "Arte y Animaciones Generativas",
      "algorithms.py": "Algoritmos Clásicos",
      "machine_learning.py": "Machine Learning desde Cero",
      "games.py": "Juegos Interactivos",
      "cryptography.py": "Criptografía y Seguridad",
      "web_scraping.py": "Web Scraping y APIs",
      "web_automation.py": "Automatización Web",
      "data_structures_advanced.py": "Estructuras de Datos Avanzadas",
    };
    return names[filename] || filename;
  }

  /**
   * Obtener descripción del ejemplo
   */
  getExampleDescription(filename) {
    const descriptions = {
      "hello_world.py":
        "Conceptos básicos: variables, funciones, bucles y estructuras de datos.",
      "fibonacci.py":
        "Algoritmos recursivos e iterativos, optimización y análisis matemático.",
      "tests_example.py":
        "Framework de testing, aserciones y buenas prácticas de testing.",
      "data_visualization.py":
        "Gráficos impresionantes con matplotlib: líneas, barras, dispersión y más.",
      "animations.py":
        "Arte generativo: espirales de Fibonacci, fractales de Mandelbrot y patrones.",
      "algorithms.py":
        "Algoritmos de ordenamiento, búsqueda, Dijkstra y Torres de Hanoi.",
      "machine_learning.py":
        "ML desde cero: regresión, clustering, redes neuronales y KNN.",
      "games.py":
        "Juegos clásicos: Game of Life, Sudoku, laberintos y Tic-Tac-Toe AI.",
      "cryptography.py":
        "Hashing, cifrado César, XOR, generador de contraseñas y más.",
      "web_scraping.py":
        "Extracción de datos, parseo HTML, APIs REST y procesamiento JSON.",
      "web_automation.py":
        "Automatización web avanzada: login, formularios, paginación y screenshots.",
      "data_structures_advanced.py":
        "Trie, Union-Find, Segment Tree, LRU Cache y Skip List.",
    };
    return descriptions[filename] || "Ejemplo de código Python.";
  }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  window.pyHubIDE = new PyHubIDE();
});
