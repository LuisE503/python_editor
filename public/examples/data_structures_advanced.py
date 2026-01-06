"""
🏗️ Estructuras de Datos Avanzadas en Python
Implementaciones profesionales de estructuras de datos complejas
"""

from collections import deque
import heapq

# ==========================================
# 1. TRIE (Árbol de Prefijos)
# ==========================================

class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False
        self.frequency = 0

class Trie:
    """Árbol de prefijos para búsqueda eficiente de strings"""

    def __init__(self):
        self.root = TrieNode()
        print("📚 Trie creado")

    def insert(self, word):
        """Insertar palabra en el Trie"""
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
        node.frequency += 1

    def search(self, word):
        """Buscar palabra completa"""
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end

    def starts_with(self, prefix):
        """Buscar palabras con prefijo dado"""
        node = self.root
        for char in prefix:
            if char not in node.children:
                return []
            node = node.children[char]

        # Encontrar todas las palabras con este prefijo
        words = []
        self._find_words(node, prefix, words)
        return words

    def _find_words(self, node, prefix, words):
        """Helper para encontrar todas las palabras"""
        if node.is_end:
            words.append(prefix)
        for char, child in node.children.items():
            self._find_words(child, prefix + char, words)


# ==========================================
# 2. UNION-FIND (Disjoint Set)
# ==========================================

class UnionFind:
    """Estructura para conjuntos disjuntos con path compression"""

    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.components = n
        print(f"🔗 Union-Find con {n} elementos creado")

    def find(self, x):
        """Encontrar raíz con path compression"""
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        """Unir dos conjuntos"""
        root_x = self.find(x)
        root_y = self.find(y)

        if root_x == root_y:
            return False

        # Union by rank
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1

        self.components -= 1
        return True

    def connected(self, x, y):
        """Verificar si dos elementos están conectados"""
        return self.find(x) == self.find(y)


# ==========================================
# 3. SEGMENT TREE
# ==========================================

class SegmentTree:
    """Árbol de segmentos para queries de rangos eficientes"""

    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        self.build(arr, 0, 0, self.n - 1)
        print(f"🌳 Segment Tree construido con {self.n} elementos")

    def build(self, arr, node, start, end):
        """Construir el árbol"""
        if start == end:
            self.tree[node] = arr[start]
        else:
            mid = (start + end) // 2
            left = 2 * node + 1
            right = 2 * node + 2

            self.build(arr, left, start, mid)
            self.build(arr, right, mid + 1, end)
            self.tree[node] = self.tree[left] + self.tree[right]

    def query(self, node, start, end, l, r):
        """Query de suma en rango [l, r]"""
        if r < start or end < l:
            return 0
        if l <= start and end <= r:
            return self.tree[node]

        mid = (start + end) // 2
        left = 2 * node + 1
        right = 2 * node + 2

        sum_left = self.query(left, start, mid, l, r)
        sum_right = self.query(right, mid + 1, end, l, r)
        return sum_left + sum_right

    def query_range(self, l, r):
        """Query público"""
        return self.query(0, 0, self.n - 1, l, r)

    def update(self, node, start, end, idx, val):
        """Actualizar un elemento"""
        if start == end:
            self.tree[node] = val
        else:
            mid = (start + end) // 2
            left = 2 * node + 1
            right = 2 * node + 2

            if idx <= mid:
                self.update(left, start, mid, idx, val)
            else:
                self.update(right, mid + 1, end, idx, val)

            self.tree[node] = self.tree[left] + self.tree[right]

    def update_index(self, idx, val):
        """Actualización pública"""
        self.update(0, 0, self.n - 1, idx, val)


# ==========================================
# 4. LRU CACHE
# ==========================================

class LRUCache:
    """Caché LRU (Least Recently Used) eficiente"""

    class Node:
        def __init__(self, key, value):
            self.key = key
            self.value = value
            self.prev = None
            self.next = None

    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}
        self.head = self.Node(0, 0)
        self.tail = self.Node(0, 0)
        self.head.next = self.tail
        self.tail.prev = self.head
        print(f"💾 LRU Cache creado con capacidad {capacity}")

    def get(self, key):
        """Obtener valor del cache"""
        if key in self.cache:
            node = self.cache[key]
            self._remove(node)
            self._add(node)
            return node.value
        return -1

    def put(self, key, value):
        """Insertar/actualizar en el cache"""
        if key in self.cache:
            self._remove(self.cache[key])

        node = self.Node(key, value)
        self._add(node)
        self.cache[key] = node

        if len(self.cache) > self.capacity:
            # Remover el menos usado
            lru = self.head.next
            self._remove(lru)
            del self.cache[lru.key]

    def _remove(self, node):
        """Remover nodo de la lista"""
        prev = node.prev
        next = node.next
        prev.next = next
        next.prev = prev

    def _add(self, node):
        """Agregar nodo al final"""
        prev = self.tail.prev
        prev.next = node
        self.tail.prev = node
        node.prev = prev
        node.next = self.tail


# ==========================================
# 5. SKIP LIST
# ==========================================

class SkipListNode:
    def __init__(self, value, level):
        self.value = value
        self.forward = [None] * (level + 1)

class SkipList:
    """Lista con saltos para búsqueda O(log n)"""

    def __init__(self, max_level=4):
        self.max_level = max_level
        self.header = SkipListNode(float('-inf'), max_level)
        self.level = 0
        print(f"⚡ Skip List creado con {max_level} niveles máximos")

    def _random_level(self):
        """Generar nivel aleatorio"""
        level = 0
        while level < self.max_level and hash(level) % 2 == 0:
            level += 1
        return level

    def insert(self, value):
        """Insertar valor"""
        update = [None] * (self.max_level + 1)
        current = self.header

        for i in range(self.level, -1, -1):
            while current.forward[i] and current.forward[i].value < value:
                current = current.forward[i]
            update[i] = current

        level = self._random_level()

        if level > self.level:
            for i in range(self.level + 1, level + 1):
                update[i] = self.header
            self.level = level

        node = SkipListNode(value, level)
        for i in range(level + 1):
            node.forward[i] = update[i].forward[i]
            update[i].forward[i] = node

    def search(self, value):
        """Buscar valor"""
        current = self.header
        for i in range(self.level, -1, -1):
            while current.forward[i] and current.forward[i].value < value:
                current = current.forward[i]

        current = current.forward[0]
        return current and current.value == value


# ==========================================
# DEMOSTRACIÓN
# ==========================================

def main():
    print("="*60)
    print("🏗️  ESTRUCTURAS DE DATOS AVANZADAS")
    print("="*60)

    # 1. Trie
    print("\n" + "="*60)
    print("1️⃣  TRIE (Árbol de Prefijos)")
    print("="*60)

    trie = Trie()
    words = ["python", "pyodide", "programming", "programmer", "product"]

    for word in words:
        trie.insert(word)
    print(f"✓ Insertadas {len(words)} palabras")

    print(f"\n🔍 Buscar 'python': {trie.search('python')}")
    print(f"🔍 Buscar 'java': {trie.search('java')}")

    prefix = "pro"
    matches = trie.starts_with(prefix)
    print(f"\n📝 Palabras que empiezan con '{prefix}': {matches}")

    # 2. Union-Find
    print("\n" + "="*60)
    print("2️⃣  UNION-FIND (Conjuntos Disjuntos)")
    print("="*60)

    uf = UnionFind(10)
    connections = [(0, 1), (1, 2), (3, 4), (5, 6), (6, 7)]

    for x, y in connections:
        uf.union(x, y)
        print(f"  ✓ Unir {x} y {y}")

    print(f"\n🔗 ¿0 y 2 conectados? {uf.connected(0, 2)}")
    print(f"🔗 ¿0 y 5 conectados? {uf.connected(0, 5)}")
    print(f"📊 Componentes conectados: {uf.components}")

    # 3. Segment Tree
    print("\n" + "="*60)
    print("3️⃣  SEGMENT TREE (Queries de Rango)")
    print("="*60)

    arr = [1, 3, 5, 7, 9, 11]
    seg_tree = SegmentTree(arr)

    print(f"\n📊 Array: {arr}")
    print(f"🔢 Suma [0, 2]: {seg_tree.query_range(0, 2)}")  # 1+3+5 = 9
    print(f"🔢 Suma [1, 4]: {seg_tree.query_range(1, 4)}")  # 3+5+7+9 = 24

    print(f"\n🔄 Actualizar índice 2 a valor 10")
    seg_tree.update_index(2, 10)
    print(f"🔢 Nueva suma [0, 2]: {seg_tree.query_range(0, 2)}")  # 1+3+10 = 14

    # 4. LRU Cache
    print("\n" + "="*60)
    print("4️⃣  LRU CACHE")
    print("="*60)

    cache = LRUCache(3)

    operations = [
        ("put", 1, 100),
        ("put", 2, 200),
        ("put", 3, 300),
        ("get", 1, None),
        ("put", 4, 400),  # Elimina key 2
        ("get", 2, None)
    ]

    for op in operations:
        if op[0] == "put":
            cache.put(op[1], op[2])
            print(f"  ✓ PUT({op[1]}, {op[2]})")
        else:
            result = cache.get(op[1])
            print(f"  🔍 GET({op[1]}) = {result}")

    # 5. Skip List
    print("\n" + "="*60)
    print("5️⃣  SKIP LIST")
    print("="*60)

    skip_list = SkipList()
    values = [3, 6, 7, 9, 12, 19, 17, 26, 21, 25]

    for val in values:
        skip_list.insert(val)
    print(f"✓ Insertados {len(values)} valores")

    search_values = [9, 15, 21]
    for val in search_values:
        found = skip_list.search(val)
        print(f"  🔍 Buscar {val}: {'✓ Encontrado' if found else '✗ No encontrado'}")

    # Resumen
    print("\n" + "="*60)
    print("📊 RESUMEN")
    print("="*60)
    print("  ✅ Trie: Búsqueda de prefijos O(m)")
    print("  ✅ Union-Find: Operaciones casi O(1)")
    print("  ✅ Segment Tree: Queries de rango O(log n)")
    print("  ✅ LRU Cache: Acceso O(1)")
    print("  ✅ Skip List: Búsqueda O(log n)")
    print("\n🎯 Todas las estructuras implementadas exitosamente!")

if __name__ == "__main__":
    main()
