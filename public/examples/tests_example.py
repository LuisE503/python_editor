# Ejemplo de Tests Unitarios
# Este archivo demuestra cómo escribir tests simples

# Funciones a testear
def sumar(a, b):
    """Suma dos números."""
    return a + b

def multiplicar(a, b):
    """Multiplica dos números."""
    return a * b

def es_par(numero):
    """Verifica si un número es par."""
    return numero % 2 == 0

def invertir_cadena(texto):
    """Invierte una cadena de texto."""
    return texto[::-1]

def calcular_factorial(n):
    """Calcula el factorial de n."""
    if n < 0:
        raise ValueError("El factorial no está definido para números negativos")
    if n == 0 or n == 1:
        return 1
    resultado = 1
    for i in range(2, n + 1):
        resultado *= i
    return resultado

# ===== TESTS =====
# Las funciones que empiezan con "test_" serán ejecutadas automáticamente

def test_sumar_positivos():
    """Test: Suma de números positivos"""
    assert sumar(2, 3) == 5, "2 + 3 debe ser 5"
    assert sumar(10, 20) == 30, "10 + 20 debe ser 30"
    print("✓ test_sumar_positivos pasado")

def test_sumar_negativos():
    """Test: Suma con números negativos"""
    assert sumar(-5, 3) == -2, "-5 + 3 debe ser -2"
    assert sumar(-10, -5) == -15, "-10 + -5 debe ser -15"
    print("✓ test_sumar_negativos pasado")

def test_multiplicar():
    """Test: Multiplicación"""
    assert multiplicar(3, 4) == 12, "3 * 4 debe ser 12"
    assert multiplicar(-2, 5) == -10, "-2 * 5 debe ser -10"
    assert multiplicar(0, 100) == 0, "0 * 100 debe ser 0"
    print("✓ test_multiplicar pasado")

def test_es_par():
    """Test: Verificación de números pares"""
    assert es_par(2) == True, "2 es par"
    assert es_par(4) == True, "4 es par"
    assert es_par(3) == False, "3 no es par"
    assert es_par(7) == False, "7 no es par"
    assert es_par(0) == True, "0 es par"
    print("✓ test_es_par pasado")

def test_invertir_cadena():
    """Test: Inversión de cadenas"""
    assert invertir_cadena("hola") == "aloh", "Inversión de 'hola'"
    assert invertir_cadena("Python") == "nohtyP", "Inversión de 'Python'"
    assert invertir_cadena("") == "", "Cadena vacía"
    assert invertir_cadena("a") == "a", "Un solo carácter"
    print("✓ test_invertir_cadena pasado")

def test_factorial():
    """Test: Cálculo de factorial"""
    assert calcular_factorial(0) == 1, "0! debe ser 1"
    assert calcular_factorial(1) == 1, "1! debe ser 1"
    assert calcular_factorial(5) == 120, "5! debe ser 120"
    assert calcular_factorial(7) == 5040, "7! debe ser 5040"
    print("✓ test_factorial pasado")

def test_factorial_negativo():
    """Test: Factorial con número negativo debe lanzar error"""
    try:
        calcular_factorial(-5)
        assert False, "Debería lanzar ValueError para números negativos"
    except ValueError:
        print("✓ test_factorial_negativo pasado")

# Para ejecutar estos tests, haz clic en el botón "🧪 Tests"
print("\nEjemplo de tests definido. Haz clic en '🧪 Tests' para ejecutarlos.")
