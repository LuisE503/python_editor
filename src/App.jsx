import React, { useState, useEffect, useRef } from "react";
import CodeEditor from "./components/CodeEditor";
import OutputPanel from "./components/OutputPanel";
import Toolbar from "./components/Toolbar";
import ExamplesGallery from "./components/ExamplesGallery";
import InteractiveREPL from "./components/InteractiveREPL";
import SettingsPanel from "./components/SettingsPanel";
import SharePanel from "./components/SharePanel";
import CodeAnalyzer from "./components/CodeAnalyzer";
import ToastContainer from "./components/ToastContainer";
import CommandPalette from "./components/CommandPalette";
import SnippetsLibrary from "./components/SnippetsLibrary";
import HelpPanel from "./components/HelpPanel";
import StatusBar from "./components/StatusBar";
import KeyboardShortcutsOverlay from "./components/KeyboardShortcutsOverlay";
import {
  initializePyodide,
  runPythonCode,
  resetPyodide,
  isPyodideReady,
} from "./services/pyodide";
import { runTests, validateTestCode } from "./services/testRunner";
import { validateCode, limitOutput } from "./utils/security";

const DEFAULT_CODE = `# 🎉 Bienvenido a PyHub IDE - Tu Python Playground
# Editor profesional con ejemplos interactivos increíbles

def factorial(n):
    """Calcula el factorial de un número."""
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# Demostración
print("🧮 Calculadora de Factoriales")
for i in range(1, 8):
    print(f"  {i}! = {factorial(i):,}")

# Tip: Explora los ejemplos avanzados en la galería 📚
# - Visualización de datos con matplotlib
# - Arte generativo y fractales
# - Algoritmos clásicos
# - Machine Learning desde cero
# - Juegos interactivos
print("\\n💡 ¡Abre la galería para ver ejemplos increíbles!")
`;

const EXAMPLES = [
  { name: "Hola Mundo", file: "hello_world.py" },
  { name: "Fibonacci", file: "fibonacci.py" },
  { name: "Tests Unitarios", file: "tests_example.py" },
  { name: "Visualización de Datos", file: "data_visualization.py" },
  { name: "Arte y Animaciones", file: "animations.py" },
  { name: "Algoritmos Clásicos", file: "algorithms.py" },
  { name: "Machine Learning", file: "machine_learning.py" },
  { name: "Juegos Interactivos", file: "games.py" },
  { name: "Criptografía", file: "cryptography.py" },
  { name: "Web Scraping y APIs", file: "web_scraping.py" },
];

function App() {
  const [code, setCode] = useState(() => {
    // Cargar código guardado del localStorage
    const saved = localStorage.getItem("pyhub-code");
    return saved || DEFAULT_CODE;
  });
  const [output, setOutput] = useState("");
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Iniciando...");
  const [isRunning, setIsRunning] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("pyhub-settings");
    return saved
      ? JSON.parse(saved)
      : {
          theme: "vs-dark",
          fontSize: 14,
          wordWrap: "on",
          minimap: true,
          lineNumbers: "on",
          autoSave: true,
        };
  });

  // Inicializar Pyodide al montar el componente
  useEffect(() => {
    async function init() {
      try {
        await initializePyodide((message) => {
          setLoadingMessage(message);
        });
        setPyodideReady(true);
        setOutput("✓ Python listo. ¡Explora los ejemplos en la galería!\n");
      } catch (error) {
        setOutput(
          `❌ Error al inicializar Pyodide:\n${error.message}\n\nRecarga la página para intentar de nuevo.`
        );
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, []);

  // Auto-guardar código
  useEffect(() => {
    if (settings.autoSave) {
      const timer = setTimeout(() => {
        localStorage.setItem("pyhub-code", code);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [code, settings.autoSave]);

  // Guardar configuración
  useEffect(() => {
    localStorage.setItem("pyhub-settings", JSON.stringify(settings));
  }, [settings]);

  // Listener para el atajo Ctrl+Enter
  useEffect(() => {
    const handleEditorRun = () => {
      if (pyodideReady && !isRunning) {
        handleRun();
      }
    };

    window.addEventListener("editor-run", handleEditorRun);
    return () => window.removeEventListener("editor-run", handleEditorRun);
  }, [pyodideReady, isRunning, code]);

  const handleRun = async () => {
    if (!isPyodideReady()) {
      setOutput("⚠️ Pyodide aún no está listo. Por favor espera...\n");
      return;
    }

    setIsRunning(true);
    setTestResults(null);
    setOutput("⏳ Ejecutando...\n");

    const startTime = performance.now();

    try {
      // Validar código
      const validation = validateCode(code);
      if (!validation.valid) {
        setOutput("❌ Errores de validación:\n" + validation.errors.join("\n"));
        setExecutionTime(null);
        return;
      }

      if (validation.warnings.length > 0) {
        setOutput(
          "⚠️ Advertencias:\n" + validation.warnings.join("\n") + "\n\n"
        );
      }

      // Ejecutar código
      const result = await runPythonCode(code, 30000);
      const endTime = performance.now();
      const execTime = Math.round(endTime - startTime);
      setExecutionTime(execTime);

      if (result.success) {
        let outputText = result.output || "";
        if (
          result.result !== undefined &&
          result.result !== null &&
          result.result !== "None"
        ) {
          outputText += `\n\n➜ Resultado: ${result.result}`;
        }
        setOutput(
          outputText || "✓ Código ejecutado correctamente (sin salida)"
        );
      } else {
        setOutput(`❌ Error:\n${result.error || result.output}`);
      }
    } catch (error) {
      setOutput(`❌ Error inesperado:\n${error.message}`);
      setExecutionTime(null);
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunTests = async () => {
    if (!isPyodideReady()) {
      setOutput("⚠️ Pyodide aún no está listo. Por favor espera...\n");
      return;
    }

    setIsRunning(true);
    setTestResults(null);
    setOutput("🧪 Ejecutando tests...\n");

    try {
      // Validar código de tests
      const validation = validateTestCode(code);
      if (!validation.valid) {
        setOutput(
          "❌ No se encontraron tests válidos:\n" + validation.errors.join("\n")
        );
        return;
      }

      // Ejecutar tests
      const result = await runTests(code, 30000);

      if (result.success) {
        setTestResults(result.results);
        const passRate =
          result.results.total > 0
            ? ((result.results.passed / result.results.total) * 100).toFixed(1)
            : 0;
        setOutput(
          `✓ Tests completados\n` +
            `Total: ${result.results.total}\n` +
            `Pasados: ${result.results.passed}\n` +
            `Fallados: ${result.results.failed}\n` +
            `Tasa de éxito: ${passRate}%\n`
        );
      } else {
        setOutput(
          `❌ Error al ejecutar tests:\n${result.error}\n\n${
            result.output || ""
          }`
        );
      }
    } catch (error) {
      setOutput(`❌ Error inesperado:\n${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = async () => {
    setIsRunning(true);
    setOutput("⏳ Reiniciando entorno...\n");
    setTestResults(null);

    try {
      const result = await resetPyodide();
      if (result.success) {
        setOutput("✓ Entorno reiniciado correctamente\n");
      } else {
        setOutput(`⚠️ ${result.error}\n`);
      }
    } catch (error) {
      setOutput(`❌ Error al reiniciar:\n${error.message}\n`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleLoadExample = async (filename) => {
    if (!filename) return;

    try {
      const response = await fetch(`./examples/${filename}`);
      if (response.ok) {
        const exampleCode = await response.text();
        setCode(exampleCode);
        setOutput(
          `✓ Ejemplo cargado: ${filename}\n➡ Presiona Ejecutar o Ctrl+Enter para ver el resultado\n`
        );
        setTestResults(null);
      } else {
        setOutput(`❌ No se pudo cargar el ejemplo: ${filename}\n`);
      }
    } catch (error) {
      setOutput(`❌ Error al cargar ejemplo:\n${error.message}\n`);
    }
  };

  const handleClearOutput = () => {
    setOutput("");
    setTestResults(null);
  };

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
  };

  const handleLoadSharedCode = (sharedCode) => {
    setCode(sharedCode);
    setOutput("📥 Código compartido cargado correctamente\n");
    if (window.showToast) {
      window.showToast("Código cargado exitosamente", "success");
    }
  };

  const executeREPLCode = async (replCode) => {
    try {
      const result = await runPythonCode(replCode, 10000);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const handleInsertSnippet = (snippetCode) => {
    // Insertar snippet al final del código actual
    setCode((prevCode) => {
      if (prevCode.trim()) {
        return prevCode + "\n\n" + snippetCode;
      }
      return snippetCode;
    });
  };

  // Refs para los componentes
  const examplesGalleryRef = useRef(null);
  const replRef = useRef(null);
  const settingsRef = useRef(null);
  const shareRef = useRef(null);
  const analyzerRef = useRef(null);
  const snippetsRef = useRef(null);

  return (
    <div className="app-container">
      <ToastContainer />

      <CommandPalette
        onRunCode={handleRun}
        onRunTests={handleRunTests}
        onOpenExamples={() => {}}
        onOpenREPL={() => {}}
        onOpenSettings={() => {}}
        onOpenShare={() => {}}
        onOpenAnalyzer={() => {}}
        onClearOutput={handleClearOutput}
      />

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="spinner"></div>
            <div className="loading-text">{loadingMessage}</div>
          </div>
        </div>
      )}

      <header className="app-header" role="banner">
        <div className="app-title">
          <span className="icon text-blue-400" aria-hidden="true">
            <i className="fab fa-python"></i>
          </span>
          <h1 className="font-bold text-xl">PyHub IDE</h1>
          <span
            className="ml-2 text-xs bg-purple-600 px-2 py-1 rounded-full"
            aria-label="Pro version"
          >
            Pro
          </span>
        </div>
        <div
          className="flex items-center gap-2 flex-wrap"
          role="navigation"
          aria-label="Main navigation"
        >
          <ExamplesGallery
            onLoadExample={handleLoadExample}
            isRunning={isRunning}
          />
          <SnippetsLibrary onInsertSnippet={handleInsertSnippet} />
          <InteractiveREPL
            pyodideReady={pyodideReady}
            onExecuteCode={executeREPLCode}
          />
          <CodeAnalyzer code={code} />
          <SharePanel code={code} onLoadCode={handleLoadSharedCode} />
          <SettingsPanel
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />
          <HelpPanel />
          <div className="app-status ml-2" role="status" aria-live="polite">
            <span
              className={`status-indicator ${isLoading ? "loading" : ""}`}
              aria-hidden="true"
            ></span>
            <span className="text-sm hidden md:inline">
              {pyodideReady ? (
                <>
                  <i className="fas fa-check-circle text-green-400"></i> Python
                  listo
                </>
              ) : (
                <>
                  <i className="fas fa-circle-notch fa-spin text-yellow-400"></i>{" "}
                  Cargando...
                </>
              )}
            </span>
          </div>
        </div>
      </header>

      <Toolbar
        onRun={handleRun}
        onRunTests={handleRunTests}
        onReset={handleReset}
        onLoadExample={handleLoadExample}
        isRunning={isRunning}
        isPyodideReady={pyodideReady}
        examples={EXAMPLES}
      />

      <div className="main-content">
        <div className="editor-panel">
          <div className="editor-header">
            <div className="editor-tabs">
              <button className="editor-tab active">
                <span>📄</span>
                <span>main.py</span>
              </button>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              {settings.autoSave && (
                <span className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                  </svg>
                  Auto-guardado
                </span>
              )}
              <span>Ctrl+Enter para ejecutar</span>
            </div>
          </div>
          <div className="editor-wrapper">
            <CodeEditor
              value={code}
              onChange={setCode}
              language="python"
              theme={settings.theme}
              fontSize={settings.fontSize}
              wordWrap={settings.wordWrap}
              minimap={settings.minimap}
              lineNumbers={settings.lineNumbers}
            />
          </div>
        </div>

        <OutputPanel
          output={output}
          testResults={testResults}
          onClear={handleClearOutput}
        />
      </div>

      <StatusBar
        code={code}
        pyodideReady={pyodideReady}
        isRunning={isRunning}
        executionTime={executionTime}
      />

      <KeyboardShortcutsOverlay />
    </div>
  );
}

export default App;
