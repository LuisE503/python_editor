# Web Scraping y APIs
# Técnicas de extracción y procesamiento de datos web

import json
import re
from datetime import datetime

print("🌐 Web Scraping y APIs\n")

# 1. Parser HTML simple
class SimpleHTMLParser:
    """Parser HTML básico para extraer información"""
    
    @staticmethod
    def extract_links(html):
        """Extrae todos los enlaces de HTML"""
        pattern = r'<a[^>]+href=["\'](.*?)["\'][^>]*>(.*?)</a>'
        matches = re.findall(pattern, html, re.IGNORECASE | re.DOTALL)
        return [{'url': url, 'text': text.strip()} for url, text in matches]
    
    @staticmethod
    def extract_images(html):
        """Extrae todas las imágenes de HTML"""
        pattern = r'<img[^>]+src=["\'](.*?)["\'][^>]*>'
        return re.findall(pattern, html, re.IGNORECASE)
    
    @staticmethod
    def extract_emails(text):
        """Extrae direcciones de email"""
        pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        return re.findall(pattern, text)

# HTML de ejemplo
sample_html = """
<html>
    <body>
        <a href="https://example.com">Ejemplo</a>
        <a href="/about">Acerca de</a>
        <img src="logo.png" alt="Logo">
        <p>Contacto: info@example.com</p>
        <p>Soporte: support@example.com</p>
    </body>
</html>
"""

print("🔍 Extracción de HTML:")
links = SimpleHTMLParser.extract_links(sample_html)
images = SimpleHTMLParser.extract_images(sample_html)
emails = SimpleHTMLParser.extract_emails(sample_html)

print(f"  Enlaces encontrados: {len(links)}")
for link in links:
    print(f"    • {link['text']} → {link['url']}")

print(f"  Imágenes encontradas: {len(images)}")
for img in images:
    print(f"    • {img}")

print(f"  Emails encontrados: {len(emails)}")
for email in emails:
    print(f"    • {email}")

# 2. Cliente API REST simulado
class APIClient:
    """Cliente para interactuar con APIs REST"""
    
    def __init__(self, base_url):
        self.base_url = base_url
        self.headers = {'User-Agent': 'PyHub-IDE/1.0'}
    
    def get(self, endpoint):
        """Simula GET request"""
        url = f"{self.base_url}{endpoint}"
        print(f"  GET {url}")
        return {
            'status': 200,
            'data': {'message': 'Datos obtenidos correctamente'}
        }
    
    def post(self, endpoint, data):
        """Simula POST request"""
        url = f"{self.base_url}{endpoint}"
        print(f"  POST {url}")
        print(f"  Body: {json.dumps(data, indent=2)}")
        return {
            'status': 201,
            'data': {'id': 123, 'created': True}
        }

print("\n🌐 Cliente API REST:")
api = APIClient('https://api.example.com')

# GET request
response = api.get('/users/1')
print(f"  Status: {response['status']}")
print(f"  Data: {response['data']}")

# POST request
new_user = {'name': 'Juan', 'email': 'juan@example.com'}
response = api.post('/users', new_user)
print(f"  Status: {response['status']}")
print(f"  Data: {response['data']}")

# 3. Procesador de datos JSON
class JSONProcessor:
    """Herramientas para procesar datos JSON"""
    
    @staticmethod
    def pretty_print(data):
        """Formatea JSON de manera legible"""
        return json.dumps(data, indent=2, ensure_ascii=False)
    
    @staticmethod
    def flatten(nested_dict, parent_key='', sep='.'):
        """Aplana un diccionario anidado"""
        items = []
        for k, v in nested_dict.items():
            new_key = f"{parent_key}{sep}{k}" if parent_key else k
            if isinstance(v, dict):
                items.extend(JSONProcessor.flatten(v, new_key, sep=sep).items())
            else:
                items.append((new_key, v))
        return dict(items)
    
    @staticmethod
    def search(data, key):
        """Busca una clave en estructura JSON anidada"""
        results = []
        
        def _search(obj, path=""):
            if isinstance(obj, dict):
                for k, v in obj.items():
                    new_path = f"{path}.{k}" if path else k
                    if k == key:
                        results.append({'path': new_path, 'value': v})
                    _search(v, new_path)
            elif isinstance(obj, list):
                for i, item in enumerate(obj):
                    _search(item, f"{path}[{i}]")
        
        _search(data)
        return results

# Datos de ejemplo
sample_data = {
    'user': {
        'id': 1,
        'name': 'Ana García',
        'email': 'ana@example.com',
        'address': {
            'city': 'Madrid',
            'country': 'España'
        }
    },
    'posts': [
        {'id': 1, 'title': 'Post 1'},
        {'id': 2, 'title': 'Post 2'}
    ]
}

print("\n📊 Procesamiento JSON:")
print("  JSON formateado:")
print(JSONProcessor.pretty_print(sample_data))

print("\n  JSON aplanado:")
flattened = JSONProcessor.flatten(sample_data)
for key, value in flattened.items():
    print(f"    {key}: {value}")

print("\n  Búsqueda de 'id':")
results = JSONProcessor.search(sample_data, 'id')
for result in results:
    print(f"    {result['path']}: {result['value']}")

# 4. Rate Limiter (control de velocidad)
class RateLimiter:
    """Limitador de velocidad para APIs"""
    
    def __init__(self, max_requests, time_window):
        self.max_requests = max_requests
        self.time_window = time_window  # segundos
        self.requests = []
    
    def can_make_request(self):
        """Verifica si se puede hacer una petición"""
        now = datetime.now().timestamp()
        
        # Eliminar peticiones fuera de la ventana
        self.requests = [
            req_time for req_time in self.requests
            if now - req_time < self.time_window
        ]
        
        # Verificar límite
        if len(self.requests) < self.max_requests:
            self.requests.append(now)
            return True
        return False
    
    def get_wait_time(self):
        """Calcula tiempo de espera"""
        if not self.requests:
            return 0
        
        now = datetime.now().timestamp()
        oldest = self.requests[0]
        wait = self.time_window - (now - oldest)
        return max(0, wait)

print("\n⏱️ Rate Limiter:")
limiter = RateLimiter(max_requests=3, time_window=60)

print(f"  Límite: {limiter.max_requests} peticiones por {limiter.time_window}s")
for i in range(5):
    if limiter.can_make_request():
        print(f"  ✓ Petición {i+1}: Permitida")
    else:
        wait = limiter.get_wait_time()
        print(f"  ✗ Petición {i+1}: Bloqueada (espera {wait:.1f}s)")

# 5. Web Scraper con User Agents
class WebScraper:
    """Scraper web con rotación de User Agents"""
    
    USER_AGENTS = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
    ]
    
    def __init__(self):
        self.session_count = 0
    
    def get_user_agent(self):
        """Obtiene un User Agent aleatorio"""
        import random
        return random.choice(self.USER_AGENTS)
    
    def scrape(self, url):
        """Simula scraping de una URL"""
        self.session_count += 1
        user_agent = self.get_user_agent()
        
        return {
            'url': url,
            'status': 200,
            'user_agent': user_agent[:50] + '...',
            'session': self.session_count
        }

print("\n🕷️ Web Scraper:")
scraper = WebScraper()

urls = [
    'https://example.com/page1',
    'https://example.com/page2',
    'https://example.com/page3'
]

for url in urls:
    result = scraper.scrape(url)
    print(f"  Sesión {result['session']}: {url}")
    print(f"    Status: {result['status']}")
    print(f"    UA: {result['user_agent']}")

# 6. Procesador de CSV
class CSVProcessor:
    """Procesador de datos CSV"""
    
    @staticmethod
    def parse(csv_string):
        """Parsea string CSV a lista de diccionarios"""
        lines = csv_string.strip().split('\n')
        headers = lines[0].split(',')
        
        data = []
        for line in lines[1:]:
            values = line.split(',')
            row = dict(zip(headers, values))
            data.append(row)
        
        return data
    
    @staticmethod
    def to_json(csv_string):
        """Convierte CSV a JSON"""
        data = CSVProcessor.parse(csv_string)
        return json.dumps(data, indent=2)

csv_data = """name,age,city
Juan,30,Madrid
Ana,25,Barcelona
Carlos,35,Valencia"""

print("\n📋 Procesador CSV:")
parsed = CSVProcessor.parse(csv_data)
print(f"  Registros parseados: {len(parsed)}")
for record in parsed:
    print(f"    • {record['name']}, {record['age']} años, {record['city']}")

print("\n  JSON equivalente:")
print(CSVProcessor.to_json(csv_data))

print("\n✅ ¡Técnicas de web scraping y APIs demostradas!")
print("💡 Tip: Respeta robots.txt y términos de servicio de los sitios")
