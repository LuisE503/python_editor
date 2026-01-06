# Criptografía y Seguridad en Python
# Implementaciones de algoritmos criptográficos básicos

import hashlib
import random
import string

print("🔐 Criptografía y Seguridad\n")

# 1. Hashing con diferentes algoritmos
def demonstrate_hashing():
    """Demuestra diferentes algoritmos de hash"""
    message = "PyHub IDE es increíble!"
    
    print("📝 Mensaje original:")
    print(f"  '{message}'")
    print(f"\n🔢 Hashes:")
    
    # MD5 (no seguro para producción)
    md5_hash = hashlib.md5(message.encode()).hexdigest()
    print(f"  MD5:    {md5_hash}")
    
    # SHA-1 (no seguro para producción)
    sha1_hash = hashlib.sha1(message.encode()).hexdigest()
    print(f"  SHA-1:  {sha1_hash}")
    
    # SHA-256 (recomendado)
    sha256_hash = hashlib.sha256(message.encode()).hexdigest()
    print(f"  SHA-256: {sha256_hash}")
    
    # SHA-512 (más seguro)
    sha512_hash = hashlib.sha512(message.encode()).hexdigest()
    print(f"  SHA-512: {sha512_hash[:64]}...")
    
    print("\n✓ Los hashes son únicos y unidireccionales")

demonstrate_hashing()

# 2. Cifrado César (histórico)
class CaesarCipher:
    """Implementación del cifrado César"""
    
    @staticmethod
    def encrypt(text, shift=3):
        """Cifra texto usando cifrado César"""
        result = []
        for char in text:
            if char.isalpha():
                start = ord('A') if char.isupper() else ord('a')
                shifted = (ord(char) - start + shift) % 26
                result.append(chr(start + shifted))
            else:
                result.append(char)
        return ''.join(result)
    
    @staticmethod
    def decrypt(text, shift=3):
        """Descifra texto usando cifrado César"""
        return CaesarCipher.encrypt(text, -shift)

print("\n🔒 Cifrado César:")
original = "Python es Genial"
encrypted = CaesarCipher.encrypt(original, 5)
decrypted = CaesarCipher.decrypt(encrypted, 5)

print(f"  Original:  '{original}'")
print(f"  Cifrado:   '{encrypted}'")
print(f"  Descifrado: '{decrypted}'")
print(f"  ✓ Coincide: {original == decrypted}")

# 3. Generador de contraseñas seguras
class PasswordGenerator:
    """Generador de contraseñas seguras"""
    
    @staticmethod
    def generate(length=16, use_symbols=True, use_numbers=True, use_uppercase=True):
        """Genera una contraseña aleatoria segura"""
        chars = string.ascii_lowercase
        
        if use_uppercase:
            chars += string.ascii_uppercase
        if use_numbers:
            chars += string.digits
        if use_symbols:
            chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'
        
        # Asegurar al menos un carácter de cada tipo
        password = []
        if use_uppercase:
            password.append(random.choice(string.ascii_uppercase))
        if use_numbers:
            password.append(random.choice(string.digits))
        if use_symbols:
            password.append(random.choice('!@#$%^&*'))
        
        # Completar con caracteres aleatorios
        password += [random.choice(chars) for _ in range(length - len(password))]
        
        # Mezclar
        random.shuffle(password)
        return ''.join(password)
    
    @staticmethod
    def check_strength(password):
        """Evalúa la fortaleza de una contraseña"""
        score = 0
        feedback = []
        
        # Longitud
        if len(password) >= 12:
            score += 2
            feedback.append("✓ Longitud adecuada")
        elif len(password) >= 8:
            score += 1
            feedback.append("⚠ Longitud aceptable")
        else:
            feedback.append("✗ Muy corta")
        
        # Mayúsculas
        if any(c.isupper() for c in password):
            score += 1
            feedback.append("✓ Tiene mayúsculas")
        else:
            feedback.append("✗ Sin mayúsculas")
        
        # Números
        if any(c.isdigit() for c in password):
            score += 1
            feedback.append("✓ Tiene números")
        else:
            feedback.append("✗ Sin números")
        
        # Símbolos
        if any(c in '!@#$%^&*()_+-=[]{}|;:,.<>?' for c in password):
            score += 1
            feedback.append("✓ Tiene símbolos")
        else:
            feedback.append("✗ Sin símbolos")
        
        # Determinar fortaleza
        if score >= 5:
            strength = "🟢 Muy Fuerte"
        elif score >= 4:
            strength = "🟡 Fuerte"
        elif score >= 3:
            strength = "🟠 Media"
        else:
            strength = "🔴 Débil"
        
        return {
            'score': score,
            'strength': strength,
            'feedback': feedback
        }

print("\n🔑 Generador de Contraseñas:")
for i in range(3):
    pwd = PasswordGenerator.generate(16)
    analysis = PasswordGenerator.check_strength(pwd)
    print(f"\n  Contraseña {i+1}: {pwd}")
    print(f"  Fortaleza: {analysis['strength']} ({analysis['score']}/5)")
    for item in analysis['feedback']:
        print(f"    {item}")

# 4. Cifrado XOR (simétrico)
class XORCipher:
    """Cifrado XOR simétrico"""
    
    @staticmethod
    def encrypt_decrypt(text, key):
        """Cifra o descifra usando XOR (simétrico)"""
        result = []
        key_length = len(key)
        
        for i, char in enumerate(text):
            key_char = key[i % key_length]
            xor_result = ord(char) ^ ord(key_char)
            result.append(chr(xor_result))
        
        return ''.join(result)

print("\n🔐 Cifrado XOR:")
message = "Mensaje Secreto"
key = "clave"

encrypted_xor = XORCipher.encrypt_decrypt(message, key)
decrypted_xor = XORCipher.encrypt_decrypt(encrypted_xor, key)

print(f"  Original:  '{message}'")
print(f"  Cifrado:   '{repr(encrypted_xor)}'")
print(f"  Descifrado: '{decrypted_xor}'")
print(f"  ✓ Coincide: {message == decrypted_xor}")

# 5. Generador de números aleatorios criptográficos
def generate_random_bytes(n=16):
    """Genera bytes aleatorios para criptografía"""
    return ''.join(random.choice(string.hexdigits.lower()) for _ in range(n * 2))

print(f"\n🎲 Números Aleatorios Criptográficos:")
print(f"  Token 1: {generate_random_bytes(16)}")
print(f"  Token 2: {generate_random_bytes(16)}")
print(f"  Token 3: {generate_random_bytes(16)}")

# 6. Verificación de integridad de archivos
class FileIntegrity:
    """Verificador de integridad de datos"""
    
    @staticmethod
    def calculate_checksum(data):
        """Calcula checksum SHA-256"""
        return hashlib.sha256(data.encode()).hexdigest()
    
    @staticmethod
    def verify(data, expected_checksum):
        """Verifica integridad de datos"""
        actual = FileIntegrity.calculate_checksum(data)
        return actual == expected_checksum

print("\n✅ Verificación de Integridad:")
data_original = "Contenido importante del archivo"
checksum = FileIntegrity.calculate_checksum(data_original)

print(f"  Datos: '{data_original}'")
print(f"  Checksum: {checksum[:32]}...")

# Verificar datos no modificados
is_valid = FileIntegrity.verify(data_original, checksum)
print(f"  ✓ Verificación (sin cambios): {is_valid}")

# Verificar datos modificados
data_tampered = "Contenido importante del archivo!"
is_valid_tampered = FileIntegrity.verify(data_tampered, checksum)
print(f"  ✗ Verificación (modificado): {is_valid_tampered}")

# 7. Codificación Base64
import base64

print("\n📦 Codificación Base64:")
text = "PyHub IDE 🐍"
encoded = base64.b64encode(text.encode()).decode()
decoded = base64.b64decode(encoded).decode()

print(f"  Original: '{text}'")
print(f"  Base64:   '{encoded}'")
print(f"  Decodificado: '{decoded}'")

print("\n🎉 ¡Conceptos de criptografía demostrados!")
print("⚠️ Nota: Usa librerías especializadas (cryptography) en producción")
