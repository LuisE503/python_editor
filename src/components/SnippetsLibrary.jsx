import React, { useState } from "react";

/**
 * Biblioteca de snippets y templates de código
 * Plantillas rápidas para código común
 */
function SnippetsLibrary({ onInsertSnippet }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const snippets = [
    // Básicos
    {
      id: "func",
      name: "Función básica",
      category: "basico",
      icon: "fa-cube",
      description: "Función con docstring",
      code: `def mi_funcion(parametro):
    """Descripción de la función."""
    return parametro * 2`,
    },
    {
      id: "class",
      name: "Clase básica",
      category: "basico",
      icon: "fa-object-group",
      description: "Clase con constructor",
      code: `class MiClase:
    """Clase de ejemplo."""

    def __init__(self, nombre):
        self.nombre = nombre

    def __str__(self):
        return f"MiClase({self.nombre})"`,
    },
    {
      id: "list_comp",
      name: "List Comprehension",
      category: "basico",
      icon: "fa-list",
      description: "Comprensión de listas",
      code: `resultado = [x * 2 for x in range(10) if x % 2 == 0]`,
    },
    // Visualización
    {
      id: "plot_line",
      name: "Gráfico de líneas",
      category: "visualizacion",
      icon: "fa-chart-line",
      description: "Plot básico con matplotlib",
      code: `import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.figure(figsize=(10, 6))
plt.plot(x, y, linewidth=2)
plt.title('Gráfico de Líneas')
plt.xlabel('X')
plt.ylabel('Y')
plt.grid(True)
plt.show()`,
    },
    {
      id: "plot_scatter",
      name: "Gráfico de dispersión",
      category: "visualizacion",
      icon: "fa-braille",
      description: "Scatter plot con matplotlib",
      code: `import matplotlib.pyplot as plt
import numpy as np

x = np.random.randn(100)
y = np.random.randn(100)
colors = np.random.rand(100)

plt.figure(figsize=(10, 6))
plt.scatter(x, y, c=colors, cmap='viridis', s=100, alpha=0.6)
plt.colorbar(label='Valor')
plt.title('Gráfico de Dispersión')
plt.xlabel('X')
plt.ylabel('Y')
plt.show()`,
    },
    // Algoritmos
    {
      id: "binary_search",
      name: "Búsqueda Binaria",
      category: "algoritmos",
      icon: "fa-search",
      description: "Algoritmo de búsqueda binaria",
      code: `def busqueda_binaria(arr, target):
    """Busca un elemento en un array ordenado."""
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1`,
    },
    {
      id: "quick_sort",
      name: "Quick Sort",
      category: "algoritmos",
      icon: "fa-bolt",
      description: "Algoritmo de ordenamiento rápido",
      code: `def quick_sort(arr):
    """Ordena un array usando Quick Sort."""
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quick_sort(left) + middle + quick_sort(right)`,
    },
    // Estructuras de datos
    {
      id: "linked_list",
      name: "Lista Enlazada",
      category: "estructuras",
      icon: "fa-link",
      description: "Implementación de lista enlazada",
      code: `class Nodo:
    def __init__(self, dato):
        self.dato = dato
        self.siguiente = None

class ListaEnlazada:
    def __init__(self):
        self.cabeza = None

    def agregar(self, dato):
        nuevo_nodo = Nodo(dato)
        if not self.cabeza:
            self.cabeza = nuevo_nodo
        else:
            actual = self.cabeza
            while actual.siguiente:
                actual = actual.siguiente
            actual.siguiente = nuevo_nodo`,
    },
    {
      id: "stack",
      name: "Pila (Stack)",
      category: "estructuras",
      icon: "fa-layer-group",
      description: "Implementación de pila",
      code: `class Pila:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        if not self.is_empty():
            return self.items.pop()

    def peek(self):
        if not self.is_empty():
            return self.items[-1]

    def is_empty(self):
        return len(self.items) == 0

    def size(self):
        return len(self.items)`,
    },
    // Testing
    {
      id: "unittest",
      name: "Test Unitario",
      category: "testing",
      icon: "fa-flask",
      description: "Template de unittest",
      code: `import unittest

class TestMiFuncion(unittest.TestCase):

    def setUp(self):
        """Se ejecuta antes de cada test."""
        pass

    def test_caso_basico(self):
        """Prueba caso básico."""
        resultado = mi_funcion(5)
        self.assertEqual(resultado, 10)

    def test_caso_extremo(self):
        """Prueba caso extremo."""
        resultado = mi_funcion(0)
        self.assertEqual(resultado, 0)

    def tearDown(self):
        """Se ejecuta después de cada test."""
        pass

if __name__ == '__main__':
    unittest.main()`,
    },
    // Decoradores
    {
      id: "timer_decorator",
      name: "Decorador Timer",
      category: "avanzado",
      icon: "fa-stopwatch",
      description: "Decorador para medir tiempo",
      code: `import time
from functools import wraps

def timer(func):
    """Decorador que mide el tiempo de ejecución."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} tardó {end - start:.4f}s")
        return result
    return wrapper

@timer
def mi_funcion():
    time.sleep(1)
    return "Completado"`,
    },
    {
      id: "retry_decorator",
      name: "Decorador Retry",
      category: "avanzado",
      icon: "fa-redo",
      description: "Decorador para reintentos",
      code: `from functools import wraps
import time

def retry(max_attempts=3, delay=1):
    """Decorador que reintenta una función si falla."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    print(f"Intento {attempt + 1} falló: {e}")
                    time.sleep(delay)
        return wrapper
    return decorator`,
    },
  ];

  const categories = [
    { id: "all", name: "Todos", icon: "fa-th" },
    { id: "basico", name: "Básicos", icon: "fa-seedling" },
    { id: "visualizacion", name: "Visualización", icon: "fa-chart-bar" },
    { id: "algoritmos", name: "Algoritmos", icon: "fa-code" },
    { id: "estructuras", name: "Estructuras", icon: "fa-project-diagram" },
    { id: "testing", name: "Testing", icon: "fa-flask" },
    { id: "avanzado", name: "Avanzado", icon: "fa-rocket" },
  ];

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesCategory =
      selectedCategory === "all" || snippet.category === selectedCategory;
    const matchesSearch =
      snippet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleInsert = (code) => {
    onInsertSnippet(code);
    setIsOpen(false);
    if (window.showToast) {
      window.showToast("Snippet insertado correctamente", "success");
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg
                   hover:from-orange-700 hover:to-amber-700 transition-all duration-200
                   flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
        title="Biblioteca de Snippets"
      >
        <i className="fas fa-magic"></i>
        <span>Snippets</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <i className="fas fa-magic"></i> Biblioteca de Snippets
              </h2>
              <p className="text-orange-100 text-sm">
                Plantillas de código listas para usar
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

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar snippets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl
                       text-white placeholder-orange-200 border border-white border-opacity-30
                       focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
            <svg
              className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-200"
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
          </div>
        </div>

        {/* Categories */}
        <div className="px-6 py-4 bg-gray-800 border-b border-gray-700 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
                  ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
              >
                <i className={`fas ${category.icon}`}></i>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Snippets Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSnippets.map((snippet) => (
              <div
                key={snippet.id}
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700
                         hover:border-orange-500 transition-all duration-200 group"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl text-orange-400">
                        <i className={`fas ${snippet.icon}`}></i>
                      </span>
                      <div>
                        <h3 className="text-white font-bold">{snippet.name}</h3>
                        <p className="text-gray-400 text-sm">
                          {snippet.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <pre
                    className="bg-gray-950 text-green-400 p-3 rounded-lg overflow-x-auto text-xs mb-3
                               font-mono max-h-32"
                  >
                    {snippet.code}
                  </pre>

                  <button
                    onClick={() => handleInsert(snippet.code)}
                    className="w-full py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg
                             hover:from-orange-700 hover:to-amber-700 transition-all duration-200
                             flex items-center justify-center gap-2 font-medium"
                  >
                    <span>Insertar</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 border-t border-gray-700 px-6 py-4 text-center text-gray-400 text-sm">
          <p>
            💡 Tip: Los snippets se insertarán en la posición actual del cursor
          </p>
        </div>
      </div>
    </div>
  );
}

export default SnippetsLibrary;
