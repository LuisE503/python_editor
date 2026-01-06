# Visualización de Datos con Matplotlib
# PyHub IDE soporta gráficos usando matplotlib!

import matplotlib.pyplot as plt
import numpy as np

# Configuración para mejor apariencia
plt.style.use('seaborn-v0_8-darkgrid')

# 1. Gráfico de líneas - Funciones matemáticas
print("📊 Generando visualizaciones...")

x = np.linspace(0, 2*np.pi, 100)
y1 = np.sin(x)
y2 = np.cos(x)
y3 = np.sin(x) * np.cos(x)

plt.figure(figsize=(10, 6))
plt.plot(x, y1, label='sin(x)', linewidth=2, color='#667eea')
plt.plot(x, y2, label='cos(x)', linewidth=2, color='#764ba2')
plt.plot(x, y3, label='sin(x)·cos(x)', linewidth=2, linestyle='--', color='#f093fb')
plt.xlabel('x')
plt.ylabel('y')
plt.title('Funciones Trigonométricas', fontsize=14, fontweight='bold')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()

print("✓ Gráfico 1: Funciones trigonométricas")

# 2. Gráfico de barras - Análisis de datos
lenguajes = ['Python', 'JavaScript', 'Java', 'C++', 'Go', 'Rust']
popularidad = [85, 78, 65, 60, 55, 52]
colores = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b']

plt.figure(figsize=(10, 6))
bars = plt.bar(lenguajes, popularidad, color=colores, alpha=0.8)
plt.xlabel('Lenguaje de Programación')
plt.ylabel('Popularidad (%)')
plt.title('Popularidad de Lenguajes de Programación 2026', fontsize=14, fontweight='bold')
plt.ylim(0, 100)

# Añadir valores en las barras
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2., height,
             f'{height}%', ha='center', va='bottom', fontweight='bold')

plt.tight_layout()
plt.show()

print("✓ Gráfico 2: Popularidad de lenguajes")

# 3. Gráfico de dispersión - Correlación
np.random.seed(42)
n_puntos = 100
horas_estudio = np.random.uniform(0, 10, n_puntos)
calificaciones = 50 + 5 * horas_estudio + np.random.normal(0, 5, n_puntos)
calificaciones = np.clip(calificaciones, 0, 100)

plt.figure(figsize=(10, 6))
scatter = plt.scatter(horas_estudio, calificaciones, 
                     c=calificaciones, cmap='viridis', 
                     s=100, alpha=0.6, edgecolors='white')
plt.colorbar(scatter, label='Calificación')
plt.xlabel('Horas de Estudio')
plt.ylabel('Calificación')
plt.title('Relación entre Horas de Estudio y Calificación', fontsize=14, fontweight='bold')
plt.grid(True, alpha=0.3)

# Línea de tendencia
z = np.polyfit(horas_estudio, calificaciones, 1)
p = np.poly1d(z)
plt.plot(horas_estudio, p(horas_estudio), "r--", alpha=0.8, linewidth=2, label='Tendencia')
plt.legend()
plt.tight_layout()
plt.show()

print("✓ Gráfico 3: Correlación estudio-calificación")

# 4. Gráfico circular - Distribución
categorias = ['Desarrollo', 'Testing', 'Documentación', 'Reuniones', 'Otros']
tiempo = [40, 20, 15, 15, 10]
colores_pie = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b']

plt.figure(figsize=(10, 6))
plt.pie(tiempo, labels=categorias, autopct='%1.1f%%', 
        colors=colores_pie, startangle=90, explode=(0.1, 0, 0, 0, 0))
plt.title('Distribución del Tiempo en un Proyecto', fontsize=14, fontweight='bold')
plt.axis('equal')
plt.tight_layout()
plt.show()

print("✓ Gráfico 4: Distribución de tiempo")

print("\n✅ ¡4 visualizaciones generadas correctamente!")
print("💡 Tip: Puedes crear tus propios gráficos con matplotlib")
