import React from 'react';

/**
 * Componente de barra de herramientas con controles principales
 */
function Toolbar({ 
  onRun, 
  onRunTests, 
  onReset, 
  onLoadExample, 
  isRunning, 
  isPyodideReady,
  examples = []
}) {
  return (
    <div className="toolbar">
      <button 
        onClick={onRun} 
        disabled={isRunning || !isPyodideReady}
        title="Ejecutar código (Ctrl+Enter)"
      >
        ▶️ Ejecutar
      </button>
      
      <button 
        onClick={onRunTests} 
        disabled={isRunning || !isPyodideReady}
        title="Ejecutar tests"
      >
        🧪 Tests
      </button>
      
      <button 
        onClick={onReset} 
        disabled={isRunning || !isPyodideReady}
        className="danger"
        title="Reiniciar entorno Python"
      >
        🔄 Reiniciar
      </button>

      <select 
        onChange={(e) => onLoadExample(e.target.value)} 
        disabled={isRunning}
        defaultValue=""
        title="Cargar ejemplo"
      >
        <option value="">📚 Ejemplos...</option>
        {examples.map((example, index) => (
          <option key={index} value={example.file}>
            {example.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Toolbar;
