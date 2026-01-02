import React from 'react';

/**
 * Componente para mostrar la salida de ejecución y resultados de tests
 */
function OutputPanel({ output, testResults, onClear }) {
  const hasOutput = output && output.length > 0;
  const hasTests = testResults && testResults.tests && testResults.tests.length > 0;

  return (
    <div className="output-panel">
      <div className="output-header">
        <span>📤 Salida</span>
        <button onClick={onClear} title="Limpiar salida">
          🗑️ Limpiar
        </button>
      </div>
      
      <div className={`output-content ${!hasOutput && !hasTests ? 'empty' : ''}`}>
        {!hasOutput && !hasTests && (
          <div>
            <p>La salida del código aparecerá aquí...</p>
            <p style={{ fontSize: '12px', marginTop: '8px', color: '#888' }}>
              💡 Tip: Usa Ctrl+Enter para ejecutar el código
            </p>
          </div>
        )}
        
        {hasOutput && (
          <div>
            {output.split('\n').map((line, index) => {
              let className = 'output-line';
              if (line.includes('Error') || line.includes('Traceback')) {
                className += ' error';
              } else if (line.includes('✓') || line.includes('Success')) {
                className += ' success';
              }
              
              return (
                <div key={index} className={className}>
                  {line || '\u00A0'}
                </div>
              );
            })}
          </div>
        )}

        {hasTests && (
          <div className="test-results">
            <div className="test-summary">
              📊 Resultados de Tests: {testResults.passed}/{testResults.total} pasados
            </div>
            
            {testResults.tests.map((test, index) => (
              <div key={index} className="test-item">
                <div className="test-name">
                  <span className={`test-status ${test.passed ? 'pass' : 'fail'}`}>
                    {test.passed ? '✓' : '✗'}
                  </span>
                  <span>{test.name}</span>
                </div>
                {!test.passed && test.message && (
                  <div className="test-message">{test.message}</div>
                )}
                {!test.passed && test.error && (
                  <div className="test-message" style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                    {test.error.split('\n').slice(0, 5).join('\n')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OutputPanel;
