# Algoritmos Clásicos Visualizados
# Implementación y análisis de algoritmos famosos

import time
import matplotlib.pyplot as plt
import numpy as np

print("🧮 Algoritmos Clásicos\n")

# 1. Algoritmos de Ordenamiento con Visualización
def bubble_sort(arr):
    """Bubble Sort con conteo de operaciones"""
    arr = arr.copy()
    n = len(arr)
    comparisons = 0
    swaps = 0
    
    for i in range(n):
        for j in range(0, n-i-1):
            comparisons += 1
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swaps += 1
    
    return arr, comparisons, swaps

def quick_sort(arr, comparisons=[0]):
    """Quick Sort con conteo de operaciones"""
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = []
    middle = []
    right = []
    
    for x in arr:
        comparisons[0] += 1
        if x < pivot:
            left.append(x)
        elif x == pivot:
            middle.append(x)
        else:
            right.append(x)
    
    return quick_sort(left, comparisons) + middle + quick_sort(right, comparisons)

# Comparar algoritmos de ordenamiento
print("📊 Comparando algoritmos de ordenamiento...\n")

sizes = [10, 50, 100, 200, 500]
bubble_times = []
quick_times = []

for size in sizes:
    arr = np.random.randint(0, 1000, size).tolist()
    
    # Bubble Sort
    start = time.time()
    bubble_sort(arr)
    bubble_times.append(time.time() - start)
    
    # Quick Sort
    start = time.time()
    comparisons = [0]
    quick_sort(arr, comparisons)
    quick_times.append(time.time() - start)

# Visualizar comparación
plt.figure(figsize=(10, 6))
plt.plot(sizes, bubble_times, 'o-', label='Bubble Sort', linewidth=2, markersize=8, color='#667eea')
plt.plot(sizes, quick_times, 's-', label='Quick Sort', linewidth=2, markersize=8, color='#764ba2')
plt.xlabel('Tamaño del Array', fontsize=12)
plt.ylabel('Tiempo (segundos)', fontsize=12)
plt.title('Comparación de Algoritmos de Ordenamiento', fontsize=14, fontweight='bold')
plt.legend(fontsize=11)
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()

print("✓ Comparación de ordenamiento visualizada")

# 2. Búsqueda Binaria vs Búsqueda Lineal
def linear_search(arr, target):
    """Búsqueda lineal"""
    for i, val in enumerate(arr):
        if val == target:
            return i, i + 1  # índice, comparaciones
    return -1, len(arr)

def binary_search(arr, target):
    """Búsqueda binaria"""
    left, right = 0, len(arr) - 1
    comparisons = 0
    
    while left <= right:
        mid = (left + right) // 2
        comparisons += 1
        
        if arr[mid] == target:
            return mid, comparisons
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1, comparisons

# Comparar búsquedas
arr_sorted = sorted(np.random.randint(0, 1000, 500).tolist())
target = arr_sorted[250]

linear_idx, linear_comps = linear_search(arr_sorted, target)
binary_idx, binary_comps = binary_search(arr_sorted, target)

print(f"\n🔍 Búsqueda del elemento {target}:")
print(f"  Búsqueda Lineal: {linear_comps} comparaciones")
print(f"  Búsqueda Binaria: {binary_comps} comparaciones")
print(f"  Mejora: {linear_comps/binary_comps:.1f}x más rápida")

# 3. Algoritmo de Dijkstra (Camino más corto)
def dijkstra_simple():
    """Implementación simple del algoritmo de Dijkstra"""
    # Grafo de ejemplo (ciudades y distancias)
    graph = {
        'A': {'B': 4, 'C': 2},
        'B': {'A': 4, 'C': 1, 'D': 5},
        'C': {'A': 2, 'B': 1, 'D': 8, 'E': 10},
        'D': {'B': 5, 'C': 8, 'E': 2},
        'E': {'C': 10, 'D': 2}
    }
    
    def dijkstra(graph, start):
        distances = {node: float('inf') for node in graph}
        distances[start] = 0
        visited = set()
        
        while len(visited) < len(graph):
            # Encontrar nodo no visitado con menor distancia
            current = None
            for node in graph:
                if node not in visited:
                    if current is None or distances[node] < distances[current]:
                        current = node
            
            if current is None:
                break
            
            visited.add(current)
            
            # Actualizar distancias de vecinos
            for neighbor, weight in graph[current].items():
                distance = distances[current] + weight
                if distance < distances[neighbor]:
                    distances[neighbor] = distance
        
        return distances
    
    start = 'A'
    distances = dijkstra(graph, start)
    
    print(f"\n🗺️ Distancias más cortas desde '{start}':")
    for city, dist in sorted(distances.items()):
        print(f"  {start} → {city}: {dist}")
    
    # Visualizar el grafo
    fig, ax = plt.subplots(figsize=(10, 8))
    
    # Posiciones de los nodos
    pos = {'A': (0, 2), 'B': (2, 3), 'C': (2, 1), 'D': (4, 2), 'E': (5, 1)}
    
    # Dibujar aristas
    for node, neighbors in graph.items():
        for neighbor, weight in neighbors.items():
            x1, y1 = pos[node]
            x2, y2 = pos[neighbor]
            ax.plot([x1, x2], [y1, y2], 'gray', linewidth=2, alpha=0.5)
            # Etiqueta de peso
            mid_x, mid_y = (x1 + x2) / 2, (y1 + y2) / 2
            ax.text(mid_x, mid_y, str(weight), fontsize=10, 
                   bbox=dict(boxstyle='round', facecolor='white', alpha=0.8))
    
    # Dibujar nodos
    for node, (x, y) in pos.items():
        color = '#667eea' if node == start else '#764ba2'
        ax.scatter(x, y, s=1000, c=color, alpha=0.8, edgecolors='white', linewidth=2)
        ax.text(x, y, node, fontsize=14, fontweight='bold', 
               ha='center', va='center', color='white')
        # Distancia
        ax.text(x, y-0.4, f'd={distances[node]}', fontsize=9, 
               ha='center', va='top', style='italic')
    
    ax.set_xlim(-0.5, 6)
    ax.set_ylim(0, 4)
    ax.axis('off')
    ax.set_title(f'Algoritmo de Dijkstra - Caminos más cortos desde {start}', 
                fontsize=14, fontweight='bold', pad=20)
    plt.tight_layout()
    plt.show()

dijkstra_simple()
print("✓ Algoritmo de Dijkstra visualizado")

# 4. Problema de la Mochila (Knapsack)
def knapsack():
    """Problema de la mochila - Programación dinámica"""
    items = [
        {'name': 'Laptop', 'weight': 3, 'value': 1000},
        {'name': 'Cámara', 'weight': 2, 'value': 600},
        {'name': 'Libro', 'weight': 1, 'value': 200},
        {'name': 'Tablet', 'weight': 2, 'value': 500},
        {'name': 'Reloj', 'weight': 1, 'value': 300}
    ]
    max_weight = 5
    
    n = len(items)
    dp = [[0 for _ in range(max_weight + 1)] for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(max_weight + 1):
            if items[i-1]['weight'] <= w:
                dp[i][w] = max(
                    dp[i-1][w],
                    dp[i-1][w - items[i-1]['weight']] + items[i-1]['value']
                )
            else:
                dp[i][w] = dp[i-1][w]
    
    max_value = dp[n][max_weight]
    
    # Reconstruir solución
    w = max_weight
    selected = []
    for i in range(n, 0, -1):
        if dp[i][w] != dp[i-1][w]:
            selected.append(items[i-1])
            w -= items[i-1]['weight']
    
    print(f"\n🎒 Problema de la Mochila (capacidad: {max_weight}kg):")
    print(f"  Valor máximo: ${max_value}")
    print(f"  Items seleccionados:")
    total_weight = 0
    for item in selected:
        print(f"    • {item['name']}: {item['weight']}kg, ${item['value']}")
        total_weight += item['weight']
    print(f"  Peso total: {total_weight}kg")

knapsack()

# 5. Torres de Hanoi
def hanoi(n, source, target, auxiliary, moves=[]):
    """Torres de Hanoi - Recursión"""
    if n == 1:
        moves.append((source, target))
        return
    hanoi(n-1, source, auxiliary, target, moves)
    moves.append((source, target))
    hanoi(n-1, auxiliary, target, source, moves)

n_disks = 4
moves = []
hanoi(n_disks, 'A', 'C', 'B', moves)

print(f"\n🗼 Torres de Hanoi ({n_disks} discos):")
print(f"  Movimientos necesarios: {len(moves)}")
print(f"  Primeros 10 movimientos:")
for i, (src, dst) in enumerate(moves[:10], 1):
    print(f"    {i}. Mover disco de {src} → {dst}")
print(f"  Complejidad: 2^{n_disks} - 1 = {2**n_disks - 1} movimientos")

print("\n✅ ¡Algoritmos clásicos demostrados!")
