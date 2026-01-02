# Bienvenido a PyHub IDE

print("¡Hola, Mundo!")
print("Este es tu primer programa Python en el navegador")

# Variables y tipos de datos
nombre = "PyHub IDE"
version = 1.0
activo = True

print(f"\n{nombre} v{version}")
print(f"Estado: {'Activo' if activo else 'Inactivo'}")

# Estructuras de datos
frutas = ["manzana", "banana", "naranja"]
print(f"\nFrutas disponibles: {', '.join(frutas)}")

# Función simple
def calcular_area_circulo(radio):
    """Calcula el área de un círculo dado su radio."""
    import math
    return math.pi * radio ** 2

radio = 5
area = calcular_area_circulo(radio)
print(f"\nÁrea de un círculo con radio {radio}: {area:.2f}")

# Bucles
print("\nContando del 1 al 5:")
for i in range(1, 6):
    print(f"  {i}")

print("\n✓ ¡Programa ejecutado correctamente!")
