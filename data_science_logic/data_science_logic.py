# data_science_logic.py

import polars as pl
import json
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

# ====================================================================
# PARTE 1: DEMONSTRAÇÃO DO POLARS E GERAÇÃO DO JSON PARA O DASHBOARD
# Objetivo: Simular o processamento que o Back-End faria para o endpoint /analysis/occurrence
# ====================================================================

FILE_PATH = "dados.csv"
OUTPUT_JSON_PATH = "dashboard_data.json"

print("--- Data Science Logic Demo (Polars & ML) ---")

# 1. Carregar os Dados Tratados com Polars
try:
    # O Polars é muito eficiente para ler e manipular dados em memória
    df = pl.read_csv(FILE_PATH)
    print(f"1. Dados lidos com Polars: {df.shape[0]} linhas, {df.shape[1]} colunas.")
except Exception as e:
    print(f"ERRO: Falha ao ler {FILE_PATH}. Certifique-se de que o arquivo está no mesmo diretório.")
    print(e)
    exit()

# 2. Processamento (Exemplo: Frequência de Ocorrências por Categoria)
# Este é o cálculo necessário para o Gráfico de Rosquinha no Front-End
frequency_summary = (
    df
    .group_by("occurrence_category") # Agrupa pela categoria
    .agg(pl.count().alias("count"))   # Conta a frequência de cada grupo
    .sort("count", descending=True)  # Ordena para melhor visualização
)

print("\n2. Resumo da Frequência de Ocorrências (Gerado por Polars):")
print(frequency_summary)

# 3. Serialização para JSON (Formato esperado pela API do Front-End)
# O Polars converte diretamente para uma lista de dicionários, o formato JSON ideal.
dashboard_json_data = frequency_summary.to_dicts()

# Salva o JSON em um arquivo para referência (mocking ou demonstração)
with open(OUTPUT_JSON_PATH, "w", encoding="utf-8") as f:
    json.dump(dashboard_json_data, f, indent=4)

print(f"\n3. JSON para o Dashboard gerado com sucesso em '{OUTPUT_JSON_PATH}'.")

# ====================================================================
# PARTE 2: IMPLEMENTAÇÃO DO MODELO DE MACHINE LEARNING (CLASSIFICAÇÃO)
# Objetivo: Demonstrar a criação de um modelo para prever a PRIORIDADE da ocorrência.
# ====================================================================

print("\n" + "="*50)
print("DEMONSTRAÇÃO DE MACHINE LEARNING (Classificação de Prioridade)")
print("="*50)

# A. Conversão de Tipos e Seleção de Features
# O scikit-learn (usado para ML) trabalha melhor com Pandas, então faremos uma transição segura.
df_ml = df.to_pandas()

# Colunas categóricas (features de entrada)
CATEGORICAL_FEATURES = ["occurrence_category", "occurrence_subcategory", "applicant_role"]
# Coluna alvo (o que queremos prever)
TARGET = "priority"

# B. Pré-processamento (One-Hot Encoding para features categóricas)
# O modelo de regressão logística (e muitos outros) requerem features numéricas.
preprocessor = ColumnTransformer(
    transformers=[
        ('cat', OneHotEncoder(handle_unknown='ignore'), CATEGORICAL_FEATURES)
    ],
    remainder='passthrough'
)

# C. Mapeamento da Variável Alvo (y)
# Transformar as classes de prioridade (low, medium, high) em números (0, 1, 2)
priority_mapping = {'low': 0, 'medium': 1, 'high': 2}
y = df_ml[TARGET].map(priority_mapping)

# D. Criação do Pipeline e Treinamento do Modelo
# O Pipeline junta o pré-processamento e o modelo final
model_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', LogisticRegression(max_iter=1000, solver='liblinear'))
])

# Define X (features)
X = df_ml[CATEGORICAL_FEATURES]

# Divide os dados para treino e teste
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Treina o modelo
print("\n4. Treinando o modelo de Classificação de Prioridade...")
model_pipeline.fit(X_train, y_train)

# E. Avaliação
accuracy = model_pipeline.score(X_test, y_test)
print(f"5. Modelo treinado: Regressão Logística.")
print(f"6. Acurácia de Teste (ML): {accuracy:.4f}")

# F. Exemplo de Predição (Simulando uma nova ocorrência da API)
new_data = pl.DataFrame({
    "occurrence_category": ["fire"],
    "occurrence_subcategory": ["residential"],
    "applicant_role": ["admin"]
}).to_pandas() # Converte para Pandas para o modelo

prediction = model_pipeline.predict(new_data)[0]
predicted_priority = list(priority_mapping.keys())[list(priority_mapping.values()).index(prediction)]

print(f"\n7. Exemplo de Predição para [fire, residential, admin]:")
print(f"   Prioridade Prevista (Encoded): {prediction}")
print(f"   Prioridade Prevista (Label): {predicted_priority.upper()}")
print("\n--- FIM DA DEMONSTRAÇÃO ---")