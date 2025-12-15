
# 📊 SIGO-CBPM: Módulo de Data Science e Análise Preditiva

Este repositório contém o projeto integrado do SIGO (Sistema Integrado de Gestão de Ocorrências da CBPM), focado na implementação de análises de dados e visualizações interativas para apoio à tomada de decisão. O módulo inclui uma lógica de processamento de dados robusta utilizando **Polars** e um dashboard analítico no Front-End desenvolvido com **React** e **Chart.js**.

-----

## 🚀 Visão Geral e Objetivo

O principal objetivo deste módulo é extrair insights de um conjunto de dados brutos (`dados.csv`) para otimizar a distribuição de recursos e a resposta a ocorrências. O projeto abrange três pilares:

1.  **Processamento de Dados:** Utilização do Polars para manipulação e agrupamento de grandes volumes de dados de ocorrências.
2.  **Modelo Preditivo:** Aplicação de um modelo de Machine Learning (Scikit-learn) para classificar o nível de prioridade das ocorrências.
3.  **Visualização Interativa:** Implementação de um dashboard no Front-End para exibir os resultados da análise.

-----

## 🛠️ Tecnologias Utilizadas

| Componente | Tecnologia | Finalidade |
| :--- | :--- | :--- |
| **Front-End** | `React` | Interface de usuário e SPA. |
| **Visualização** | `Chart.js` | Renderização de gráficos interativos. |
| **Empacotador** | `Vite` | Ferramenta de build e desenvolvimento rápido. |
| **Back-End (Lógica)** | `Python` (`data_science_logic.py`) | Manipulação de dados e lógica do modelo. |
| **Processamento** | `Polars` | Engenharia e agregação de *dataframes* otimizada. |
| **Machine Learning** | `Scikit-learn` | Treinamento e avaliação do modelo de classificação. |

-----

## 📁 Arquivos e Estrutura Adicionados

### Front-End (`sigo-frontend/`)

| Arquivo | Descrição |
| :--- | :--- |
| `src/pages/DashboardDS/index.jsx` | **O coração do módulo.** Contém a lógica React, referências (`useRef`) aos elementos `<canvas>`, chamadas `fetch` para a API de análise e toda a configuração e renderização dos quatro gráficos utilizando **Chart.js**. |
| `src/routes.jsx` | Adição da nova rota `<Route path="/dashboard-ds" element={<DashboardDS />} />` para permitir o acesso ao Dashboard analítico. |
| `package.json` | Inclusão da dependência essencial `chart.js` e `react-chartjs-2`. |

### Back-End / Lógica (do dashboard)

| Arquivo | Descrição |
| :--- | :--- |
| `data_science_logic.py` | Contém a lógica Python que lê o `dados.csv`, usa o Polars para limpar e agregar os dados (contagem por categoria), treina o modelo Scikit-learn e, idealmente, expõe esses dados agregados via um *endpoint* da API (ex: `/analysis/occurrence`). |
| `dados.csv` | Conjunto de dados brutos de ocorrências utilizado para todas as análises. |

-----

## 📊 Explicação dos Gráficos

O Dashboard Analítico (`/dashboard-ds`) foi configurado para exibir quatro visualizações principais, todas utilizando dados reais da API (se o Back-End estiver rodando) ou dados mockados (em caso de falha de conexão):

### 1\. Frequência de Ocorrências (Gráfico de Rosquinha)

  * **Objetivo:** Mostrar a distribuição percentual das principais categorias de ocorrências (Incêndio, Resgate, Acidente, Outros).

### 2\. Ocorrências por Mês (Exemplo) (Gráfico de Barras)

  * **Objetivo:** Visualizar a variação da atividade de ocorrências em uma janela de tempo específica (meses), útil para identificar sazonalidade e planejar recursos.

### 3\. Sazonalidade das Ocorrências (Gráfico de Barras)

  * **Objetivo:** Análise detalhada da flutuação das ocorrências por mês, ajudando a CBPM a alocar equipes de forma proativa.

### 4\. Distribuição de Prioridades (Gráfico de Pizza)

  * **Objetivo:** Exibir a proporção de ocorrências classificadas como Baixa, Média e Alta Prioridade. Este gráfico demonstra a aplicação prática do **Modelo de Machine Learning** para triagem inicial.

-----

## ⚙️ Como Rodar o Projeto Localmente

Para iniciar o Front-End e acessar o Dashboard, siga os passos abaixo no terminal, garantindo que você esteja no diretório `sigo-frontend`.

### Pré-requisitos

  * Node.js (LTS) e npm instalados.
  * Ter o código do repositório clonado localmente.

### 1\. Instalar Dependências

Navegue até o diretório do Front-End e instale todas as dependências, incluindo o `chart.js` e as bibliotecas do React.

```bash
cd sigo-frontend
npm install
```

### 2\. Iniciar o Servidor de Desenvolvimento

O Vite será inicializado, compilando o código e servindo a aplicação.

```bash
npm run dev
```

### 3\. Acessar o Dashboard

Com o servidor rodando, abra seu navegador e acesse a rota específica do Dashboard de Data Science:

```
http://localhost:5173/dashboard-ds
```

**Nota:** Se o Back-End (que fornece os dados via API) não estiver rodando na porta esperada (ex: `http://localhost:3000`), os gráficos serão carregados automaticamente com os **Dados Mockados (Fallback)**, garantindo a funcionalidade e visualização do Front-End.
