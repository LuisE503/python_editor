/**
 * Servicio de Pyodide para JavaScript vanilla
 * Manejo profesional de la carga e inicialización
 */

class PyodideService {
    constructor() {
        this.pyodide = null;
        this.isLoading = false;
        this.isReady = false;
        this.loadPromise = null;
        this.version = '0.26.2';
        this.timeout = 60000;
    }

    /**
     * Inicializa Pyodide con callbacks de progreso
     */
    async initialize(onProgress, onError) {
        if (this.pyodide) {
            return this.pyodide;
        }

        if (this.isLoading) {
            return this.loadPromise;
        }

        this.isLoading = true;
        
        this.loadPromise = this._loadPyodide(onProgress, onError);
        return this.loadPromise;
    }

    async _loadPyodide(onProgress, onError) {
        try {
            onProgress?.('Descargando Pyodide...', 10);
            
            // Cargar script de Pyodide
            if (!window.loadPyodide) {
                await this._loadScript(`https://cdn.jsdelivr.net/pyodide/v${this.version}/full/pyodide.js`);
            }
            
            onProgress?.('Inicializando intérprete de Python...', 40);
            
            // Inicializar Pyodide
            this.pyodide = await window.loadPyodide({
                indexURL: `https://cdn.jsdelivr.net/pyodide/v${this.version}/full/`
            });
            
            onProgress?.('Configurando entorno...', 70);
            
            // Configurar captura de salida
            await this._setupOutputCapture();
            
            onProgress?.('¡Pyodide listo!', 100);
            
            this.isLoading = false;
            this.isReady = true;
            
            return this.pyodide;
            
        } catch (error) {
            this.isLoading = false;
            this.pyodide = null;
            this.loadPromise = null;
            onError?.(`Error al cargar Pyodide: ${error.message}`);
            throw error;
        }
    }

    async _loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Error al cargar script: ${src}`));
            document.head.appendChild(script);
        });
    }

    async _setupOutputCapture() {
        await this.pyodide.runPythonAsync(`
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
    
    def clear(self):
        self.output = []

_stdout_capture = OutputCapture()
_stderr_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stderr_capture

def clear_output():
    _stdout_capture.clear()
    _stderr_capture.clear()
        `);
    }

    /**
     * Ejecuta código Python con manejo de errores y timeout
     */
    async runCode(code, timeout = 30000) {
        if (!this.isReady || !this.pyodide) {
            throw new Error('Pyodide no está inicializado');
        }

        try {
            // Limpiar salidas anteriores
            await this.pyodide.runPythonAsync('clear_output()');

            // Ejecutar con timeout
            const result = await Promise.race([
                this.pyodide.runPythonAsync(code),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error(`Timeout: Ejecución cancelada después de ${timeout/1000}s`)), timeout)
                )
            ]);

            // Capturar salidas
            const stdout = await this.pyodide.runPythonAsync('_stdout_capture.getvalue()') || '';
            const stderr = await this.pyodide.runPythonAsync('_stderr_capture.getvalue()') || '';

            return {
                success: true,
                result: result,
                stdout: stdout,
                stderr: stderr,
                output: stdout + stderr
            };

        } catch (error) {
            let stderr = '';
            try {
                stderr = await this.pyodide.runPythonAsync('_stderr_capture.getvalue()') || '';
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
     * Reinicia el entorno de Python
     */
    async resetEnvironment() {
        if (!this.isReady || !this.pyodide) {
            return { success: false, error: 'Pyodide no está listo' };
        }

        try {
            await this.pyodide.runPythonAsync(`
# Limpiar variables globales (excepto las del sistema)
import sys
import gc

# Lista de variables a conservar
keep_vars = {
    '__name__', '__doc__', '__package__', '__loader__', '__spec__',
    '__annotations__', '__builtins__', 'sys', 'gc',
    '_stdout_capture', '_stderr_capture', 'OutputCapture', 'clear_output'
}

# Obtener variables actuales
current_vars = list(globals().keys())

# Eliminar variables del usuario
for var_name in current_vars:
    if var_name not in keep_vars and not var_name.startswith('_'):
        try:
            del globals()[var_name]
        except:
            pass

# Limpiar salidas
clear_output()

# Forzar garbage collection
gc.collect()

print("✓ Entorno reiniciado correctamente")
            `);

            return { success: true, message: 'Entorno reiniciado' };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Instala un paquete de Python
     */
    async installPackage(packageName) {
        if (!this.isReady || !this.pyodide) {
            throw new Error('Pyodide no está inicializado');
        }

        try {
            await this.pyodide.loadPackage('micropip');
            await this.pyodide.runPythonAsync(`
import micropip
await micropip.install('${packageName}')
            `);
            
            return { success: true, message: `Paquete '${packageName}' instalado` };
        } catch (error) {
            return { success: false, error: `Error instalando '${packageName}': ${error.message}` };
        }
    }

    /**
     * Valida código antes de ejecutar
     */
    validateCode(code) {
        const errors = [];
        const warnings = [];

        if (!code || !code.trim()) {
            errors.push('El código está vacío');
            return { valid: false, errors, warnings };
        }

        // Detectar patrones problemáticos
        const patterns = [
            { regex: /while\s+True\s*:(?!\s*.*break)/, type: 'warning', msg: 'Posible bucle infinito detectado' },
            { regex: /import\s+os/, type: 'warning', msg: 'Uso del módulo os detectado' },
            { regex: /exec\s*\(/, type: 'warning', msg: 'Uso de exec() detectado' },
        ];

        patterns.forEach(({ regex, type, msg }) => {
            if (regex.test(code)) {
                if (type === 'error') errors.push(msg);
                else warnings.push(msg);
            }
        });

        // Verificar tamaño
        if (code.length > 100000) {
            errors.push('Código demasiado largo (máximo 100KB)');
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Obtiene el estado actual
     */
    getStatus() {
        return {
            isReady: this.isReady,
            isLoading: this.isLoading,
            version: this.version
        };
    }

    /**
     * Formatea errores para mejor legibilidad
     */
    formatError(error) {
        if (typeof error !== 'string') {
            return String(error);
        }

        // Extraer línea principal del error
        const lines = error.split('\n');
        const errorLine = lines.find(line => 
            /Error:|Exception:/.test(line)
        );

        return errorLine ? errorLine.trim() : error;
    }

    /**
     * Limita la longitud de la salida
     */
    limitOutput(output, maxLength = 10000) {
        if (output && output.length > maxLength) {
            return output.substring(0, maxLength) + '\n\n[... salida truncada ...]';
        }
        return output;
    }
}

// Exportar instancia singleton
window.pyodideService = new PyodideService();