import React, { useState, useEffect } from "react";

/**
 * Paleta de comandos rápidos (Command Palette)
 * Acceso rápido a todas las funciones con Ctrl+K
 */
function CommandPalette({
  onRunCode,
  onRunTests,
  onOpenExamples,
  onOpenREPL,
  onOpenSettings,
  onOpenShare,
  onOpenAnalyzer,
  onClearOutput,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const commands = [
    {
      id: "run",
      name: "Ejecutar Código",
      icon: "▶️",
      shortcut: "Ctrl+Enter",
      action: () => {
        onRunCode();
        setIsOpen(false);
      },
      category: "Ejecución",
    },
    {
      id: "tests",
      name: "Ejecutar Tests",
      icon: "🧪",
      shortcut: "Ctrl+Shift+T",
      action: () => {
        onRunTests();
        setIsOpen(false);
      },
      category: "Ejecución",
    },
    {
      id: "examples",
      name: "Abrir Galería de Ejemplos",
      icon: "📚",
      shortcut: "Ctrl+E",
      action: () => {
        onOpenExamples();
        setIsOpen(false);
      },
      category: "Navegación",
    },
    {
      id: "repl",
      name: "Abrir Terminal REPL",
      icon: "💻",
      shortcut: "Ctrl+`",
      action: () => {
        onOpenREPL();
        setIsOpen(false);
      },
      category: "Herramientas",
    },
    {
      id: "settings",
      name: "Configuración",
      icon: "⚙️",
      shortcut: "Ctrl+,",
      action: () => {
        onOpenSettings();
        setIsOpen(false);
      },
      category: "Preferencias",
    },
    {
      id: "share",
      name: "Compartir Código",
      icon: "🔗",
      shortcut: "Ctrl+Shift+S",
      action: () => {
        onOpenShare();
        setIsOpen(false);
      },
      category: "Compartir",
    },
    {
      id: "analyzer",
      name: "Analizar Código",
      icon: "📊",
      shortcut: "Ctrl+Shift+A",
      action: () => {
        onOpenAnalyzer();
        setIsOpen(false);
      },
      category: "Herramientas",
    },
    {
      id: "clear",
      name: "Limpiar Salida",
      icon: "🗑️",
      shortcut: "Ctrl+L",
      action: () => {
        onClearOutput();
        setIsOpen(false);
      },
      category: "Ejecución",
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+K o Cmd+K para abrir
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        setSearch("");
      }
      // Escape para cerrar
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.name.toLowerCase().includes(search.toLowerCase()) ||
      cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = [];
    }
    acc[cmd.category].push(cmd);
    return acc;
  }, {});

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 pt-20"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <svg
              className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Buscar comandos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className="w-full pl-12 pr-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-600
                       focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
            />
            <kbd
              className="absolute right-4 top-1/2 transform -translate-y-1/2 px-2 py-1
                         bg-gray-700 text-gray-300 text-xs rounded border border-gray-600"
            >
              ESC
            </kbd>
          </div>
        </div>

        {/* Commands List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {Object.keys(groupedCommands).length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No se encontraron comandos</p>
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, cmds]) => (
              <div key={category} className="mb-3">
                <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {category}
                </div>
                {cmds.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={cmd.action}
                    className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-800 rounded-lg
                             transition-all group"
                  >
                    <span className="text-2xl">{cmd.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="text-white font-medium">{cmd.name}</div>
                    </div>
                    {cmd.shortcut && (
                      <kbd
                        className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-700
                                   group-hover:bg-gray-700"
                      >
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-800 border-t border-gray-700 px-4 py-3 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">↓</kbd>
              Navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">Enter</kbd>
              Ejecutar
            </span>
          </div>
          <span className="flex items-center gap-1">
            Abre con
            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">Ctrl+K</kbd>
          </span>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
