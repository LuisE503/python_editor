/**
 * Utilidades de seguridad para el entorno de ejecución
 */

/**
 * Valida el código Python antes de ejecutarlo
 * Detecta patrones potencialmente peligrosos
 */
export function validateCode(code) {
  const warnings = [];
  const errors = [];

  if (!code || code.trim().length === 0) {
    errors.push('El código está vacío');
    return { valid: false, errors, warnings };
  }

  // Detectar importaciones potencialmente peligrosas (aunque Pyodide está sandboxed)
  const dangerousPatterns = [
    { pattern: /import\s+os/, message: 'Uso de módulo "os" detectado' },
    { pattern: /import\s+subprocess/, message: 'Uso de módulo "subprocess" detectado' },
    { pattern: /from\s+os\s+import/, message: 'Importación desde módulo "os" detectada' },
  ];

  dangerousPatterns.forEach(({ pattern, message }) => {
    if (pattern.test(code)) {
      warnings.push(message);
    }
  });

  // Detectar bucles infinitos obvios (limitado)
  const infiniteLoopPatterns = [
    /while\s+True\s*:/,
    /while\s+1\s*:/,
  ];

  infiniteLoopPatterns.forEach(pattern => {
    if (pattern.test(code)) {
      warnings.push('Posible bucle infinito detectado (while True). Asegúrate de incluir una condición de salida.');
    }
  });

  // Verificar longitud del código
  if (code.length > 100000) {
    errors.push('El código es demasiado largo (máximo 100KB)');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Sanitiza la salida del código para prevenir XSS
 */
export function sanitizeOutput(output) {
  if (typeof output !== 'string') {
    output = String(output);
  }
  
  return output
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Limita el tamaño de la salida
 */
export function limitOutput(output, maxLength = 10000) {
  if (output.length > maxLength) {
    return output.substring(0, maxLength) + '\n\n[... salida truncada ...]';
  }
  return output;
}

/**
 * Estima el tiempo de ejecución basado en el código
 */
export function estimateExecutionTime(code) {
  // Heurística simple
  const lines = code.split('\n').length;
  const hasLoops = /for\s+\w+\s+in|while/.test(code);
  const hasRecursion = /def\s+\w+.*:\s*\n.*\1\(/.test(code);
  
  let estimatedTime = lines * 10; // 10ms por línea base
  
  if (hasLoops) estimatedTime *= 2;
  if (hasRecursion) estimatedTime *= 3;
  
  return Math.min(estimatedTime, 30000); // Máximo 30s
}

/**
 * Configura timeout dinámico basado en el código
 */
export function getRecommendedTimeout(code) {
  const estimated = estimateExecutionTime(code);
  return Math.max(5000, Math.min(estimated, 30000));
}

/**
 * Formatea errores de Python para mejor legibilidad
 */
export function formatPythonError(error) {
  if (typeof error !== 'string') {
    return String(error);
  }

  // Extraer el mensaje de error principal
  const lines = error.split('\n');
  const errorLine = lines.find(line => 
    line.includes('Error:') || 
    line.includes('Exception:')
  );

  if (errorLine) {
    return errorLine.trim();
  }

  return error;
}
