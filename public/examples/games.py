# Juegos Interactivos en Python
# Implementaciones de juegos clásicos

import random
import matplotlib.pyplot as plt
import numpy as np

print("🎮 Juegos Clásicos en Python\n")

# 1. Juego de la Vida de Conway
class GameOfLife:
    def __init__(self, size=50):
        self.size = size
        self.grid = np.random.choice([0, 1], size=(size, size), p=[0.8, 0.2])
    
    def count_neighbors(self, x, y):
        """Cuenta vecinos vivos alrededor de una célula"""
        count = 0
        for i in range(-1, 2):
            for j in range(-1, 2):
                if i == 0 and j == 0:
                    continue
                nx, ny = (x + i) % self.size, (y + j) % self.size
                count += self.grid[nx, ny]
        return count
    
    def step(self):
        """Avanza una generación"""
        new_grid = self.grid.copy()
        for i in range(self.size):
            for j in range(self.size):
                neighbors = self.count_neighbors(i, j)
                if self.grid[i, j] == 1:
                    # Célula viva
                    if neighbors < 2 or neighbors > 3:
                        new_grid[i, j] = 0
                else:
                    # Célula muerta
                    if neighbors == 3:
                        new_grid[i, j] = 1
        self.grid = new_grid
    
    def visualize(self, generations=5):
        """Visualiza múltiples generaciones"""
        fig, axes = plt.subplots(1, generations, figsize=(15, 3))
        fig.suptitle('Juego de la Vida de Conway', fontsize=16, fontweight='bold')
        
        for gen in range(generations):
            axes[gen].imshow(self.grid, cmap='binary', interpolation='nearest')
            axes[gen].set_title(f'Gen {gen}')
            axes[gen].axis('off')
            self.step()
        
        plt.tight_layout()
        plt.show()

game = GameOfLife(size=40)
game.visualize(generations=5)
print("✓ Juego de la Vida: 5 generaciones simuladas")

# 2. Sudoku Solver
def print_sudoku(board):
    """Imprime tablero de Sudoku bonito"""
    for i in range(9):
        if i % 3 == 0 and i != 0:
            print("─" * 21)
        for j in range(9):
            if j % 3 == 0 and j != 0:
                print("│", end=" ")
            print(board[i][j] if board[i][j] != 0 else "·", end=" ")
        print()

def is_valid(board, row, col, num):
    """Verifica si un número es válido en la posición"""
    # Verificar fila
    if num in board[row]:
        return False
    
    # Verificar columna
    if num in [board[i][col] for i in range(9)]:
        return False
    
    # Verificar cuadro 3x3
    box_row, box_col = 3 * (row // 3), 3 * (col // 3)
    for i in range(box_row, box_row + 3):
        for j in range(box_col, box_col + 3):
            if board[i][j] == num:
                return False
    
    return True

def solve_sudoku(board):
    """Resuelve Sudoku usando backtracking"""
    for i in range(9):
        for j in range(9):
            if board[i][j] == 0:
                for num in range(1, 10):
                    if is_valid(board, i, j, num):
                        board[i][j] = num
                        if solve_sudoku(board):
                            return True
                        board[i][j] = 0
                return False
    return True

# Sudoku de ejemplo (0 = celda vacía)
sudoku_board = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
]

print("\n🧩 Sudoku Original:")
print_sudoku(sudoku_board)

if solve_sudoku(sudoku_board):
    print("\n✓ Sudoku Resuelto:")
    print_sudoku(sudoku_board)
else:
    print("\n✗ No se pudo resolver el Sudoku")

# 3. Juego de Adivinanza de Números
print("\n🎲 Simulación: Adivina el Número (1-100)")

def guess_number_game_ai():
    """Estrategia AI para adivinar número (búsqueda binaria)"""
    secret = random.randint(1, 100)
    low, high = 1, 100
    attempts = 0
    
    print(f"  Número secreto: {secret}")
    
    while low <= high:
        attempts += 1
        guess = (low + high) // 2
        
        if guess == secret:
            print(f"  ✓ ¡Encontrado en {attempts} intentos! (Número: {guess})")
            return attempts
        elif guess < secret:
            print(f"    Intento {attempts}: {guess} → Muy bajo")
            low = guess + 1
        else:
            print(f"    Intento {attempts}: {guess} → Muy alto")
            high = guess - 1
    
    return attempts

attempts = guess_number_game_ai()

# 4. Laberinto - Búsqueda de camino
def generate_maze(size=15):
    """Genera un laberinto simple"""
    maze = np.ones((size, size))
    
    # Crear caminos
    for i in range(1, size-1, 2):
        for j in range(1, size-1, 2):
            maze[i, j] = 0
            # Añadir camino aleatorio
            if random.random() > 0.3:
                direction = random.choice([(0, 1), (1, 0), (0, -1), (-1, 0)])
                ni, nj = i + direction[0], j + direction[1]
                if 0 <= ni < size and 0 <= nj < size:
                    maze[ni, nj] = 0
    
    maze[1, 0] = 0  # Entrada
    maze[size-2, size-1] = 0  # Salida
    
    return maze

def find_path(maze, start, end):
    """Encuentra camino usando BFS"""
    from collections import deque
    
    rows, cols = maze.shape
    queue = deque([(start, [start])])
    visited = {start}
    
    while queue:
        (x, y), path = queue.popleft()
        
        if (x, y) == end:
            return path
        
        for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
            nx, ny = x + dx, y + dy
            if (0 <= nx < rows and 0 <= ny < cols and 
                maze[nx, ny] == 0 and (nx, ny) not in visited):
                visited.add((nx, ny))
                queue.append(((nx, ny), path + [(nx, ny)]))
    
    return None

print("\n🗺️ Laberinto:")
maze = generate_maze(15)
start = (1, 0)
end = (13, 14)
path = find_path(maze, start, end)

# Visualizar laberinto
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 6))

# Laberinto original
ax1.imshow(maze, cmap='binary', interpolation='nearest')
ax1.plot(start[1], start[0], 'go', markersize=15, label='Inicio')
ax1.plot(end[1], end[0], 'ro', markersize=15, label='Fin')
ax1.set_title('Laberinto', fontsize=12, fontweight='bold')
ax1.axis('off')
ax1.legend()

# Laberinto con solución
maze_solution = maze.copy()
if path:
    for x, y in path:
        maze_solution[x, y] = 0.5
    
ax2.imshow(maze_solution, cmap='RdYlGn', interpolation='nearest')
ax2.plot(start[1], start[0], 'go', markersize=15)
ax2.plot(end[1], end[0], 'ro', markersize=15)
ax2.set_title(f'Solución ({len(path)} pasos)', fontsize=12, fontweight='bold')
ax2.axis('off')

plt.tight_layout()
plt.show()

print(f"✓ Camino encontrado: {len(path) if path else 0} pasos")

# 5. Tic-Tac-Toe AI (Minimax)
class TicTacToe:
    def __init__(self):
        self.board = [[' ' for _ in range(3)] for _ in range(3)]
    
    def check_winner(self):
        """Verifica si hay ganador"""
        # Filas y columnas
        for i in range(3):
            if self.board[i][0] == self.board[i][1] == self.board[i][2] != ' ':
                return self.board[i][0]
            if self.board[0][i] == self.board[1][i] == self.board[2][i] != ' ':
                return self.board[0][i]
        
        # Diagonales
        if self.board[0][0] == self.board[1][1] == self.board[2][2] != ' ':
            return self.board[0][0]
        if self.board[0][2] == self.board[1][1] == self.board[2][0] != ' ':
            return self.board[0][2]
        
        return None
    
    def is_full(self):
        """Verifica si el tablero está lleno"""
        return all(cell != ' ' for row in self.board for cell in row)
    
    def minimax(self, is_maximizing):
        """Algoritmo Minimax para AI perfecta"""
        winner = self.check_winner()
        if winner == 'X':
            return -1
        if winner == 'O':
            return 1
        if self.is_full():
            return 0
        
        if is_maximizing:
            best_score = -float('inf')
            for i in range(3):
                for j in range(3):
                    if self.board[i][j] == ' ':
                        self.board[i][j] = 'O'
                        score = self.minimax(False)
                        self.board[i][j] = ' '
                        best_score = max(score, best_score)
            return best_score
        else:
            best_score = float('inf')
            for i in range(3):
                for j in range(3):
                    if self.board[i][j] == ' ':
                        self.board[i][j] = 'X'
                        score = self.minimax(True)
                        self.board[i][j] = ' '
                        best_score = min(score, best_score)
            return best_score
    
    def best_move(self):
        """Encuentra el mejor movimiento para AI"""
        best_score = -float('inf')
        move = None
        for i in range(3):
            for j in range(3):
                if self.board[i][j] == ' ':
                    self.board[i][j] = 'O'
                    score = self.minimax(False)
                    self.board[i][j] = ' '
                    if score > best_score:
                        best_score = score
                        move = (i, j)
        return move
    
    def print_board(self):
        """Imprime el tablero"""
        for i, row in enumerate(self.board):
            print(' ' + ' │ '.join(row))
            if i < 2:
                print('───┼───┼───')

print("\n❌⭕ Tic-Tac-Toe - AI vs AI:")
game = TicTacToe()

# Simulación de partida
moves = 0
while not game.check_winner() and not game.is_full() and moves < 9:
    if moves % 2 == 0:
        # Jugador X (aleatorio)
        empty = [(i, j) for i in range(3) for j in range(3) if game.board[i][j] == ' ']
        i, j = random.choice(empty)
        game.board[i][j] = 'X'
    else:
        # Jugador O (AI)
        i, j = game.best_move()
        game.board[i][j] = 'O'
    moves += 1

game.print_board()
winner = game.check_winner()
print(f"\n{'✓ Ganador: ' + winner if winner else '✓ Empate'}")

print("\n🎉 ¡5 juegos clásicos implementados!")
