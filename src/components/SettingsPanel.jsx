import React, { useState } from "react";

/**
 * Panel de configuración y personalización del IDE
 */
function SettingsPanel({ settings, onSettingsChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    {
      id: "vs-dark",
      name: "Dark (VS Code)",
      preview: "linear-gradient(135deg, #1e1e1e 0%, #2d2d30 100%)",
    },
    {
      id: "vs-light",
      name: "Light",
      preview: "linear-gradient(135deg, #ffffff 0%, #f3f3f3 100%)",
    },
    {
      id: "hc-black",
      name: "High Contrast",
      preview: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
    },
    {
      id: "monokai",
      name: "Monokai",
      preview: "linear-gradient(135deg, #272822 0%, #3e3d32 100%)",
    },
  ];

  const fontSizes = [10, 12, 14, 16, 18, 20, 22, 24];

  const handleChange = (key, value) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg
                   hover:from-pink-700 hover:to-rose-700 transition-all duration-200
                   flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
        title="Configuración"
      >
        <i className="fas fa-cog"></i>
        <span>Ajustes</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                <i className="fas fa-cog"></i> Configuración
              </h2>
              <p className="text-pink-100 text-sm">
                Personaliza tu experiencia
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
              title="Cerrar"
            >
              <svg
                className="w-6 h-6"
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

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Editor Theme */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <i className="fas fa-palette"></i>
              <span>Tema del Editor</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleChange("theme", theme.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    settings.theme === theme.id
                      ? "border-pink-500 bg-gray-700"
                      : "border-gray-600 bg-gray-750 hover:border-gray-500"
                  }`}
                >
                  <div
                    className="w-full h-12 rounded-lg mb-2"
                    style={{ background: theme.preview }}
                  ></div>
                  <p className="text-white text-sm font-medium text-center">
                    {theme.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🔤</span>
              <span>Tamaño de Fuente</span>
            </h3>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="10"
                max="24"
                step="2"
                value={settings.fontSize || 14}
                onChange={(e) =>
                  handleChange("fontSize", parseInt(e.target.value))
                }
                className="flex-1 accent-pink-500"
              />
              <span className="text-white font-mono text-lg bg-gray-700 px-4 py-2 rounded-lg min-w-[60px] text-center">
                {settings.fontSize || 14}px
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Ajusta el tamaño del texto en el editor
            </p>
          </div>

          {/* Auto Save */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>💾</span>
              <span>Guardado Automático</span>
            </h3>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.autoSave || false}
                  onChange={(e) => handleChange("autoSave", e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-14 h-8 rounded-full transition-all duration-200 ${
                    settings.autoSave ? "bg-pink-500" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-200 mt-1 ${
                      settings.autoSave ? "translate-x-7" : "translate-x-1"
                    }`}
                  ></div>
                </div>
              </div>
              <span className="text-white text-lg">
                {settings.autoSave ? "Activado" : "Desactivado"}
              </span>
            </label>
            <p className="text-gray-400 text-sm mt-2">
              Guarda tu código automáticamente en localStorage
            </p>
          </div>

          {/* Word Wrap */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>📏</span>
              <span>Ajuste de Línea</span>
            </h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.wordWrap !== "off"}
                  onChange={(e) =>
                    handleChange("wordWrap", e.target.checked ? "on" : "off")
                  }
                  className="sr-only"
                />
                <div
                  className={`w-14 h-8 rounded-full transition-all duration-200 ${
                    settings.wordWrap !== "off" ? "bg-pink-500" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-200 mt-1 ${
                      settings.wordWrap !== "off"
                        ? "translate-x-7"
                        : "translate-x-1"
                    }`}
                  ></div>
                </div>
              </div>
              <span className="text-white text-lg">
                {settings.wordWrap !== "off" ? "Activado" : "Desactivado"}
              </span>
            </label>
            <p className="text-gray-400 text-sm mt-2">
              Ajusta automáticamente las líneas largas
            </p>
          </div>

          {/* Minimap */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🗺️</span>
              <span>Minimapa</span>
            </h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.minimap || false}
                  onChange={(e) => handleChange("minimap", e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-14 h-8 rounded-full transition-all duration-200 ${
                    settings.minimap ? "bg-pink-500" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-200 mt-1 ${
                      settings.minimap ? "translate-x-7" : "translate-x-1"
                    }`}
                  ></div>
                </div>
              </div>
              <span className="text-white text-lg">
                {settings.minimap ? "Visible" : "Oculto"}
              </span>
            </label>
            <p className="text-gray-400 text-sm mt-2">
              Muestra un minimapa del código a la derecha
            </p>
          </div>

          {/* Line Numbers */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🔢</span>
              <span>Números de Línea</span>
            </h3>
            <select
              value={settings.lineNumbers || "on"}
              onChange={(e) => handleChange("lineNumbers", e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600
                       focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="on">Mostrar</option>
              <option value="off">Ocultar</option>
              <option value="relative">Relativos</option>
            </select>
            <p className="text-gray-400 text-sm mt-2">
              Configura cómo se muestran los números de línea
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 border-t border-gray-700 p-4 flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            💡 Los cambios se aplican instantáneamente
          </p>
          <button
            onClick={() => setIsOpen(false)}
            className="px-6 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg
                     hover:from-pink-700 hover:to-rose-700 transition-all duration-200 font-medium shadow-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;
