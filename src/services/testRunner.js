/**
 * Servicio para ejecutar tests unitarios en Pyodide
 */

import { runPythonCode } from './pyodide.js';

/**
 * Ejecuta tests definidos en el código Python
 * Busca funciones que empiecen con "test_" y las ejecuta
 */
export async function runTests(code, timeout = 30000) {
  const testRunnerCode = `
import sys
import traceback
from io import StringIO

# Código del usuario
${code}

# Descubrir funciones de test
test_functions = [name for name in dir() if name.startswith('test_') and callable(globals()[name])]

results = []

for test_name in test_functions:
    test_func = globals()[test_name]
    result = {
        'name': test_name,
        'passed': False,
        'message': '',
        'error': None
    }
    
    try:
        # Ejecutar el test
        test_func()
        result['passed'] = True
        result['message'] = 'Test pasado exitosamente'
    except AssertionError as e:
        result['passed'] = False
        result['message'] = f'Assertion falló: {str(e)}'
        result['error'] = traceback.format_exc()
    except Exception as e:
        result['passed'] = False
        result['message'] = f'Error: {str(e)}'
        result['error'] = traceback.format_exc()
    
    results.append(result)

# Convertir a formato serializable
import json

output = {
    'total': len(results),
    'passed': sum(1 for r in results if r['passed']),
    'failed': sum(1 for r in results if not r['passed']),
    'tests': results
}

json.dumps(output)
`;

  try {
    const result = await runPythonCode(testRunnerCode, timeout);
    
    if (result.success && result.result) {
      try {
        const testResults = JSON.parse(result.result);
        return {
          success: true,
          results: testResults,
          output: result.output
        };
      } catch (parseError) {
        return {
          success: false,
          error: 'Error al parsear resultados de tests',
          output: result.output
        };
      }
    } else {
      return {
        success: false,
        error: result.error || 'Error al ejecutar tests',
        output: result.output || result.error
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      output: error.message
    };
  }
}

/**
 * Ejecuta tests usando unittest framework de Python
 */
export async function runUnittests(code, timeout = 30000) {
  const unittestRunnerCode = `
import sys
import unittest
import json
from io import StringIO

# Código del usuario
${code}

# Descubrir y ejecutar tests
loader = unittest.TestLoader()
suite = loader.loadTestsFromModule(sys.modules[__name__])

# Ejecutar tests con un custom runner
stream = StringIO()
runner = unittest.TextTestRunner(stream=stream, verbosity=2)
test_result = runner.run(suite)

# Recopilar resultados
results = {
    'total': test_result.testsRun,
    'passed': test_result.testsRun - len(test_result.failures) - len(test_result.errors),
    'failed': len(test_result.failures) + len(test_result.errors),
    'tests': []
}

# Agregar tests exitosos
for test in suite:
    if hasattr(test, '_testMethodName'):
        test_name = f"{test.__class__.__name__}.{test._testMethodName}"
        
        # Verificar si falló
        failed = False
        error_msg = ''
        
        for failure in test_result.failures:
            if failure[0] == test:
                failed = True
                error_msg = failure[1]
                break
        
        for error in test_result.errors:
            if error[0] == test:
                failed = True
                error_msg = error[1]
                break
        
        results['tests'].append({
            'name': test_name,
            'passed': not failed,
            'message': 'Test pasado' if not failed else 'Test falló',
            'error': error_msg if failed else None
        })

json.dumps(results)
`;

  try {
    const result = await runPythonCode(unittestRunnerCode, timeout);
    
    if (result.success && result.result) {
      try {
        const testResults = JSON.parse(result.result);
        return {
          success: true,
          results: testResults,
          output: result.output
        };
      } catch (parseError) {
        return {
          success: false,
          error: 'Error al parsear resultados de unittest',
          output: result.output
        };
      }
    } else {
      return {
        success: false,
        error: result.error || 'Error al ejecutar unittest',
        output: result.output || result.error
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      output: error.message
    };
  }
}

/**
 * Valida el código de tests antes de ejecutarlo
 */
export function validateTestCode(code) {
  const errors = [];
  
  if (!code || code.trim().length === 0) {
    errors.push('El código está vacío');
    return { valid: false, errors };
  }
  
  // Verificar que haya al menos una función de test
  const hasTestFunction = /def\s+test_\w+\s*\(/.test(code);
  const hasUnittest = /import\s+unittest|from\s+unittest/.test(code);
  
  if (!hasTestFunction && !hasUnittest) {
    errors.push('No se encontraron funciones de test (deben empezar con "test_")');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    hasUnittest
  };
}
