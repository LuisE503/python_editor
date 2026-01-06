import { useState, useEffect } from "react";

export default function StatusBar({
  code,
  pyodideReady,
  isRunning,
  executionTime,
}) {
  const [stats, setStats] = useState({
    lines: 0,
    characters: 0,
    words: 0,
    functions: 0,
    classes: 0,
    comments: 0,
  });

  useEffect(() => {
    const lines = code.split("\n").length;
    const characters = code.length;
    const words = code.split(/\s+/).filter((w) => w.length > 0).length;
    const functions = (code.match(/def\s+\w+/g) || []).length;
    const classes = (code.match(/class\s+\w+/g) || []).length;
    const comments = (code.match(/#.*$/gm) || []).length;

    setStats({ lines, characters, words, functions, classes, comments });
  }, [code]);

  const getStatusColor = () => {
    if (!pyodideReady) return "text-yellow-400";
    if (isRunning) return "text-blue-400";
    return "text-green-400";
  };

  const getStatusText = () => {
    if (!pyodideReady) return "🟡 Inicializando Python...";
    if (isRunning) return "🔵 Ejecutando código...";
    return "🟢 Listo";
  };

  return (
    <footer
      className="status-bar bg-gray-900 border-t border-gray-800 px-4 py-2 flex items-center justify-between text-xs flex-wrap gap-2"
      role="contentinfo"
      aria-label="Barra de estado"
    >
      {/* Estado de Python */}
      <div className="flex items-center gap-4">
        <div
          className={`flex items-center gap-2 font-semibold ${getStatusColor()}`}
        >
          <span className="status-dot w-2 h-2 rounded-full bg-current"></span>
          <span>{getStatusText()}</span>
        </div>

        {executionTime && (
          <div className="flex items-center gap-1 text-gray-400">
            <span>⏱️</span>
            <span>{executionTime}ms</span>
          </div>
        )}
      </div>

      {/* Estadísticas del código */}
      <div className="flex items-center gap-4 text-gray-400">
        <div
          className="flex items-center gap-1 hover:text-purple-400 transition-colors cursor-help"
          title="Líneas de código"
        >
          <span>📝</span>
          <span>{stats.lines} líneas</span>
        </div>

        <div
          className="flex items-center gap-1 hover:text-purple-400 transition-colors cursor-help"
          title="Caracteres totales"
        >
          <span>✏️</span>
          <span>{stats.characters} caracteres</span>
        </div>

        {stats.functions > 0 && (
          <div
            className="flex items-center gap-1 hover:text-purple-400 transition-colors cursor-help"
            title="Funciones definidas"
          >
            <span>🔧</span>
            <span>{stats.functions} funciones</span>
          </div>
        )}

        {stats.classes > 0 && (
          <div
            className="flex items-center gap-1 hover:text-purple-400 transition-colors cursor-help"
            title="Clases definidas"
          >
            <span>📦</span>
            <span>{stats.classes} clases</span>
          </div>
        )}

        {stats.comments > 0 && (
          <div
            className="flex items-center gap-1 hover:text-purple-400 transition-colors cursor-help"
            title="Comentarios"
          >
            <span>💬</span>
            <span>{stats.comments} comentarios</span>
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="flex items-center gap-4 text-gray-500 text-[10px]">
        <span>Python 3.11</span>
        <span className="hidden md:inline">•</span>
        <span className="hidden md:inline">Pyodide 0.26.2</span>
        <span className="hidden lg:inline">•</span>
        <span className="hidden lg:inline">UTF-8</span>
      </div>
    </footer>
  );
}
