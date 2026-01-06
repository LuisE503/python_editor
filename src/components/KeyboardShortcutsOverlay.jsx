import { useState, useEffect } from "react";

export default function KeyboardShortcutsOverlay() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Mostrar overlay con Ctrl+Shift+?
      if (e.ctrlKey && e.shiftKey && e.key === "?") {
        e.preventDefault();
        setIsVisible(true);
      }
      // Ocultar con Escape
      if (e.key === "Escape" && isVisible) {
        setIsVisible(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  const shortcuts = [
    {
      category: "🎯 Ejecución",
      items: [
        { keys: ["Ctrl", "Enter"], description: "Ejecutar código" },
        { keys: ["Ctrl", "Shift", "T"], description: "Ejecutar tests" },
        { keys: ["Ctrl", "Shift", "R"], description: "Reiniciar Python" },
      ],
    },
    {
      category: "⌨️ Edición",
      items: [
        { keys: ["Ctrl", "S"], description: "Guardar (automático)" },
        { keys: ["Ctrl", "Z"], description: "Deshacer" },
        { keys: ["Ctrl", "Y"], description: "Rehacer" },
        { keys: ["Ctrl", "/"], description: "Comentar línea" },
        { keys: ["Alt", "↑"], description: "Mover línea arriba" },
        { keys: ["Alt", "↓"], description: "Mover línea abajo" },
        { keys: ["Ctrl", "D"], description: "Seleccionar siguiente" },
        { keys: ["Ctrl", "Shift", "K"], description: "Eliminar línea" },
      ],
    },
    {
      category: "🔍 Búsqueda",
      items: [
        { keys: ["Ctrl", "F"], description: "Buscar" },
        { keys: ["Ctrl", "H"], description: "Buscar y reemplazar" },
        { keys: ["Ctrl", "G"], description: "Ir a línea" },
      ],
    },
    {
      category: "🚀 Navegación",
      items: [
        { keys: ["Ctrl", "K"], description: "Paleta de comandos" },
        { keys: ["Ctrl", "Shift", "?"], description: "Mostrar atajos" },
        { keys: ["Esc"], description: "Cerrar panel/diálogo" },
      ],
    },
    {
      category: "💻 REPL",
      items: [
        { keys: ["Ctrl", "L"], description: "Limpiar REPL" },
        { keys: ["↑"], description: "Historial anterior" },
        { keys: ["↓"], description: "Historial siguiente" },
      ],
    },
    {
      category: "⚙️ Editor",
      items: [
        { keys: ["Tab"], description: "Indentar" },
        { keys: ["Shift", "Tab"], description: "Desindentar" },
        { keys: ["Ctrl", "Space"], description: "Autocompletado" },
        { keys: ["Ctrl", "]"], description: "Aumentar indentación" },
        { keys: ["Ctrl", "["], description: "Reducir indentación" },
      ],
    },
  ];

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm"
      onClick={() => setIsVisible(false)}
      role="dialog"
      aria-labelledby="shortcuts-title"
      aria-modal="true"
    >
      <div
        className="bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border-2 border-purple-600"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2
              id="shortcuts-title"
              className="text-2xl font-bold text-white flex items-center gap-3"
            >
              <span className="text-3xl">⌨️</span>
              Atajos de Teclado
            </h2>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all transform hover:scale-110"
              aria-label="Cerrar"
            >
              <span className="text-2xl">✕</span>
            </button>
          </div>
          <p className="text-purple-100 mt-2">
            Presiona{" "}
            <kbd className="px-2 py-1 bg-white bg-opacity-20 rounded text-sm font-mono">
              Ctrl+Shift+?
            </kbd>{" "}
            para mostrar/ocultar esta ventana
          </p>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shortcuts.map((group, groupIdx) => (
            <div
              key={groupIdx}
              className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-purple-600 transition-all"
            >
              <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                {group.category}
              </h3>
              <div className="space-y-3">
                {group.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="flex items-center justify-between gap-3 p-2 hover:bg-gray-750 rounded-lg transition-colors"
                  >
                    <span className="text-gray-300 text-sm flex-1">
                      {item.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((key, keyIdx) => (
                        <span key={keyIdx}>
                          <kbd className="px-2 py-1 bg-gray-900 border border-gray-600 rounded text-xs font-mono text-purple-300 whitespace-nowrap shadow-sm">
                            {key}
                          </kbd>
                          {keyIdx < item.keys.length - 1 && (
                            <span className="text-gray-500 mx-1">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 p-4 rounded-b-2xl">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <span>💡</span>
            <span>Tip: La mayoría de atajos funcionan igual que VS Code</span>
          </div>
        </div>
      </div>
    </div>
  );
}
