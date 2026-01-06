# Machine Learning con Scikit-learn
# Implementación de algoritmos ML básicos

import numpy as np
import matplotlib.pyplot as plt

print("🤖 Machine Learning Demos\n")

# 1. Regresión Lineal desde cero
class LinearRegression:
    def __init__(self):
        self.slope = None
        self.intercept = None
    
    def fit(self, X, y):
        """Ajusta el modelo usando mínimos cuadrados"""
        n = len(X)
        mean_x = np.mean(X)
        mean_y = np.mean(y)
        
        numerator = sum((X[i] - mean_x) * (y[i] - mean_y) for i in range(n))
        denominator = sum((X[i] - mean_x) ** 2 for i in range(n))
        
        self.slope = numerator / denominator
        self.intercept = mean_y - self.slope * mean_x
    
    def predict(self, X):
        """Realiza predicciones"""
        return self.slope * X + self.intercept

# Generar datos de entrenamiento
np.random.seed(42)
X = np.linspace(0, 10, 50)
y = 2.5 * X + 5 + np.random.normal(0, 2, 50)

# Entrenar modelo
model = LinearRegression()
model.fit(X, y)
y_pred = model.predict(X)

# Visualizar
plt.figure(figsize=(10, 6))
plt.scatter(X, y, alpha=0.6, s=100, color='#667eea', label='Datos reales', edgecolors='white')
plt.plot(X, y_pred, 'r-', linewidth=3, label='Predicción', color='#764ba2')
plt.xlabel('X', fontsize=12)
plt.ylabel('y', fontsize=12)
plt.title('Regresión Lineal desde Cero', fontsize=14, fontweight='bold')
plt.legend(fontsize=11)
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()

print(f"✓ Modelo entrenado: y = {model.slope:.2f}x + {model.intercept:.2f}")

# 2. K-Means Clustering
class KMeans:
    def __init__(self, k=3, max_iters=100):
        self.k = k
        self.max_iters = max_iters
        self.centroids = None
        self.labels = None
    
    def fit(self, X):
        """Entrena el modelo K-Means"""
        # Inicializar centroides aleatoriamente
        indices = np.random.choice(len(X), self.k, replace=False)
        self.centroids = X[indices]
        
        for _ in range(self.max_iters):
            # Asignar puntos al centroide más cercano
            distances = np.array([[np.linalg.norm(x - c) for c in self.centroids] for x in X])
            self.labels = np.argmin(distances, axis=1)
            
            # Actualizar centroides
            new_centroids = np.array([X[self.labels == i].mean(axis=0) for i in range(self.k)])
            
            # Verificar convergencia
            if np.allclose(self.centroids, new_centroids):
                break
            
            self.centroids = new_centroids
        
        return self

# Generar datos de clustering
np.random.seed(42)
n_samples = 300
cluster1 = np.random.randn(n_samples//3, 2) + np.array([2, 2])
cluster2 = np.random.randn(n_samples//3, 2) + np.array([-2, 2])
cluster3 = np.random.randn(n_samples//3, 2) + np.array([0, -2])
X_cluster = np.vstack([cluster1, cluster2, cluster3])

# Entrenar K-Means
kmeans = KMeans(k=3)
kmeans.fit(X_cluster)

# Visualizar clusters
plt.figure(figsize=(10, 8))
colors = ['#667eea', '#764ba2', '#f093fb']
for i in range(kmeans.k):
    cluster_points = X_cluster[kmeans.labels == i]
    plt.scatter(cluster_points[:, 0], cluster_points[:, 1], 
               c=colors[i], label=f'Cluster {i+1}', alpha=0.6, s=50, edgecolors='white')

plt.scatter(kmeans.centroids[:, 0], kmeans.centroids[:, 1], 
           c='red', marker='X', s=300, edgecolors='white', linewidth=2,
           label='Centroides')
plt.xlabel('Feature 1', fontsize=12)
plt.ylabel('Feature 2', fontsize=12)
plt.title('K-Means Clustering', fontsize=14, fontweight='bold')
plt.legend(fontsize=11)
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()

print(f"✓ K-Means: {kmeans.k} clusters identificados")

# 3. Red Neuronal Simple (Perceptrón)
class Perceptron:
    def __init__(self, learning_rate=0.1, n_iterations=100):
        self.lr = learning_rate
        self.n_iterations = n_iterations
        self.weights = None
        self.bias = None
    
    def activation(self, x):
        """Función de activación (escalón)"""
        return 1 if x >= 0 else 0
    
    def fit(self, X, y):
        """Entrena el perceptrón"""
        n_samples, n_features = X.shape
        self.weights = np.zeros(n_features)
        self.bias = 0
        
        for _ in range(self.n_iterations):
            for i in range(n_samples):
                linear_output = np.dot(X[i], self.weights) + self.bias
                y_pred = self.activation(linear_output)
                
                # Actualizar pesos
                update = self.lr * (y[i] - y_pred)
                self.weights += update * X[i]
                self.bias += update
        
        return self
    
    def predict(self, X):
        """Realiza predicciones"""
        linear_output = np.dot(X, self.weights) + self.bias
        return np.array([self.activation(x) for x in linear_output])

# Generar datos linealmente separables
np.random.seed(42)
n = 100
X_class = np.random.randn(n, 2)
y_class = (X_class[:, 0] + X_class[:, 1] > 0).astype(int)

# Entrenar perceptrón
perceptron = Perceptron(learning_rate=0.1, n_iterations=100)
perceptron.fit(X_class, y_class)

# Visualizar clasificación
plt.figure(figsize=(10, 8))
plt.scatter(X_class[y_class == 0][:, 0], X_class[y_class == 0][:, 1], 
           c='#667eea', label='Clase 0', alpha=0.6, s=50, edgecolors='white')
plt.scatter(X_class[y_class == 1][:, 0], X_class[y_class == 1][:, 1], 
           c='#764ba2', label='Clase 1', alpha=0.6, s=50, edgecolors='white')

# Línea de decisión
x_min, x_max = X_class[:, 0].min() - 1, X_class[:, 0].max() + 1
y_min, y_max = X_class[:, 1].min() - 1, X_class[:, 1].max() + 1
xx, yy = np.meshgrid(np.linspace(x_min, x_max, 100),
                     np.linspace(y_min, y_max, 100))
Z = perceptron.predict(np.c_[xx.ravel(), yy.ravel()])
Z = Z.reshape(xx.shape)

plt.contourf(xx, yy, Z, alpha=0.2, levels=1, colors=['#667eea', '#764ba2'])
plt.xlabel('Feature 1', fontsize=12)
plt.ylabel('Feature 2', fontsize=12)
plt.title('Clasificación con Perceptrón', fontsize=14, fontweight='bold')
plt.legend(fontsize=11)
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()

print("✓ Perceptrón: clasificación binaria completada")

# 4. K-Nearest Neighbors (KNN)
class KNN:
    def __init__(self, k=3):
        self.k = k
        self.X_train = None
        self.y_train = None
    
    def fit(self, X, y):
        """Almacena datos de entrenamiento"""
        self.X_train = X
        self.y_train = y
        return self
    
    def predict(self, X):
        """Predice clases basándose en k vecinos más cercanos"""
        predictions = []
        for x in X:
            # Calcular distancias a todos los puntos de entrenamiento
            distances = [np.linalg.norm(x - x_train) for x_train in self.X_train]
            
            # Obtener índices de los k vecinos más cercanos
            k_indices = np.argsort(distances)[:self.k]
            k_nearest_labels = [self.y_train[i] for i in k_indices]
            
            # Votar por la clase más común
            most_common = max(set(k_nearest_labels), key=k_nearest_labels.count)
            predictions.append(most_common)
        
        return np.array(predictions)

# Usar los mismos datos de clasificación
knn = KNN(k=5)
knn.fit(X_class, y_class)

# Calcular precisión
predictions = knn.predict(X_class)
accuracy = np.mean(predictions == y_class)

print(f"✓ KNN (k=5): precisión = {accuracy*100:.1f}%")

# 5. Árbol de Decisión Simple
print("\n🌳 Árbol de Decisión (conceptual):")
print("  Ejemplo: Clasificar si jugar al aire libre")
print("  Reglas:")
print("    SI clima == 'Soleado' AND humedad < 70: JUGAR")
print("    SI clima == 'Lluvioso' AND viento == False: JUGAR")
print("    SINO: NO JUGAR")

# Datos de ejemplo
weather_data = [
    {'clima': 'Soleado', 'humedad': 65, 'viento': False, 'jugar': True},
    {'clima': 'Soleado', 'humedad': 85, 'viento': False, 'jugar': False},
    {'clima': 'Lluvioso', 'humedad': 70, 'viento': True, 'jugar': False},
    {'clima': 'Lluvioso', 'humedad': 75, 'viento': False, 'jugar': True},
]

def predict_play(clima, humedad, viento):
    """Árbol de decisión simple"""
    if clima == 'Soleado':
        return humedad < 70
    elif clima == 'Lluvioso':
        return not viento
    return False

print("\n  Predicciones:")
for data in weather_data:
    pred = predict_play(data['clima'], data['humedad'], data['viento'])
    resultado = "✓" if pred == data['jugar'] else "✗"
    print(f"    {resultado} {data['clima']}, H={data['humedad']}, V={data['viento']} → {pred}")

print("\n✅ ¡5 algoritmos de ML implementados desde cero!")
print("💡 Tip: Estos son algoritmos básicos - En producción usa scikit-learn")
