/**
 * Test Runner para PyHub IDE
 * Ejecuta y gestiona tests unitarios en Python
 */

class TestRunner {
    constructor(pyodideService) {
        this.pyodideService = pyodideService;
    }

    /**
     * Ejecuta tests definidos en el código
     * Busca funciones que empiecen con "test_"
     */
    async runTests(code, timeout = 30000) {
        const testCode = this._generateTestRunnerCode(code);
        
        try {
            const result = await this.pyodideService.runCode(testCode, timeout);
            
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
     * Ejecuta tests usando el framework unittest de Python
     */
    async runUnitTests(code, timeout = 30000) {
        const unittestCode = this._generateUnittestRunnerCode(code);
        
        try {
            const result = await this.pyodideService.runCode(unittestCode, timeout);
            
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
     * Valida que el código contenga tests
     */
    validateTestCode(code) {
        const errors = [];
        
        if (!code || !code.trim()) {
            errors.push('El código está vacío');
            return { valid: false, errors };
        }

        // Verificar funciones de test simples
        const hasTestFunction = /def\s+test_\w+\s*\(/m.test(code);
        
        // Verificar unittest
        const hasUnittest = /import\s+unittest|from\s+unittest/.test(code);
        const hasTestClass = /class\s+\w*Test\w*\s*\(/m.test(code);
        
        if (!hasTestFunction && !hasUnittest) {
            errors.push('No se encontraron tests. Define funciones que empiecen con "test_" o usa unittest');
        }

        return {
            valid: errors.length === 0,
            errors,
            hasUnittest: hasUnittest && hasTestClass,
            hasSimpleTests: hasTestFunction
        };
    }

    /**
     * Genera código para ejecutar tests simples
     */
    _generateTestRunnerCode(userCode) {
        return `
import sys
import traceback
import json
from io import StringIO

# === CÓDIGO DEL USUARIO ===
${userCode}

# === TEST RUNNER ===
def discover_and_run_tests():
    """Descubre y ejecuta todas las funciones de test."""
    
    # Buscar funciones de test
    test_functions = [
        name for name in dir() 
        if name.startswith('test_') and callable(globals()[name])
    ]
    
    if not test_functions:
        return {
            'total': 0,
            'passed': 0,
            'failed': 0,
            'tests': [],
            'message': 'No se encontraron funciones de test (deben empezar con "test_")'
        }
    
    results = []
    
    for test_name in test_functions:
        test_func = globals()[test_name]
        result = {
            'name': test_name,
            'passed': False,
            'message': '',
            'error': None,
            'duration': 0
        }
        
        try:
            import time
            start_time = time.time()
            
            # Ejecutar el test
            test_func()
            
            end_time = time.time()
            result['duration'] = round((end_time - start_time) * 1000, 2)  # en ms
            result['passed'] = True
            result['message'] = 'Test ejecutado correctamente'
            
        except AssertionError as e:
            result['passed'] = False
            result['message'] = f'Assertion falló: {str(e) or "Sin mensaje"}'
            result['error'] = traceback.format_exc()
            
        except Exception as e:
            result['passed'] = False
            result['message'] = f'Error: {str(e)}'
            result['error'] = traceback.format_exc()
        
        results.append(result)
    
    # Calcular estadísticas
    total = len(results)
    passed = sum(1 for r in results if r['passed'])
    failed = total - passed
    
    return {
        'total': total,
        'passed': passed,
        'failed': failed,
        'tests': results,
        'success_rate': round((passed / total) * 100, 1) if total > 0 else 0
    }

# Ejecutar tests y retornar resultados como JSON
test_results = discover_and_run_tests()
json.dumps(test_results, ensure_ascii=False)
        `;
    }

    /**
     * Genera código para ejecutar unittest
     */
    _generateUnittestRunnerCode(userCode) {
        return `
import sys
import unittest
import json
import time
from io import StringIO

# === CÓDIGO DEL USUARIO ===
${userCode}

# === UNITTEST RUNNER ===
def run_unittest_suite():
    """Ejecuta suite de unittest y retorna resultados."""
    
    # Capturar salida
    original_stdout = sys.stdout
    original_stderr = sys.stderr
    
    test_output = StringIO()
    
    try:
        # Descubrir tests
        loader = unittest.TestLoader()
        suite = loader.loadTestsFromModule(sys.modules[__name__])
        
        if suite.countTestCases() == 0:
            return {
                'total': 0,
                'passed': 0,
                'failed': 0,
                'errors': 0,
                'tests': [],
                'message': 'No se encontraron test cases de unittest'
            }
        
        # Ejecutar tests
        sys.stdout = test_output
        sys.stderr = test_output
        
        runner = unittest.TextTestRunner(
            stream=test_output, 
            verbosity=2,
            buffer=True
        )
        
        start_time = time.time()
        test_result = runner.run(suite)
        end_time = time.time()
        
        # Procesar resultados
        results = {
            'total': test_result.testsRun,
            'passed': test_result.testsRun - len(test_result.failures) - len(test_result.errors),
            'failed': len(test_result.failures),
            'errors': len(test_result.errors),
            'duration': round((end_time - start_time) * 1000, 2),
            'tests': []
        }
        
        # Procesar tests exitosos
        all_tests = []
        for test_case in suite:
            if hasattr(test_case, '_testMethodName'):
                test_name = f"{test_case.__class__.__name__}.{test_case._testMethodName}"
                
                test_info = {
                    'name': test_name,
                    'passed': True,
                    'message': 'Test pasado',
                    'error': None
                }
                
                # Verificar si falló
                for failure in test_result.failures:
                    if failure[0]._testMethodName == test_case._testMethodName:
                        test_info['passed'] = False
                        test_info['message'] = 'Test falló'
                        test_info['error'] = failure[1]
                        break
                
                # Verificar si tuvo error
                for error in test_result.errors:
                    if error[0]._testMethodName == test_case._testMethodName:
                        test_info['passed'] = False
                        test_info['message'] = 'Error en test'
                        test_info['error'] = error[1]
                        break
                
                all_tests.append(test_info)
        
        results['tests'] = all_tests
        results['success_rate'] = round((results['passed'] / results['total']) * 100, 1) if results['total'] > 0 else 0
        
        return results
        
    finally:
        # Restaurar stdout/stderr
        sys.stdout = original_stdout
        sys.stderr = original_stderr

# Ejecutar unittest y retornar resultados
unittest_results = run_unittest_suite()
json.dumps(unittest_results, ensure_ascii=False)
        `;
    }

    /**
     * Formatea los resultados de tests para mostrar
     */
    formatTestResults(testResults) {
        if (!testResults || !testResults.tests) {
            return 'No hay resultados de tests';
        }

        const { total, passed, failed } = testResults;
        const successRate = testResults.success_rate || 0;
        
        let output = `🧪 RESULTADOS DE TESTS\n`;
        output += `${'='.repeat(50)}\n`;
        output += `Total: ${total} | Pasados: ${passed} | Fallidos: ${failed}\n`;
        output += `Tasa de éxito: ${successRate}%\n\n`;

        testResults.tests.forEach((test, index) => {
            const status = test.passed ? '✅' : '❌';
            const duration = test.duration ? ` (${test.duration}ms)` : '';
            
            output += `${status} ${test.name}${duration}\n`;
            
            if (!test.passed && test.message) {
                output += `   └─ ${test.message}\n`;
            }
            
            if (index < testResults.tests.length - 1) {
                output += '\n';
            }
        });

        return output;
    }

    /**
     * Cuenta el número de tests en el código
     */
    countTests(code) {
        const simpleTests = (code.match(/def\s+test_\w+/g) || []).length;
        const unittestMethods = (code.match(/def\s+test\w+\s*\(/g) || []).length;
        
        return {
            simple: simpleTests,
            unittest: unittestMethods,
            total: Math.max(simpleTests, unittestMethods)
        };
    }
}

// Hacer disponible globalmente
window.TestRunner = TestRunner;