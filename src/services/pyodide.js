/**
 * Servicio para gestionar la carga e inicialización de Pyodide
 * con lazy loading y manejo de errores
 */

let pyodideInstance = null;
let isLoading = false;
let loadPromise = null;

const PYODIDE_VERSION = '0.26.2';
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.js`;
const LOAD_TIMEOUT = 60000; // 60 segundos

/**
 * Carga Pyodide desde CDN con timeout
 */
async function loadPyodideFromCDN() {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Timeout al cargar Pyodide. Verifica tu conexión a internet.'));
    }, LOAD_TIMEOUT);

    const script = document.createElement('script');
    script.src = PYODIDE_CDN;
    script.async = true;
    
    script.onload = async () => {
      clearTimeout(timeout);
      try {
        const pyodide = await window.loadPyodide({
          indexURL: `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`
        });
        resolve(pyodide);
      } catch (error) {
        reject(new Error(`Error al inicializar Pyodide: ${error.message}`));
      }
    };
    
    script.onerror = () => {
      clearTimeout(timeout);
      reject(new Error('Error al cargar el script de Pyodide desde CDN'));
    };
    
    document.head.appendChild(script);
  });
}

/**
 * Inicializa Pyodide (lazy loading)
 */
export async function initializePyodide(onProgress) {
  if (pyodideInstance) {
    return pyodideInstance;
  }

  if (isLoading) {
    return loadPromise;
  }

  isLoading = true;
  
  loadPromise = (async () => {
    try {
      if (onProgress) onProgress('Descargando Pyodide...');
      
      pyodideInstance = await loadPyodideFromCDN();
      
      if (onProgress) onProgress('Inicializando entorno Python...');
      
      // Configurar stdout/stderr personalizados
      await pyodideInstance.runPythonAsync(`
import sys
from io import StringIO

class OutputCapture:
    def __init__(self):
        self.output = []
    
    def write(self, text):
        if text.strip():
            self.output.append(text)
    
    def flush(self):
        pass
    
    def getvalue(self):
        return ''.join(self.output)

_stdout_capture = OutputCapture()
_stderr_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stderr_capture
      `);

      // Cargar matplotlib si está disponible
      if (onProgress) onProgress('Cargando librerías de visualización...');
      try {
        await pyodideInstance.loadPackage(['matplotlib', 'numpy']);
        
        // Configurar matplotlib para mostrar gráficos en el navegador
        await pyodideInstance.runPythonAsync(`
import matplotlib
import matplotlib.pyplot as plt
import numpy as np

# Configurar backend para navegador
matplotlib.use('module://matplotlib_pyodide.html5_canvas_backend')

# Configurar para mostrar múltiples gráficos
plt.ioff()  # Desactivar modo interactivo

print("✅ Matplotlib y NumPy cargados correctamente")
        `);
      } catch (error) {
        console.warn('matplotlib no disponible:', error);
      }
      
      if (onProgress) onProgress('¡Pyodide listo!');
      
      isLoading = false;
      return pyodideInstance;
    } catch (error) {
      isLoading = false;
      pyodideInstance = null;
      loadPromise = null;
      throw error;
    }
  })();

  return loadPromise;
}

/**
 * Ejecuta código Python con timeout y sandboxing
 */
export async function runPythonCode(code, timeout = 30000) {
  if (!pyodideInstance) {
    throw new Error('Pyodide no está inicializado. Llama a initializePyodide() primero.');
  }

  try {
    // Limpiar salidas anteriores
    await pyodideInstance.runPythonAsync(`
_stdout_capture.output = []
_stderr_capture.output = []
    `);

    // Ejecutar con timeout
    const result = await Promise.race([
      pyodideInstance.runPythonAsync(code),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout: El código tardó más de ' + (timeout/1000) + ' segundos')), timeout)
      )
    ]);

    // Capturar salidas
    const stdout = await pyodideInstance.runPythonAsync('_stdout_capture.getvalue()');
    const stderr = await pyodideInstance.runPythonAsync('_stderr_capture.getvalue()');

    return {
      success: true,
      result: result,
      stdout: stdout || '',
      stderr: stderr || '',
      output: (stdout || '') + (stderr || '')
    };
  } catch (error) {
    // Capturar stderr incluso en error
    let stderr = '';
    try {
      stderr = await pyodideInstance.runPythonAsync('_stderr_capture.getvalue()');
    } catch (e) {
      // Ignorar errores al capturar stderr
    }

    return {
      success: false,
      error: error.message || String(error),
      stderr: stderr,
      output: stderr || error.message || String(error)
    };
  }
}

/**
 * Instala paquetes de PyPI
 */
export async function installPackage(packageName) {
  if (!pyodideInstance) {
    throw new Error('Pyodide no está inicializado');
  }

  try {
    await pyodideInstance.loadPackage('micropip');
    await pyodideInstance.runPythonAsync(`
import micropip
await micropip.install('${packageName}')
    `);
    return { success: true, message: `Paquete '${packageName}' instalado correctamente` };
  } catch (error) {
    return { success: false, error: `Error al instalar '${packageName}': ${error.message}` };
  }
}

/**
 * Obtiene la instancia de Pyodide
 */
export function getPyodideInstance() {
  return pyodideInstance;
}

/**
 * Verifica si Pyodide está listo
 */
export function isPyodideReady() {
  return pyodideInstance !== null;
}

/**
 * Limpia el entorno de Pyodide
 */
export async function resetPyodide() {
  if (pyodideInstance) {
    try {
      await pyodideInstance.runPythonAsync(`
import sys
# Limpiar variables del namespace
for name in list(globals().keys()):
    if not name.startswith('_') and name not in ['sys', 'StringIO', 'OutputCapture']:
        del globals()[name]

# Limpiar salidas
_stdout_capture.output = []
_stderr_capture.output = []
      `);
      return { success: true, message: 'Entorno reiniciado' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  return { success: false, error: 'Pyodide no está inicializado' };
}
