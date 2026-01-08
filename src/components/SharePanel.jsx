import React, { useState, useEffect } from "react";

/**
 * Sistema de compartir código con generación de URL
 */
function SharePanel({ code, onLoadCode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [shareMethod, setShareMethod] = useState("url"); // 'url', 'gist', 'qr'

  const generateShareUrl = () => {
    try {
      // Comprimir y codificar el código
      const compressed = btoa(encodeURIComponent(code));
      const url = `${window.location.origin}${window.location.pathname}?code=${compressed}`;
      setShareUrl(url);
    } catch (error) {
      console.error("Error generating share URL:", error);
      setShareUrl("Error: Código demasiado largo");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "code.py";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (isOpen) {
      generateShareUrl();
    }
  }, [isOpen, code]);

  // Cargar código desde URL al montar
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get("code");
    if (codeParam) {
      try {
        const decoded = decodeURIComponent(atob(codeParam));
        onLoadCode(decoded);
        // Limpiar URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      } catch (error) {
        console.error("Error loading shared code:", error);
      }
    }
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg
                   hover:from-blue-700 hover:to-cyan-700 transition-all duration-200
                   flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
        title="Compartir código"
      >
        <span>🔗</span>
        <span>Compartir</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                <i className="fas fa-share-alt"></i> Compartir Código
              </h2>
              <p className="text-blue-100 text-sm">
                Comparte tu trabajo con otros
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Share Method Tabs */}
          <div className="flex gap-2 bg-gray-800 p-2 rounded-lg">
            <button
              onClick={() => setShareMethod("url")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                shareMethod === "url"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              🔗 URL
            </button>
            <button
              onClick={() => setShareMethod("download")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                shareMethod === "download"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              💾 Descargar
            </button>
            <button
              onClick={() => setShareMethod("embed")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                shareMethod === "embed"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              📋 Código
            </button>
          </div>

          {/* URL Share */}
          {shareMethod === "url" && (
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <span>🔗</span>
                  <span>Enlace para Compartir</span>
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  Copia este enlace para compartir tu código. El código está
                  codificado en la URL.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600
                             font-mono text-sm"
                  />
                  <button
                    onClick={copyToClipboard}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      copied
                        ? "bg-green-600 text-white"
                        : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
                    }`}
                  >
                    {copied ? "✓ Copiado" : "Copiar"}
                  </button>
                </div>
              </div>

              {shareUrl.includes("Error") && (
                <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-3">
                  <p className="text-red-400 text-sm">
                    ⚠️ El código es demasiado largo para compartir por URL.
                    Prueba descargarlo o usar otro método.
                  </p>
                </div>
              )}

              <div className="bg-blue-500 bg-opacity-10 border border-blue-500 rounded-lg p-3">
                <p className="text-blue-300 text-sm">
                  💡 <strong>Tip:</strong> Cualquiera con este enlace podrá ver
                  y ejecutar tu código.
                </p>
              </div>
            </div>
          )}

          {/* Download */}
          {shareMethod === "download" && (
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <span>💾</span>
                  <span>Descargar Código</span>
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Descarga tu código como archivo .py para usarlo localmente.
                </p>
                <button
                  onClick={downloadCode}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg
                           hover:from-blue-700 hover:to-cyan-700 transition-all duration-200
                           flex items-center justify-center gap-2 font-medium shadow-lg"
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span>Descargar code.py</span>
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="text-white font-medium text-sm">
                  📊 Estadísticas del Código
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-400">
                      {code.split("\n").length}
                    </p>
                    <p className="text-xs text-gray-400">Líneas</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-cyan-400">
                      {code.length}
                    </p>
                    <p className="text-xs text-gray-400">Caracteres</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-400">
                      {(code.length / 1024).toFixed(1)}KB
                    </p>
                    <p className="text-xs text-gray-400">Tamaño</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Embed Code */}
          {shareMethod === "embed" && (
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <span>📋</span>
                  <span>Ver Código</span>
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  Copia el código para compartirlo en foros, documentación o
                  tutoriales.
                </p>
                <div className="relative">
                  <pre className="bg-gray-950 text-green-400 p-4 rounded-lg overflow-auto max-h-64 text-sm font-mono">
                    {code || "# Sin código"}
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(code);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="absolute top-2 right-2 px-3 py-1 bg-blue-600 hover:bg-blue-700
                             text-white text-xs rounded-lg transition-all"
                  >
                    {copied ? "✓ Copiado" : "Copiar"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Social Share Buttons */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <span>📱</span>
              <span>Compartir en Redes</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?text=Mira mi código Python&url=${encodeURIComponent(
                      shareUrl
                    )}`,
                    "_blank"
                  )
                }
                className="py-2 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-all
                         flex items-center justify-center gap-2 font-medium"
              >
                <span>𝕏</span>
                <span>Twitter</span>
              </button>
              <button
                onClick={() =>
                  window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      shareUrl
                    )}`,
                    "_blank"
                  )
                }
                className="py-2 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-all
                         flex items-center justify-center gap-2 font-medium"
              >
                <span>in</span>
                <span>LinkedIn</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 border-t border-gray-700 px-6 py-4 text-center text-gray-400 text-sm">
          <p>💡 Tip: Los enlaces compartidos contienen el código completo</p>
        </div>
      </div>
    </div>
  );
}

export default SharePanel;
