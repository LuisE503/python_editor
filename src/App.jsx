import React, { useState, useEffect } from 'react';
import CodeEditor from './components/CodeEditor';
import OutputPanel from './components/OutputPanel';
import Toolbar from './components/Toolbar';
import { initializePyodide, runPythonCode, resetPyodide, isPyodideReady } from './services/pyodide';
import { runTests, validateTestCode } from './services/testRunner';
import { validateCode, limitOutput } from './utils/security';

const DEFAULT_CODE = `# Bienvenido a PyHub IDE
# Escribe tu código Python aquí y presiona "Ejecutar"

def saludar(nombre):
    """Función de ejemplo que saluda."""
    return f"¡Hola, {nombre}!"

# Ejecutar el código
mensaje = saludar("Mundo")
print(mensaje)

# Ejemplo de cálculo
numeros = [1, 2, 3, 4, 5]
suma = sum(numeros)
print(f"La suma de {numeros} es {suma}")
`;

const EXAMPLES = [
  { name: 'Hola Mundo', file: 'hello_world.py' },
  { name: 'Fibonacci', file: 'fibonacci.py' },
  { name: 'Tests Unitarios', file: 'tests_example.py' }
];

function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Iniciando...');
  const [isRunning, setIsRunning] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);

  // Inicializar Pyodide al montar el componente
  useEffect(() => {
    async function init() {
      try {
        await initializePyodide((message) => {
          setLoadingMessage(message);
        });
        setPyodideReady(true);
        setOutput('✓ Python listo. ¡Comienza a programar!\n');
      } catch (error) {
        setOutput(`❌ Error al inicializar Pyodide:\n${error.message}\n\nRecarga la página para intentar de nuevo.`);
      } finally {
        setIsLoading(false);
      }
    }
    
    init();
  }, []);

  // Listener para el atajo Ctrl+Enter
  useEffect(() => {
    const handleEditorRun = () => {
      if (pyodideReady && !isRunning) {
        handleRun();
      }
    };

    window.addEventListener('editor-run', handleEditorRun);
    return () => window.removeEventListener('editor-run', handleEditorRun);
  }, [pyodideReady, isRunning, code]);

  const handleRun = async () => {
    if (!isPyodideReady()) {
      setOutput('⚠️ Pyodide aún no está listo. Por favor espera...\n');
      return;
    }

    setIsRunning(true);
    setTestResults(null);
    setOutput('🔄 Ejecutando...\n');

    try {
      // Validar código
      const validation = validateCode(code);
      if (!validation.valid) {
        setOutput('❌ Errores de validación:\n' + validation.errors.join('\n'));
        return;
      }

      if (validation.warnings.length > 0) {
        setOutput('⚠️ Advertencias:\n' + validation.warnings.join('\n') + '\n\n');
      }

      // Ejecutar código
      const result = await runPythonCode(code, 30000);
      
      if (result.success) {
        let outputText = result.output || '';
        if (result.result !== undefined && result.result !== null && result.result !== 'None') {
          outputText += `\n\n➜ Resultado: ${result.result}`;
        }
        setOutput(outputText || '✓ Código ejecutado correctamente (sin salida)');
      } else {
        setOutput(`❌ Error:\n${result.error || result.output}`);
      }
    } catch (error) {
      setOutput(`❌ Error inesperado:\n${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunTests = async () => {
    if (!isPyodideReady()) {
      setOutput('⚠️ Pyodide aún no está listo. Por favor espera...\n');
      return;
    }

    setIsRunning(true);
    setTestResults(null);
    setOutput('🧪 Ejecutando tests...\n');

    try {
      // Validar código de tests
      const validation = validateTestCode(code);
      if (!validation.valid) {
        setOutput('❌ No se encontraron tests válidos:\n' + validation.errors.join('\n'));
        return;
      }

      // Ejecutar tests
      const result = await runTests(code, 30000);
      
      if (result.success) {
        setTestResults(result.results);
        const passRate = result.results.total > 0 
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
        setOutput(`❌ Error al ejecutar tests:\n${result.error}\n\n${result.output || ''}`);
      }
    } catch (error) {
      setOutput(`❌ Error inesperado:\n${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = async () => {
    setIsRunning(true);
    setOutput('🔄 Reiniciando entorno...\n');
    setTestResults(null);

    try {
      const result = await resetPyodide();
      if (result.success) {
        setOutput('✓ Entorno reiniciado correctamente\n');
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
      const response = await fetch(`/examples/${filename}`);
      if (response.ok) {
        const exampleCode = await response.text();
        setCode(exampleCode);
        setOutput(`📚 Ejemplo cargado: ${filename}\n`);
        setTestResults(null);
      } else {
        setOutput(`❌ No se pudo cargar el ejemplo: ${filename}\n`);
      }
    } catch (error) {
      setOutput(`❌ Error al cargar ejemplo:\n${error.message}\n`);
    }
  };

  const handleClearOutput = () => {
    setOutput('');
    setTestResults(null);
  };

  return (
    <div className="app-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="spinner"></div>
            <div className="loading-text">{loadingMessage}</div>
          </div>
        </div>
      )}

      <header className="app-header">
        <div className="app-title">
          <span className="icon">🐍</span>
          <span>PyHub IDE</span>
        </div>
        <div className="app-status">
          <span className={`status-indicator ${isLoading ? 'loading' : ''}`}></span>
          <span>{pyodideReady ? 'Python listo' : 'Cargando...'}</span>
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
              <button className="editor-tab active">main.py</button>
            </div>
            <span style={{ fontSize: '11px', color: '#888' }}>
              Ctrl+Enter para ejecutar
            </span>
          </div>
          <div className="editor-wrapper">
            <CodeEditor
              value={code}
              onChange={setCode}
              language="python"
              theme="vs-dark"
            />
          </div>
        </div>

        <OutputPanel
          output={output}
          testResults={testResults}
          onClear={handleClearOutput}
        />
      </div>
    </div>
  );
}

export default App;
