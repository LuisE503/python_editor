# Secuencia de Fibonacci
# Implementación de la secuencia de Fibonacci con diferentes métodos

def fibonacci_iterativo(n):
    """Calcula el n-ésimo número de Fibonacci iterativamente."""
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

def fibonacci_recursivo(n):
    """Calcula el n-ésimo número de Fibonacci recursivamente."""
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    return fibonacci_recursivo(n - 1) + fibonacci_recursivo(n - 2)

def generar_secuencia_fibonacci(cantidad):
    """Genera una lista con los primeros n números de Fibonacci."""
    secuencia = []
    for i in range(cantidad):
        secuencia.append(fibonacci_iterativo(i))
    return secuencia

# Ejemplos de uso
print("=== Secuencia de Fibonacci ===\n")

# Generar los primeros 15 números
cantidad = 15
secuencia = generar_secuencia_fibonacci(cantidad)
print(f"Los primeros {cantidad} números de Fibonacci:")
print(secuencia)

# Calcular un número específico
n = 10
fib_iter = fibonacci_iterativo(n)
print(f"\nFibonacci({n}) [iterativo]: {fib_iter}")

# Comparar métodos (cuidado con números grandes en recursivo)
n_pequeno = 8
fib_rec = fibonacci_recursivo(n_pequeno)
print(f"Fibonacci({n_pequeno}) [recursivo]: {fib_rec}")

# Encontrar números de Fibonacci menores a un límite
limite = 1000
print(f"\nNúmeros de Fibonacci menores a {limite}:")
fib_list = []
i = 0
while True:
    fib = fibonacci_iterativo(i)
    if fib >= limite:
        break
    fib_list.append(fib)
    i += 1
print(fib_list)

# Calcular la razón dorada usando la secuencia
if len(secuencia) > 1:
    razones = []
    for i in range(1, len(secuencia)):
        if secuencia[i-1] != 0:
            razon = secuencia[i] / secuencia[i-1]
            razones.append(razon)
    
    print(f"\nRazones consecutivas (convergen a la razón dorada φ ≈ 1.618):")
    for i, razon in enumerate(razones[-5:], start=len(razones)-4):
        print(f"  F({i+1})/F({i}) = {razon:.6f}")

print("\n✓ Cálculos completados")
