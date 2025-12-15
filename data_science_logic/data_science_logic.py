import polars as pl
import json
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

# 1. Carregar os Dados Tratados com Polars
try:
    # O arquivo 'dados.csv' deve estar no mesmo diretório ou no caminho correto
    df = pl.read_csv("dados.csv")
    print("Dados lidos com Polars com sucesso!")
except Exception as e:
    print(f"Erro ao ler dados.csv: {e}")
    exit()

# 2. Tratamento de Dados (Exemplo: Frequência de Categorias)
# Esta é a lógica que seu Back-End usaria para gerar o JSON para o Chart.js
frequency_summary = (
    df
    .group_by("occurrence_category") # Agrupa pela categoria da ocorrência
    .agg(pl.count().alias("count")) # Conta a frequência
)

# 3. Serialização para JSON (Formato esperado pelo Front-End)
# O Polars exporta facilmente para o formato que a API deve retornar
dashboard_json_data = frequency_summary.to_dicts()

# Salva o JSON gerado em um arquivo para referência
with open("dashboard_data.json", "w", encoding="utf-8") as f:
    json.dump(dashboard_json_data, f, indent=4)

print("\nJSON de Dashboard gerado (dashboard_data.json):")
print(json.dumps(dashboard_json_data, indent=4))
print("\n---")

# 4. Demonstração de Machine Learning (Classificação de Prioridade)
# Este código simula a lógica de treino que o Back-End faria

# Simplificação: Mapeia categorias de texto para números para o ML
df_ml = df.with_columns(
    pl.when(pl.col("priority") == "high").then(2)
    .when(pl.col("priority") == "medium").then(1)
    .otherwise(0)
    .alias("priority_encoded")
)

# Engenharia de Features: Usa one-hot encoding para as categorias
df_ml = df_ml.to_pandas() # Converte para Pandas temporariamente para usar scikit-learn
df_ml = pl.DataFrame(df_ml) # Converte de volta para Polars DataFrame
features = pl.get_dummies(df_ml.select(["occurrence_category", "occurrence_subcategory"]).to_pandas())

# Define X (features) e Y (target)
X = features
y = df_ml["priority_encoded"].to_numpy()

# Treinamento do modelo
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

print(f"Modelo de Regressão Logística treinado. Acurácia de teste: {model.score(X_test, y_test):.2f}")
print("Esta lógica demonstra o Item 2 (Implementar modelo de Machine Learning).")