import React, { useState } from "react";

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
  examples = [],
}) {
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [runTime, setRunTime] = useState(null);

  const handleRun = async () => {
    const startTime = performance.now();
    await onRun();
    const endTime = performance.now();
    setRunTime((endTime - startTime).toFixed(0));
  };

  return (
    <div className="toolbar relative">
      {/* Botones principales */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Ejecutar */}
        <button
          onClick={handleRun}
          disabled={isRunning || !isPyodideReady}
          title="Ejecutar código (Ctrl+Enter)"
          className={`group flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                     ${
                       isRunning || !isPyodideReady
                         ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                         : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg hover:shadow-green-500/30"
                     }`}
        >
          {isRunning ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span>Ejecutando...</span>
            </>
          ) : (
            <>
              <i className="fas fa-play text-lg"></i>
              <span>Ejecutar</span>
              <kbd className="hidden group-hover:inline-block ml-1 bg-black bg-opacity-30 px-1.5 py-0.5 rounded text-xs">
                Ctrl+↵
              </kbd>
            </>
          )}
        </button>

        {/* Tests */}
        <button
          onClick={onRunTests}
          disabled={isRunning || !isPyodideReady}
          title="Ejecutar tests (Ctrl+Shift+T)"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                     ${
                       isRunning || !isPyodideReady
                         ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                         : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-purple-500/30"
                     }`}
        >
          <i className="fas fa-flask text-lg"></i>
          <span>Tests</span>
        </button>

        {/* Reiniciar */}
        <button
          onClick={onReset}
          disabled={isRunning || !isPyodideReady}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                     ${
                       isRunning || !isPyodideReady
                         ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                         : "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-lg hover:shadow-red-500/30"
                     }`}
          title="Reiniciar entorno Python"
        >
          <i className="fas fa-sync-alt text-lg"></i>
          <span className="hidden sm:inline">Reiniciar</span>
        </button>

        {/* Separador */}
        <div className="h-8 w-px bg-gray-600 mx-2 hidden sm:block"></div>

        {/* Selector de ejemplos */}
        <div className="relative">
          <select
            onChange={(e) => {
              onLoadExample(e.target.value);
              e.target.value = "";
            }}
            disabled={isRunning}
            defaultValue=""
            title="Cargar ejemplo"
            className="appearance-none bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 pr-10 rounded-lg
                      cursor-pointer transition-all focus:ring-2 focus:ring-purple-500 focus:outline-none
                      disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Ejemplos básicos...</option>
            {examples.map((example, index) => (
              <option key={index} value={example.file}>
                {example.name}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Status indicators */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Tiempo de ejecución */}
        {runTime && (
          <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded flex items-center gap-1">
            <i className="fas fa-stopwatch"></i>
            <span>{runTime}ms</span>
          </div>
        )}

        {/* Estado de Pyodide */}
        <div
          className={`flex items-center gap-2 text-sm ${
            isPyodideReady ? "text-green-400" : "text-yellow-400"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isPyodideReady
                ? "bg-green-400 animate-pulse"
                : "bg-yellow-400 animate-bounce"
            }`}
          ></span>
          <span className="hidden md:inline">
            {isPyodideReady ? "Python 3.11 listo" : "Cargando..."}
          </span>
        </div>

        {/* Ayuda de teclado */}
        <button
          onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
          className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-all"
          title="Atajos de teclado"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>

      {/* Keyboard shortcuts popup */}
      {showKeyboardHelp && (
        <div className="absolute right-0 top-full mt-2 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-4 z-50 w-72">
          <h4 className="text-white font-bold mb-3 flex items-center gap-2">
            <i className="fas fa-keyboard"></i> Atajos de Teclado
          </h4>
          <div className="space-y-2 text-sm">
            {[
              { key: "Ctrl+Enter", action: "Ejecutar código" },
              { key: "Ctrl+Shift+T", action: "Ejecutar tests" },
              { key: "Ctrl+S", action: "Guardar código" },
              { key: "Ctrl+/", action: "Comentar línea" },
              { key: "Ctrl+D", action: "Duplicar línea" },
              { key: "Ctrl+Z", action: "Deshacer" },
              { key: "Ctrl+Shift+Z", action: "Rehacer" },
              { key: "F11", action: "Pantalla completa" },
            ].map(({ key, action }) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-gray-400">{action}</span>
                <kbd className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-xs">
                  {key}
                </kbd>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowKeyboardHelp(false)}
            className="mt-3 w-full text-center text-gray-500 hover:text-gray-300 text-sm"
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}

export default Toolbar;
