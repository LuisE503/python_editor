# Animaciones y Arte Generativo con Python
# Crea arte visual dinámico con código!

import matplotlib.pyplot as plt
import matplotlib.animation as animation
import numpy as np

print("🎨 Generando arte visual...")

# 1. Espiral de Fibonacci
def fibonacci_spiral():
    """Crea una espiral de Fibonacci con círculos"""
    fig, ax = plt.subplots(figsize=(10, 10))
    ax.set_aspect('equal')
    ax.axis('off')
    
    # Generar números de Fibonacci
    fib = [1, 1]
    for i in range(10):
        fib.append(fib[-1] + fib[-2])
    
    # Dibujar cuadrados y arcos de Fibonacci
    x, y = 0, 0
    direction = 0  # 0=derecha, 1=arriba, 2=izquierda, 3=abajo
    
    colors = plt.cm.viridis(np.linspace(0, 1, len(fib)))
    
    for i, num in enumerate(fib):
        # Dibujar cuadrado
        if direction == 0:  # derecha
            rect = plt.Rectangle((x, y), num, num, fill=False, 
                                edgecolor=colors[i], linewidth=2)
            x_next, y_next = x, y + num
        elif direction == 1:  # arriba
            rect = plt.Rectangle((x-num, y), num, num, fill=False, 
                                edgecolor=colors[i], linewidth=2)
            x_next, y_next = x - num, y
        elif direction == 2:  # izquierda
            rect = plt.Rectangle((x-num, y-num), num, num, fill=False, 
                                edgecolor=colors[i], linewidth=2)
            x_next, y_next = x, y - num
        else:  # abajo
            rect = plt.Rectangle((x, y-num), num, num, fill=False, 
                                edgecolor=colors[i], linewidth=2)
            x_next, y_next = x + num, y
        
        ax.add_patch(rect)
        
        # Dibujar arco (cuarto de círculo)
        theta = np.linspace(direction * np.pi/2, (direction + 1) * np.pi/2, 50)
        if direction == 0:
            cx, cy = x + num, y + num
        elif direction == 1:
            cx, cy = x - num, y + num
        elif direction == 2:
            cx, cy = x - num, y - num
        else:
            cx, cy = x + num, y - num
            
        arc_x = cx + num * np.cos(theta)
        arc_y = cy + num * np.sin(theta)
        ax.plot(arc_x, arc_y, color=colors[i], linewidth=2)
        
        x, y = x_next, y_next
        direction = (direction + 1) % 4
    
    ax.autoscale()
    plt.title('Espiral de Fibonacci', fontsize=16, fontweight='bold', pad=20)
    plt.tight_layout()
    plt.show()
    print("✓ Espiral de Fibonacci generada")

fibonacci_spiral()

# 2. Mandelbrot Set (Fractal)
def mandelbrot():
    """Genera el conjunto de Mandelbrot"""
    print("🔢 Calculando fractal de Mandelbrot...")
    
    width, height = 800, 600
    xmin, xmax = -2.5, 1.0
    ymin, ymax = -1.25, 1.25
    
    max_iter = 50
    
    x = np.linspace(xmin, xmax, width)
    y = np.linspace(ymin, ymax, height)
    X, Y = np.meshgrid(x, y)
    C = X + 1j * Y
    
    Z = np.zeros_like(C)
    M = np.zeros(C.shape)
    
    for i in range(max_iter):
        mask = np.abs(Z) <= 2
        Z[mask] = Z[mask]**2 + C[mask]
        M[mask] = i
    
    plt.figure(figsize=(12, 8))
    plt.imshow(M, extent=[xmin, xmax, ymin, ymax], cmap='hot', interpolation='bilinear')
    plt.colorbar(label='Iteraciones', shrink=0.8)
    plt.title('Conjunto de Mandelbrot', fontsize=16, fontweight='bold')
    plt.xlabel('Re(c)')
    plt.ylabel('Im(c)')
    plt.tight_layout()
    plt.show()
    print("✓ Fractal de Mandelbrot generado")

mandelbrot()

# 3. Onda sinusoidal animada (simulación)
def sine_wave_pattern():
    """Crea un patrón de ondas sinusoidales"""
    fig, ax = plt.subplots(figsize=(12, 6))
    
    x = np.linspace(0, 4*np.pi, 200)
    
    # Múltiples ondas con diferentes frecuencias y fases
    for i in range(10):
        freq = 1 + i * 0.3
        phase = i * np.pi / 5
        amplitude = 1 / (i + 1)
        y = amplitude * np.sin(freq * x + phase)
        
        color = plt.cm.rainbow(i / 10)
        ax.plot(x, y + i * 0.3, color=color, linewidth=2, alpha=0.7)
    
    ax.set_xlim(0, 4*np.pi)
    ax.set_ylim(-1, 4)
    ax.set_xlabel('x', fontsize=12)
    ax.set_ylabel('Amplitud', fontsize=12)
    ax.set_title('Superposición de Ondas Sinusoidales', fontsize=16, fontweight='bold')
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.show()
    print("✓ Patrón de ondas generado")

sine_wave_pattern()

# 4. Círculos concéntricos con gradiente
def concentric_circles():
    """Crea un patrón de círculos concéntricos"""
    fig, ax = plt.subplots(figsize=(10, 10))
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_xlim(-1.1, 1.1)
    ax.set_ylim(-1.1, 1.1)
    
    n_circles = 30
    for i in range(n_circles):
        radius = 1 - (i / n_circles)
        color = plt.cm.plasma(i / n_circles)
        circle = plt.Circle((0, 0), radius, fill=False, 
                          edgecolor=color, linewidth=3)
        ax.add_patch(circle)
    
    plt.title('Círculos Concéntricos', fontsize=16, fontweight='bold', pad=20)
    plt.tight_layout()
    plt.show()
    print("✓ Círculos concéntricos generados")

concentric_circles()

# 5. Arte generativo con ruido Perlin (simulado)
def generative_art():
    """Crea arte generativo con patrones aleatorios"""
    np.random.seed(42)
    
    fig, axes = plt.subplots(2, 2, figsize=(12, 12))
    fig.suptitle('Arte Generativo', fontsize=18, fontweight='bold')
    
    for idx, ax in enumerate(axes.flat):
        n_points = 1000
        x = np.random.randn(n_points).cumsum()
        y = np.random.randn(n_points).cumsum()
        
        colors = np.linspace(0, 1, n_points)
        ax.scatter(x, y, c=colors, cmap='viridis', alpha=0.5, s=20)
        ax.set_title(f'Patrón {idx + 1}', fontsize=12)
        ax.axis('off')
        
        # Resetear semilla para variación
        np.random.seed(42 + idx * 10)
    
    plt.tight_layout()
    plt.show()
    print("✓ Arte generativo creado")

generative_art()

print("\n🎉 ¡5 visualizaciones artísticas creadas!")
print("💡 Tip: Experimenta cambiando los parámetros para crear tu propio arte")
