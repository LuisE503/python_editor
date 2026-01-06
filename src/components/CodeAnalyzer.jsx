import React, { useState, useEffect } from 'react';

/**
 * Componente de análisis de código en tiempo real
 * Muestra estadísticas y métricas del código
 */
function CodeAnalyzer({ code }) {
  const [analysis, setAnalysis] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (code && isOpen) {
      analyzeCode(code);
    }
  }, [code, isOpen]);

  const analyzeCode = (sourceCode) => {
    // Análisis básico del código
    const lines = sourceCode.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    const codeLines = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed.length > 0 && !trimmed.startsWith('#');
    });
    const commentLines = lines.filter(line => line.trim().startsWith('#'));
    
    // Detectar funciones
    const functions = sourceCode.match(/def\s+\w+\s*\([^)]*\):/g) || [];
    
    // Detectar clases
    const classes = sourceCode.match(/class\s+\w+.*:/g) || [];
    
    // Detectar imports
    const imports = sourceCode.match(/(from\s+\w+\s+)?import\s+.+/g) || [];
    
    // Detectar bucles
    const forLoops = (sourceCode.match(/for\s+\w+\s+in\s+/g) || []).length;
    const whileLoops = (sourceCode.match(/while\s+.+:/g) || []).length;
    
    // Detectar condicionales
    const ifStatements = (sourceCode.match(/if\s+.+:/g) || []).length;
    const elifStatements = (sourceCode.match(/elif\s+.+:/g) || []).length;
    const elseStatements = (sourceCode.match(/else:/g) || []).length;
    
    // Detectar try-except
    const tryBlocks = (sourceCode.match(/try:/g) || []).length;
    const exceptBlocks = (sourceCode.match(/except.*:/g) || []).length;
    
    // Complejidad ciclomática aproximada
    const complexity = 1 + ifStatements + elifStatements + forLoops + whileLoops + 
                      tryBlocks + exceptBlocks;
    
    // Calcular ratios
    const commentRatio = lines.length > 0 
      ? ((commentLines.length / lines.length) * 100).toFixed(1)
      : 0;
    
    // Longitud promedio de línea
    const avgLineLength = codeLines.length > 0
      ? (codeLines.reduce((sum, line) => sum + line.length, 0) / codeLines.length).toFixed(1)
      : 0;
    
    // Palabras clave Python
    const pythonKeywords = [
      'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue',
      'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from',
      'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not',
      'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield'
    ];
    
    const keywordCount = pythonKeywords.reduce((count, keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      return count + (sourceCode.match(regex) || []).length;
    }, 0);

    setAnalysis({
      lines: {
        total: lines.length,
        code: codeLines.length,
        comments: commentLines.length,
        empty: lines.length - nonEmptyLines.length
      },
      structures: {
        functions: functions.length,
        classes: classes.length,
        imports: imports.length
      },
      controlFlow: {
        forLoops,
        whileLoops,
        ifStatements,
        elifStatements,
        elseStatements,
        tryBlocks,
        exceptBlocks
      },
      metrics: {
        complexity,
        commentRatio,
        avgLineLength,
        keywordCount,
        characters: sourceCode.length
      }
    });
  };

  const getComplexityColor = (complexity) => {
    if (complexity <= 10) return 'text-green-400';
    if (complexity <= 20) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getComplexityLabel = (complexity) => {
    if (complexity <= 10) return 'Baja';
    if (complexity <= 20) return 'Media';
    return 'Alta';
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg 
                   hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 
                   flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
        title="Análisis de código"
      >
        <span>📊</span>
        <span>Análisis</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">📊 Análisis de Código</h2>
              <p className="text-cyan-100 text-sm">Métricas y estadísticas detalladas</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
              title="Cerrar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        {analysis && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-4 text-white">
                <div className="text-3xl font-bold">{analysis.lines.total}</div>
                <div className="text-sm opacity-90">Líneas Totales</div>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-4 text-white">
                <div className="text-3xl font-bold">{analysis.structures.functions}</div>
                <div className="text-sm opacity-90">Funciones</div>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-xl p-4 text-white">
                <div className="text-3xl font-bold">{analysis.structures.classes}</div>
                <div className="text-sm opacity-90">Clases</div>
              </div>
              <div className={`bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 text-white`}>
                <div className={`text-3xl font-bold ${getComplexityColor(analysis.metrics.complexity)}`}>
                  {analysis.metrics.complexity}
                </div>
                <div className="text-sm opacity-90">Complejidad</div>
              </div>
            </div>

            {/* Lines Analysis */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>📝</span>
                <span>Análisis de Líneas</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-gray-400 text-sm">Código</div>
                  <div className="text-white text-2xl font-bold">{analysis.lines.code}</div>
                  <div className="text-gray-400 text-xs mt-1">
                    {((analysis.lines.code / analysis.lines.total) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-gray-400 text-sm">Comentarios</div>
                  <div className="text-white text-2xl font-bold">{analysis.lines.comments}</div>
                  <div className="text-gray-400 text-xs mt-1">{analysis.metrics.commentRatio}%</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-gray-400 text-sm">Vacías</div>
                  <div className="text-white text-2xl font-bold">{analysis.lines.empty}</div>
                  <div className="text-gray-400 text-xs mt-1">
                    {((analysis.lines.empty / analysis.lines.total) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-gray-400 text-sm">Long. Media</div>
                  <div className="text-white text-2xl font-bold">{analysis.metrics.avgLineLength}</div>
                  <div className="text-gray-400 text-xs mt-1">caracteres</div>
                </div>
              </div>
            </div>

            {/* Control Flow */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🔄</span>
                <span>Flujo de Control</span>
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                  <span className="text-white">Bucles for</span>
                  <span className="text-cyan-400 font-bold">{analysis.controlFlow.forLoops}</span>
                </div>
                <div className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                  <span className="text-white">Bucles while</span>
                  <span className="text-cyan-400 font-bold">{analysis.controlFlow.whileLoops}</span>
                </div>
                <div className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                  <span className="text-white">Condicionales if</span>
                  <span className="text-purple-400 font-bold">{analysis.controlFlow.ifStatements}</span>
                </div>
                <div className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                  <span className="text-white">Bloques try-except</span>
                  <span className="text-orange-400 font-bold">{analysis.controlFlow.tryBlocks}</span>
                </div>
              </div>
            </div>

            {/* Complexity */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🎯</span>
                <span>Complejidad Ciclomática</span>
              </h3>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Nivel de Complejidad</span>
                  <span className={`font-bold ${getComplexityColor(analysis.metrics.complexity)}`}>
                    {getComplexityLabel(analysis.metrics.complexity)}
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      analysis.metrics.complexity <= 10 ? 'bg-green-500' :
                      analysis.metrics.complexity <= 20 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((analysis.metrics.complexity / 30) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-gray-400 text-sm mt-3">
                  {analysis.metrics.complexity <= 10 && '✓ Código simple y fácil de mantener'}
                  {analysis.metrics.complexity > 10 && analysis.metrics.complexity <= 20 && '⚠ Complejidad moderada - considera refactorizar'}
                  {analysis.metrics.complexity > 20 && '✗ Alta complejidad - refactorización recomendada'}
                </p>
              </div>
            </div>

            {/* Other Metrics */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>📈</span>
                <span>Otras Métricas</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-gray-400 text-sm">Imports</div>
                  <div className="text-white text-xl font-bold">{analysis.structures.imports}</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-gray-400 text-sm">Palabras clave</div>
                  <div className="text-white text-xl font-bold">{analysis.metrics.keywordCount}</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-gray-400 text-sm">Caracteres</div>
                  <div className="text-white text-xl font-bold">{analysis.metrics.characters.toLocaleString()}</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-gray-400 text-sm">Tamaño</div>
                  <div className="text-white text-xl font-bold">
                    {(analysis.metrics.characters / 1024).toFixed(2)} KB
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-800 border-t border-gray-700 px-6 py-4 text-center text-gray-400 text-sm">
          <p>💡 Análisis basado en métricas estáticas del código</p>
        </div>
      </div>
    </div>
  );
}

export default CodeAnalyzer;
