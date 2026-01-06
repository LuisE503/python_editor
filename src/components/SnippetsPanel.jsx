import React, { useState } from 'react';

/**
 * Componente de Snippets de Código
 * Proporciona fragmentos de código predefinidos para insertar rápidamente
 */
function SnippetsPanel({ onInsertSnippet }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copied, setCopied] = useState(null);

  const snippets = [
    // Estructuras básicas
    {
      name: 'Función',
      category: 'basico',
      icon: '🔧',
      description: 'Define una función con docstring',
      code: `def funcion_ejemplo(parametro):
    """
    Descripción de la función.
    
    Args:
        parametro: Descripción del parámetro
    
    Returns:
        Descripción del valor retornado
    """
    resultado = parametro
    return resultado`
    },
    {
      name: 'Clase',
      category: 'basico',
      icon: '📦',
      description: 'Plantilla de clase con constructor',
      code: `class MiClase:
    """Descripción de la clase."""
    
    def __init__(self, nombre):
        """Inicializa la instancia."""
        self.nombre = nombre
    
    def metodo(self):
        """Método de ejemplo."""
        return f"Hola, {self.nombre}"
    
    def __str__(self):
        return f"MiClase({self.nombre})"`
    },
    {
      name: 'Try-Except',
      category: 'basico',
      icon: '🛡️',
      description: 'Manejo de excepciones completo',
      code: `try:
    # Código que puede fallar
    resultado = operacion_riesgosa()
except ValueError as e:
    print(f"Error de valor: {e}")
except Exception as e:
    print(f"Error inesperado: {e}")
else:
    print("Operación exitosa")
finally:
    print("Limpieza final")`
    },
    {
      name: 'Context Manager',
      category: 'basico',
      icon: '📂',
      description: 'Uso de with para manejo de recursos',
      code: `with open('archivo.txt', 'r') as f:
    contenido = f.read()
    print(contenido)
# El archivo se cierra automáticamente`
    },
    // Estructuras de datos
    {
      name: 'Diccionario Comprehension',
      category: 'datos',
      icon: '📖',
      description: 'Crear diccionario con comprehension',
      code: `# Crear diccionario con comprehension
numeros = {x: x**2 for x in range(1, 6)}
# Resultado: {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# Con condición
pares = {x: x**2 for x in range(10) if x % 2 == 0}
print(numeros)
print(pares)`
    },
    {
      name: 'Lista Comprehension',
      category: 'datos',
      icon: '📋',
      description: 'Crear listas de forma elegante',
      code: `# Lista comprehension básica
cuadrados = [x**2 for x in range(10)]

# Con condición
pares = [x for x in range(20) if x % 2 == 0]

# Anidado
matriz = [[j for j in range(3)] for i in range(3)]

print(cuadrados)
print(pares)
print(matriz)`
    },
    {
      name: 'Enum',
      category: 'datos',
      icon: '🏷️',
      description: 'Definir enumeraciones',
      code: `from enum import Enum, auto

class Estado(Enum):
    PENDIENTE = auto()
    EN_PROCESO = auto()
    COMPLETADO = auto()
    CANCELADO = auto()

# Uso
tarea_estado = Estado.PENDIENTE
print(f"Estado: {tarea_estado.name}")
print(f"Valor: {tarea_estado.value}")`
    },
    // Funciones avanzadas
    {
      name: 'Decorator',
      category: 'avanzado',
      icon: '🎀',
      description: 'Crear un decorador personalizado',
      code: `import functools
import time

def medir_tiempo(func):
    """Decorador para medir tiempo de ejecución."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        inicio = time.time()
        resultado = func(*args, **kwargs)
        fin = time.time()
        print(f"{func.__name__} tardó {fin - inicio:.4f}s")
        return resultado
    return wrapper

@medir_tiempo
def operacion_lenta():
    time.sleep(0.1)
    return "Completado"

resultado = operacion_lenta()`
    },
    {
      name: 'Generator',
      category: 'avanzado',
      icon: '🔄',
      description: 'Crear un generador eficiente',
      code: `def fibonacci_generator(n):
    """Generador de secuencia Fibonacci."""
    a, b = 0, 1
    count = 0
    while count < n:
        yield a
        a, b = b, a + b
        count += 1

# Uso del generador (memoria eficiente)
for num in fibonacci_generator(10):
    print(num, end=' ')

# Convertir a lista
lista_fib = list(fibonacci_generator(10))
print(lista_fib)`
    },
    {
      name: 'Lambda y Map/Filter',
      category: 'avanzado',
      icon: '⚡',
      description: 'Funciones lambda con map y filter',
      code: `# Lambda: función anónima
cuadrado = lambda x: x ** 2

# Map: aplicar función a cada elemento
numeros = [1, 2, 3, 4, 5]
cuadrados = list(map(lambda x: x**2, numeros))

# Filter: filtrar elementos
pares = list(filter(lambda x: x % 2 == 0, numeros))

# Reduce: reducir a un valor
from functools import reduce
suma = reduce(lambda a, b: a + b, numeros)

print(f"Cuadrados: {cuadrados}")
print(f"Pares: {pares}")
print(f"Suma: {suma}")`
    },
    // Data Science
    {
      name: 'Gráfico Matplotlib',
      category: 'visual',
      icon: '📊',
      description: 'Crear gráfico con matplotlib',
      code: `import matplotlib.pyplot as plt
import numpy as np

# Datos
x = np.linspace(0, 10, 100)
y = np.sin(x)

# Crear gráfico
plt.figure(figsize=(10, 6))
plt.plot(x, y, 'b-', linewidth=2, label='sin(x)')
plt.xlabel('X')
plt.ylabel('Y')
plt.title('Gráfico de Seno')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()`
    },
    {
      name: 'DataFrame básico',
      category: 'visual',
      icon: '📈',
      description: 'Crear y manipular datos (simulado)',
      code: `# Simulación de DataFrame sin pandas
datos = [
    {'nombre': 'Ana', 'edad': 25, 'ciudad': 'Madrid'},
    {'nombre': 'Juan', 'edad': 30, 'ciudad': 'Barcelona'},
    {'nombre': 'María', 'edad': 28, 'ciudad': 'Valencia'}
]

# Operaciones básicas
print("Todos los datos:")
for fila in datos:
    print(f"  {fila}")

# Filtrar
mayores_27 = [p for p in datos if p['edad'] > 27]
print(f"\\nMayores de 27: {mayores_27}")

# Promedio de edad
promedio = sum(p['edad'] for p in datos) / len(datos)
print(f"Promedio de edad: {promedio:.1f}")`
    },
    // Patrones de diseño
    {
      name: 'Singleton',
      category: 'patrones',
      icon: '1️⃣',
      description: 'Patrón Singleton',
      code: `class Singleton:
    """Patrón Singleton - única instancia."""
    _instancia = None
    
    def __new__(cls):
        if cls._instancia is None:
            cls._instancia = super().__new__(cls)
            cls._instancia.valor = 0
        return cls._instancia

# Uso
s1 = Singleton()
s2 = Singleton()
s1.valor = 42

print(f"¿Misma instancia? {s1 is s2}")
print(f"s2.valor = {s2.valor}")`
    },
    {
      name: 'Factory',
      category: 'patrones',
      icon: '🏭',
      description: 'Patrón Factory Method',
      code: `from abc import ABC, abstractmethod

class Animal(ABC):
    @abstractmethod
    def hablar(self):
        pass

class Perro(Animal):
    def hablar(self):
        return "¡Guau!"

class Gato(Animal):
    def hablar(self):
        return "¡Miau!"

class AnimalFactory:
    @staticmethod
    def crear(tipo):
        animales = {
            'perro': Perro,
            'gato': Gato
        }
        return animales.get(tipo.lower(), Perro)()

# Uso
perro = AnimalFactory.crear('perro')
gato = AnimalFactory.crear('gato')
print(perro.hablar())
print(gato.hablar())`
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos', icon: '📚' },
    { id: 'basico', name: 'Básico', icon: '🌱' },
    { id: 'datos', name: 'Datos', icon: '📋' },
    { id: 'avanzado', name: 'Avanzado', icon: '⚡' },
    { id: 'visual', name: 'Visual', icon: '📊' },
    { id: 'patrones', name: 'Patrones', icon: '🏗️' }
  ];

  const filteredSnippets = snippets.filter(snippet => {
    const matchesCategory = selectedCategory === 'all' || snippet.category === selectedCategory;
    const matchesSearch = snippet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         snippet.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopySnippet = async (snippet, index) => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(index);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Error copying snippet:', error);
    }
  };

  const handleInsertSnippet = (snippet) => {
    if (onInsertSnippet) {
      onInsertSnippet(snippet.code);
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg 
                   hover:from-yellow-700 hover:to-orange-700 transition-all duration-200 
                   flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
        title="Snippets de código"
      >
        <span>✂️</span>
        <span>Snippets</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">✂️ Snippets de Código</h2>
              <p className="text-yellow-100 text-sm">
                {snippets.length} plantillas de código listas para usar
              </p>
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

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar snippets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl 
                       text-white placeholder-yellow-200 border border-white border-opacity-30
                       focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
            <svg className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-200" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Categories */}
        <div className="px-6 py-4 bg-gray-800 border-b border-gray-700 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
                  ${selectedCategory === category.id 
                    ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg scale-105' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Snippets List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredSnippets.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">No se encontraron snippets</p>
            </div>
          ) : (
            filteredSnippets.map((snippet, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-yellow-500 transition-all"
              >
                {/* Snippet Header */}
                <div className="flex items-center justify-between p-4 bg-gray-750">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{snippet.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-white">{snippet.name}</h3>
                      <p className="text-gray-400 text-sm">{snippet.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopySnippet(snippet, index)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        copied === index
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {copied === index ? '✓ Copiado' : '📋 Copiar'}
                    </button>
                    <button
                      onClick={() => handleInsertSnippet(snippet)}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white 
                               rounded-lg text-sm font-medium hover:from-yellow-700 hover:to-orange-700"
                    >
                      ➕ Insertar
                    </button>
                  </div>
                </div>

                {/* Code Preview */}
                <div className="p-4 bg-gray-950">
                  <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                    {snippet.code}
                  </pre>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-800 border-t border-gray-700 px-6 py-4 text-center text-gray-400 text-sm">
          <p>💡 Tip: Los snippets se insertan en la posición actual del cursor</p>
        </div>
      </div>
    </div>
  );
}

export default SnippetsPanel;
