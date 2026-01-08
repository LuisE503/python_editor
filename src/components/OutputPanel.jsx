import React, { useState, useRef, useEffect } from "react";

/**
 * Componente para mostrar la salida de ejecución y resultados de tests
 */
function OutputPanel({ output, testResults, onClear }) {
  const [activeTab, setActiveTab] = useState("output");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const outputRef = useRef(null);

  const hasOutput = output && output.length > 0;
  const hasTests =
    testResults && testResults.tests && testResults.tests.length > 0;

  // Auto-scroll al final cuando hay nuevo output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Detectar si hay gráficos matplotlib (canvas)
  const hasGraphics =
    output && (output.includes("plt.show()") || output.includes("Gráfico"));

  const formatLine = (line, index) => {
    let className = "py-0.5 px-2 hover:bg-gray-800 transition-colors";
    let icon = "";

    // Detectar tipo de línea
    if (
      line.includes("Error") ||
      line.includes("Traceback") ||
      line.includes("✗")
    ) {
      className += " text-red-400 bg-red-900 bg-opacity-20";
      icon = "❌ ";
    } else if (
      line.includes("✓") ||
      line.includes("Success") ||
      line.includes("✅")
    ) {
      className += " text-green-400";
      icon = "";
    } else if (
      line.includes("⚠️") ||
      line.includes("Warning") ||
      line.includes("Advertencia")
    ) {
      className += " text-yellow-400";
    } else if (line.startsWith(">>>")) {
      className += " text-cyan-400 font-bold";
    } else if (line.match(/^\s*\d+\./)) {
      className += " text-purple-300";
    } else {
      className += " text-gray-300";
    }

    return (
      <div key={index} className={className}>
        <span className="font-mono text-sm">
          {icon}
          {line || "\u00A0"}
        </span>
      </div>
    );
  };

  const containerClass = isFullscreen
    ? "fixed inset-0 z-50 bg-gray-900"
    : "output-panel";

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-800 border-b border-gray-700 px-4 py-2">
        <div className="flex items-center gap-2">
          {/* Tabs */}
          <button
            onClick={() => setActiveTab("output")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              activeTab === "output"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            <i className="fas fa-terminal"></i> Salida
          </button>
          {hasTests && (
            <button
              onClick={() => setActiveTab("tests")}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                activeTab === "tests"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              <i className="fas fa-flask"></i> Tests ({testResults.passed}/
              {testResults.total})
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-gray-400 hover:text-white p-1 rounded transition-all hover:bg-gray-700"
            title={
              isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"
            }
          >
            {isFullscreen ? (
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
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
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            )}
          </button>
          <button
            onClick={onClear}
            className="text-gray-400 hover:text-white px-3 py-1 rounded-lg text-sm transition-all
                     hover:bg-gray-700 flex items-center gap-1"
            title="Limpiar salida"
          >
            <i className="fas fa-trash-alt"></i> Limpiar
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        ref={outputRef}
        className={`flex-1 overflow-y-auto bg-gray-950 ${
          isFullscreen ? "h-[calc(100vh-50px)]" : ""
        }`}
        style={{ maxHeight: isFullscreen ? "calc(100vh - 50px)" : "100%" }}
      >
        {/* Output Tab */}
        {activeTab === "output" && (
          <div className="min-h-full">
            {!hasOutput ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-gray-500">
                <div className="text-6xl mb-4 text-blue-400">
                  <i className="fab fa-python"></i>
                </div>
                <p className="text-lg">
                  La salida del código aparecerá aquí...
                </p>
                <p className="text-sm mt-2 text-gray-600">
                  <i className="fas fa-lightbulb text-yellow-400"></i> Tip: Usa{" "}
                  <kbd className="bg-gray-800 px-2 py-0.5 rounded text-gray-400">
                    Ctrl+Enter
                  </kbd>{" "}
                  para ejecutar
                </p>
              </div>
            ) : (
              <div className="py-2">
                {output
                  .split("\n")
                  .map((line, index) => formatLine(line, index))}
              </div>
            )}

            {/* Canvas container for matplotlib */}
            <div id="matplotlib-output" className="w-full"></div>
          </div>
        )}

        {/* Tests Tab */}
        {activeTab === "tests" && hasTests && (
          <div className="p-4 space-y-4">
            {/* Summary Card */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">
                  <i className="fas fa-flask"></i> Resultados de Tests
                </span>
                <span
                  className={`text-3xl font-bold ${
                    testResults.passed === testResults.total
                      ? "text-green-300"
                      : "text-red-300"
                  }`}
                >
                  {testResults.passed}/{testResults.total}
                </span>
              </div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    testResults.passed === testResults.total
                      ? "bg-green-400"
                      : "bg-red-400"
                  }`}
                  style={{
                    width: `${(testResults.passed / testResults.total) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm mt-2 text-purple-200">
                {((testResults.passed / testResults.total) * 100).toFixed(1)}%
                de tests pasados
              </p>
            </div>

            {/* Individual Test Results */}
            <div className="space-y-2">
              {testResults.tests.map((test, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-3 border ${
                    test.passed
                      ? "bg-green-900 bg-opacity-20 border-green-700"
                      : "bg-red-900 bg-opacity-20 border-red-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xl ${
                        test.passed ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {test.passed ? "✓" : "✗"}
                    </span>
                    <span className="text-white font-medium">{test.name}</span>
                  </div>
                  {!test.passed && test.message && (
                    <div className="mt-2 text-red-300 text-sm font-mono bg-red-950 rounded p-2">
                      {test.message}
                    </div>
                  )}
                  {!test.passed && test.error && (
                    <div className="mt-2 text-red-300 text-xs font-mono bg-red-950 rounded p-2 overflow-x-auto">
                      {test.error.split("\n").slice(0, 5).join("\n")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OutputPanel;
