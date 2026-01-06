import React, { useState, useEffect } from "react";

/**
 * Componente de galería interactiva de ejemplos
 * Muestra ejemplos categorizados con preview y descripción
 */
function ExamplesGallery({ onLoadExample, isRunning }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const examples = [
    {
      name: "Hola Mundo",
      file: "hello_world.py",
      category: "basico",
      icon: "👋",
      description:
        "Tu primer programa Python con variables, funciones y bucles",
      difficulty: "Principiante",
      time: "2 min",
    },
    {
      name: "Fibonacci",
      file: "fibonacci.py",
      category: "basico",
      icon: "🔢",
      description: "Secuencia de Fibonacci con métodos iterativo y recursivo",
      difficulty: "Principiante",
      time: "5 min",
    },
    {
      name: "Tests Unitarios",
      file: "tests_example.py",
      category: "testing",
      icon: "🧪",
      description: "Ejemplos de testing con unittest framework",
      difficulty: "Intermedio",
      time: "5 min",
    },
    {
      name: "Visualización de Datos",
      file: "data_visualization.py",
      category: "datascience",
      icon: "📊",
      description:
        "Gráficos impresionantes con matplotlib: líneas, barras, dispersión y más",
      difficulty: "Intermedio",
      time: "8 min",
    },
    {
      name: "Arte y Animaciones",
      file: "animations.py",
      category: "visual",
      icon: "🎨",
      description:
        "Arte generativo: espirales de Fibonacci, fractales de Mandelbrot y patrones",
      difficulty: "Avanzado",
      time: "10 min",
    },
    {
      name: "Algoritmos Clásicos",
      file: "algorithms.py",
      category: "algoritmos",
      icon: "🧮",
      description:
        "Algoritmos de ordenamiento, búsqueda, Dijkstra y Torres de Hanoi",
      difficulty: "Intermedio",
      time: "10 min",
    },
    {
      name: "Machine Learning",
      file: "machine_learning.py",
      category: "ml",
      icon: "🤖",
      description:
        "ML desde cero: regresión, clustering, redes neuronales y KNN",
      difficulty: "Avanzado",
      time: "12 min",
    },
    {
      name: "Juegos Interactivos",
      file: "games.py",
      category: "juegos",
      icon: "🎮",
      description:
        "Juegos clásicos: Game of Life, Sudoku, laberintos y Tic-Tac-Toe AI",
      difficulty: "Avanzado",
      time: "15 min",
    },
    {
      name: "Criptografía",
      file: "cryptography.py",
      category: "seguridad",
      icon: "🔐",
      description:
        "Hashing, cifrado César, XOR, generador de contraseñas y más",
      difficulty: "Intermedio",
      time: "10 min",
    },
    {
      name: "Web Scraping y APIs",
      file: "web_scraping.py",
      category: "web",
      icon: "🌐",
      description:
        "Extracción de datos, parseo HTML, APIs REST y procesamiento JSON",
      difficulty: "Avanzado",
      time: "10 min",
    },
    {
      name: "Web Automation",
      file: "web_automation.py",
      category: "web",
      icon: "🤖",
      description:
        "Automatización web avanzada: login, formularios, paginación y screenshots",
      difficulty: "Avanzado",
      time: "12 min",
    },
    {
      name: "Estructuras de Datos Avanzadas",
      file: "data_structures_advanced.py",
      category: "algoritmos",
      icon: "🏗️",
      description: "Trie, Union-Find, Segment Tree, LRU Cache y Skip List",
      difficulty: "Avanzado",
      time: "12 min",
    },
  ];

  const categories = [
    { id: "all", name: "Todos", icon: "📚", count: examples.length },
    {
      id: "basico",
      name: "Básico",
      icon: "🌱",
      count: examples.filter((e) => e.category === "basico").length,
    },
    {
      id: "datascience",
      name: "Data Science",
      icon: "📊",
      count: examples.filter((e) => e.category === "datascience").length,
    },
    {
      id: "visual",
      name: "Visual",
      icon: "🎨",
      count: examples.filter((e) => e.category === "visual").length,
    },
    {
      id: "algoritmos",
      name: "Algoritmos",
      icon: "🧮",
      count: examples.filter((e) => e.category === "algoritmos").length,
    },
    {
      id: "ml",
      name: "Machine Learning",
      icon: "🤖",
      count: examples.filter((e) => e.category === "ml").length,
    },
    {
      id: "juegos",
      name: "Juegos",
      icon: "🎮",
      count: examples.filter((e) => e.category === "juegos").length,
    },
    {
      id: "testing",
      name: "Testing",
      icon: "🧪",
      count: examples.filter((e) => e.category === "testing").length,
    },
    {
      id: "seguridad",
      name: "Seguridad",
      icon: "🔐",
      count: examples.filter((e) => e.category === "seguridad").length,
    },
    {
      id: "web",
      name: "Web",
      icon: "🌐",
      count: examples.filter((e) => e.category === "web").length,
    },
  ];

  const filteredExamples = examples.filter((example) => {
    const matchesCategory =
      selectedCategory === "all" || example.category === selectedCategory;
    const matchesSearch =
      example.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      example.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Principiante":
        return "bg-green-500";
      case "Intermedio":
        return "bg-yellow-500";
      case "Avanzado":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleLoadExample = (file) => {
    onLoadExample(file);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        disabled={isRunning}
        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg
                   hover:from-purple-700 hover:to-indigo-700 transition-all duration-200
                   flex items-center gap-2 font-medium shadow-lg hover:shadow-xl disabled:opacity-50"
        title="Abrir galería de ejemplos"
      >
        <span>📚</span>
        <span>Ejemplos</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                📚 Galería de Ejemplos
              </h2>
              <p className="text-purple-100 text-sm">
                Explora {examples.length} ejemplos interactivos de Python
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
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
              placeholder="Buscar ejemplos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl
                       text-white placeholder-purple-200 border border-white border-opacity-30
                       focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
            <svg
              className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-200"
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
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap
                  ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
                <span className="text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded-full">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Examples Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredExamples.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <svg
                className="w-16 h-16 mx-auto mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg">No se encontraron ejemplos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExamples.map((example, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300
                           hover:scale-105 border border-gray-700 hover:border-purple-500 cursor-pointer group"
                  onClick={() => handleLoadExample(example.file)}
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-4">
                    <div className="flex items-start justify-between">
                      <div className="text-4xl mb-2">{example.icon}</div>
                      <div
                        className={`${getDifficultyColor(
                          example.difficulty
                        )} px-2 py-1 rounded-full text-xs text-white font-medium`}
                      >
                        {example.difficulty}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {example.name}
                    </h3>
                    <p className="text-purple-100 text-xs flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {example.time}
                    </p>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      {example.description}
                    </p>

                    <button
                      className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg
                               font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200
                               flex items-center justify-center gap-2 group-hover:shadow-lg"
                    >
                      <span>Cargar Ejemplo</span>
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-800 border-t border-gray-700 px-6 py-4 text-center text-gray-400 text-sm">
          <p>
            💡 Tip: Haz clic en cualquier ejemplo para cargarlo en el editor
          </p>
        </div>
      </div>
    </div>
  );
}

export default ExamplesGallery;
