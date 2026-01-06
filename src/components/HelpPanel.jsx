import React, { useState } from 'react';

/**
 * Panel de ayuda rápida y documentación
 * Muestra referencia rápida de Python
 */
function HelpPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('shortcuts');

  const shortcuts = [
    { keys: 'Ctrl + Enter', description: 'Ejecutar código' },
    { keys: 'Ctrl + S', description: 'Guardar (auto-guardado)' },
    { keys: 'Ctrl + Z', description: 'Deshacer' },
    { keys: 'Ctrl + Y', description: 'Rehacer' },
    { keys: 'Ctrl + D', description: 'Duplicar línea' },
    { keys: 'Ctrl + /', description: 'Comentar/descomentar' },
    { keys: 'Ctrl + F', description: 'Buscar' },
    { keys: 'Ctrl + H', description: 'Buscar y reemplazar' },
    { keys: 'Alt + ↑/↓', description: 'Mover línea' },
    { keys: 'Ctrl + Space', description: 'Autocompletado' },
    { keys: 'F1', description: 'Paleta de comandos' },
    { keys: 'Tab', description: 'Indentar' },
    { keys: 'Shift + Tab', description: 'Desindentar' }
  ];

  const pythonReference = [
    {
      category: 'Tipos de Datos',
      items: [
        { name: 'int', example: 'x = 42', description: 'Entero' },
        { name: 'float', example: 'x = 3.14', description: 'Decimal' },
        { name: 'str', example: 'x = "hola"', description: 'Cadena' },
        { name: 'bool', example: 'x = True', description: 'Booleano' },
        { name: 'list', example: 'x = [1, 2, 3]', description: 'Lista mutable' },
        { name: 'tuple', example: 'x = (1, 2, 3)', description: 'Tupla inmutable' },
        { name: 'dict', example: "x = {'a': 1}", description: 'Diccionario' },
        { name: 'set', example: 'x = {1, 2, 3}', description: 'Conjunto' }
      ]
    },
    {
      category: 'Funciones Comunes',
      items: [
        { name: 'print()', example: 'print("Hola")', description: 'Imprimir' },
        { name: 'input()', example: 'x = input()', description: 'Entrada' },
        { name: 'len()', example: 'len([1,2,3])', description: 'Longitud' },
        { name: 'range()', example: 'range(10)', description: 'Secuencia' },
        { name: 'type()', example: 'type(x)', description: 'Tipo' },
        { name: 'int()', example: 'int("42")', description: 'Convertir a int' },
        { name: 'str()', example: 'str(42)', description: 'Convertir a str' },
        { name: 'list()', example: 'list(range(5))', description: 'Convertir a lista' }
      ]
    },
    {
      category: 'Métodos de String',
      items: [
        { name: '.upper()', example: '"hola".upper()', description: 'Mayúsculas' },
        { name: '.lower()', example: '"HOLA".lower()', description: 'Minúsculas' },
        { name: '.strip()', example: '" hola ".strip()', description: 'Quitar espacios' },
        { name: '.split()', example: '"a,b".split(",")', description: 'Dividir' },
        { name: '.join()', example: '",".join(lista)', description: 'Unir' },
        { name: '.replace()', example: '"ab".replace("a","x")', description: 'Reemplazar' },
        { name: '.find()', example: '"hola".find("o")', description: 'Buscar índice' },
        { name: '.format()', example: '"Hola {}".format("mundo")', description: 'Formatear' }
      ]
    },
    {
      category: 'Métodos de Lista',
      items: [
        { name: '.append()', example: 'lista.append(x)', description: 'Añadir al final' },
        { name: '.insert()', example: 'lista.insert(0, x)', description: 'Insertar en índice' },
        { name: '.remove()', example: 'lista.remove(x)', description: 'Quitar elemento' },
        { name: '.pop()', example: 'lista.pop()', description: 'Quitar y devolver' },
        { name: '.sort()', example: 'lista.sort()', description: 'Ordenar' },
        { name: '.reverse()', example: 'lista.reverse()', description: 'Invertir' },
        { name: '.index()', example: 'lista.index(x)', description: 'Buscar índice' },
        { name: '.count()', example: 'lista.count(x)', description: 'Contar' }
      ]
    }
  ];

  const tips = [
    {
      icon: '🚀',
      title: 'F-strings para formatear',
      code: 'f"Hola {nombre}, tienes {edad} años"',
      description: 'Usa f-strings para formatear cadenas de forma elegante'
    },
    {
      icon: '📦',
      title: 'Desempaquetado de listas',
      code: 'a, b, *resto = [1, 2, 3, 4, 5]',
      description: 'Desempaqueta elementos fácilmente'
    },
    {
      icon: '🔄',
      title: 'Enumerate para índices',
      code: 'for i, val in enumerate(lista):',
      description: 'Obtén índice y valor en bucles'
    },
    {
      icon: '📋',
      title: 'Zip para combinar listas',
      code: 'for a, b in zip(lista1, lista2):',
      description: 'Itera sobre múltiples listas simultáneamente'
    },
    {
      icon: '✨',
      title: 'Operador walrus :=',
      code: 'if (n := len(lista)) > 10:',
      description: 'Asigna y usa en la misma expresión'
    },
    {
      icon: '🎯',
      title: 'Diccionario con get()',
      code: 'valor = d.get("clave", "default")',
      description: 'Obtén valor con fallback'
    }
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg 
                   hover:from-emerald-700 hover:to-green-700 transition-all duration-200 
                   flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
        title="Ayuda y documentación"
      >
        <span>❓</span>
        <span>Ayuda</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">❓ Ayuda y Referencia</h2>
              <p className="text-emerald-100 text-sm">Atajos, referencia rápida y tips de Python</p>
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

        {/* Tabs */}
        <div className="flex bg-gray-800 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`flex-1 py-3 px-4 font-medium transition-all ${
              activeTab === 'shortcuts'
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            ⌨️ Atajos
          </button>
          <button
            onClick={() => setActiveTab('reference')}
            className={`flex-1 py-3 px-4 font-medium transition-all ${
              activeTab === 'reference'
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            📖 Referencia
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`flex-1 py-3 px-4 font-medium transition-all ${
              activeTab === 'tips'
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            💡 Tips
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Shortcuts Tab */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white mb-4">⌨️ Atajos de Teclado</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-800 rounded-lg p-3 border border-gray-700">
                    <span className="text-gray-300">{shortcut.description}</span>
                    <kbd className="bg-gray-700 text-emerald-400 px-3 py-1 rounded-lg font-mono text-sm">
                      {shortcut.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reference Tab */}
          {activeTab === 'reference' && (
            <div className="space-y-6">
              {pythonReference.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <h3 className="text-xl font-bold text-white mb-3">{section.category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-emerald-400 font-mono font-bold">{item.name}</span>
                          <span className="text-gray-400 text-xs">{item.description}</span>
                        </div>
                        <code className="text-gray-300 text-sm font-mono bg-gray-900 px-2 py-1 rounded block">
                          {item.example}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tips Tab */}
          {activeTab === 'tips' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-4">💡 Tips de Python</h3>
              {tips.map((tip, index) => (
                <div key={index} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{tip.icon}</span>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-1">{tip.title}</h4>
                      <p className="text-gray-400 text-sm mb-2">{tip.description}</p>
                      <code className="bg-gray-900 text-emerald-400 px-3 py-2 rounded-lg font-mono text-sm block">
                        {tip.code}
                      </code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-800 border-t border-gray-700 px-6 py-4 text-center text-gray-400 text-sm">
          <p>💡 Tip: Usa Ctrl+Space en el editor para ver autocompletado</p>
        </div>
      </div>
    </div>
  );
}

export default HelpPanel;
