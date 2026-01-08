import React, { useState, useEffect, useRef } from "react";

/**
 * Terminal REPL interactivo para Python
 * Permite ejecutar comandos Python línea por línea
 */
function InteractiveREPL({ pyodideReady, onExecuteCode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = async (command) => {
    if (!command.trim()) return;

    // Añadir comando al historial
    setHistory((prev) => [...prev, { type: "input", content: command }]);
    setCommandHistory((prev) => [...prev, command]);
    setHistoryIndex(-1);
    setCurrentInput("");

    try {
      // Comandos especiales
      if (command.trim() === "clear") {
        setHistory([]);
        return;
      }

      if (command.trim() === "help") {
        setHistory((prev) => [
          ...prev,
          {
            type: "output",
            content: `Comandos disponibles:
  clear     - Limpia la terminal
  help      - Muestra esta ayuda
  history   - Muestra historial de comandos

Ejecuta cualquier código Python:
  >>> 2 + 2
  >>> import math; math.pi
  >>> [x**2 for x in range(10)]`,
          },
        ]);
        return;
      }

      if (command.trim() === "history") {
        setHistory((prev) => [
          ...prev,
          {
            type: "output",
            content: commandHistory
              .map((cmd, i) => `${i + 1}. ${cmd}`)
              .join("\n"),
          },
        ]);
        return;
      }

      // Ejecutar código Python
      const result = await onExecuteCode(command);

      if (result.success) {
        let output = result.output || "";
        if (
          result.result !== undefined &&
          result.result !== null &&
          result.result !== "None"
        ) {
          output = result.result;
        }
        if (output) {
          setHistory((prev) => [...prev, { type: "output", content: output }]);
        }
      } else {
        setHistory((prev) => [
          ...prev,
          { type: "error", content: result.error || result.output },
        ]);
      }
    } catch (error) {
      setHistory((prev) => [
        ...prev,
        { type: "error", content: error.message },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      executeCommand(currentInput);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput("");
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        disabled={!pyodideReady}
        className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg
                   hover:from-green-700 hover:to-teal-700 transition-all duration-200
                   flex items-center gap-2 font-medium shadow-lg hover:shadow-xl disabled:opacity-50"
        title="Abrir terminal REPL"
      >
        <i className="fas fa-terminal"></i>
        <span>Terminal</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col border-2 border-green-500">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div>
              <h3 className="text-xl font-bold">
                <i className="fas fa-terminal"></i> Python REPL
              </h3>
              <p className="text-xs text-green-100">Terminal Interactivo</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHistory([])}
              className="px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-sm transition-all"
              title="Limpiar terminal (Ctrl+L)"
            >
              Limpiar
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
              title="Cerrar"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Terminal Content */}
        <div
          ref={terminalRef}
          className="flex-1 overflow-y-auto bg-gray-950 p-4 font-mono text-sm"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Welcome Message */}
          {history.length === 0 && (
            <div className="text-green-400 mb-4">
              <p>Python 3.11.0 (Pyodide) - PyHub IDE Terminal</p>
              <p>Escribe 'help' para ayuda, 'clear' para limpiar</p>
              <p className="text-gray-500 text-xs mt-2">
                Atajos: ↑/↓ (historial), Ctrl+L (limpiar), Enter (ejecutar)
              </p>
            </div>
          )}

          {/* Command History */}
          {history.map((entry, index) => (
            <div key={index} className="mb-2">
              {entry.type === "input" ? (
                <div className="flex gap-2">
                  <span className="text-green-400 font-bold">{">>>"}</span>
                  <span className="text-white flex-1 break-all">
                    {entry.content}
                  </span>
                </div>
              ) : entry.type === "error" ? (
                <div className="text-red-400 pl-6 whitespace-pre-wrap break-all">
                  {entry.content}
                </div>
              ) : (
                <div className="text-blue-300 pl-6 whitespace-pre-wrap break-all">
                  {entry.content}
                </div>
              )}
            </div>
          ))}

          {/* Current Input */}
          <div className="flex gap-2 items-start">
            <span className="text-green-400 font-bold pt-0.5">{">>>"}</span>
            <textarea
              ref={inputRef}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-white outline-none resize-none border-none"
              placeholder="Escribe código Python..."
              rows={1}
              style={{
                minHeight: "1.5rem",
                maxHeight: "10rem",
                overflow: "auto",
              }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />
          </div>

          {/* Blinking Cursor */}
          <span className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-1"></span>
        </div>

        {/* Footer with Tips */}
        <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 border-t border-gray-700">
          <div className="flex flex-wrap gap-4">
            <span>
              💡 <strong>Enter:</strong> Ejecutar
            </span>
            <span>
              💡 <strong>↑/↓:</strong> Historial
            </span>
            <span>
              💡 <strong>Ctrl+L:</strong> Limpiar
            </span>
            <span>
              💡 Tip: Prueba con{" "}
              <code className="bg-gray-900 px-1 rounded">import this</code>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InteractiveREPL;
