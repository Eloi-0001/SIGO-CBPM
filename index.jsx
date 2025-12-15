import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

// 1. DEFINIÇÃO DO OBJETO 'styles' (MANTIDO NO TOPO)
const styles = {
  chartContainer: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    height: "400px",
  },
};

const API_BASE_URL = "http://localhost:3000";
const API_ENDPOINT = "/analysis/occurrence";

// Dados mockados (fallback) para o caso de o Back-End estar offline
const mockData = [
  { category: "Incêndio", count: 450 },
  { category: "Resgate", count: 320 },
  { category: "Acidente", count: 180 },
  { category: "Outros", count: 50 },
];

function DashboardDS() {
  const chartRef1 = useRef(null); // Ref para o Gráfico 1
  const chartRef2 = useRef(null); // Ref para o Gráfico 2
  const chartRef3 = useRef(null); // Ref para o Gráfico 3 (Ocorrências por Mês)
  const chartRef4 = useRef(null); // Ref para o Gráfico 4 (Prioridade)

  useEffect(() => {
    // Função para buscar dados ou usar mock
    const fetchDataAndRender = async () => {
      // 2. Variáveis de estado e fallback declaradas no topo da função (CORREÇÃO DE ESCOPO)
      let dataToRender = mockData;
      let titleSuffix = " (Dados Mockados)";

      try {
        const response = await fetch(API_BASE_URL + API_ENDPOINT);
        if (response.ok) {
          dataToRender = await response.json();
          titleSuffix = " (Dados Reais da API)";
        } else {
          console.warn("API offline ou erro. Usando dados mockados.");
        }
      } catch (error) {
        console.error("Erro ao conectar à API:", error);
      }

      const labels = dataToRender.map((item) => item.category);
      const dataCounts = dataToRender.map((item) => item.count);

      // --- GRÁFICO 1: Frequência de Ocorrências (Doughnut) ---
      if (chartRef1.current) {
        new Chart(chartRef1.current, {
          type: "doughnut",
          data: {
            labels: labels,
            datasets: [
              {
                data: dataCounts,
                backgroundColor: ["#007BFF", "#28A745", "#FFC107", "#DC3545"],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: "Frequência de Ocorrências" + titleSuffix,
              },
            },
          },
        });
      }

      // --- GRÁFICO 2: Exemplo de Outro Gráfico (Barras - Sem dados da API) ---
      if (chartRef2.current) {
        const secondaryData = [
          { label: "Jan", value: 50 },
          { label: "Fev", value: 70 },
          { label: "Mar", value: 90 },
        ];

        new Chart(chartRef2.current, {
          type: "bar",
          data: {
            labels: secondaryData.map((item) => item.label),
            datasets: [
              {
                label: "Ocorrências por Mês (Exemplo)",
                data: secondaryData.map((item) => item.value),
                backgroundColor: "#17A2B8",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                // O titleSuffix é acessível aqui.
                text: "Ocorrências por Mês (Exemplo) " + titleSuffix,
              },
            },
          },
        });
      }

      // --- GRÁFICO 3: Ocorrências por Mês (Barras) - Lógica de Renderização Movida (CORREÇÃO) ---
      const monthlyData = [
        { month: "Seg", count: 120 },
        { month: "Ter", count: 180 },
        { month: "Quar", count: 250 },
        { month: "Quin", count: 150 },
      ];

      if (chartRef3.current) {
        new Chart(chartRef3.current, {
          type: "bar",
          data: {
            labels: monthlyData.map((item) => item.month),
            datasets: [
              {
                label: "Ocorrências por Dia",
                data: monthlyData.map((item) => item.count),
                backgroundColor: "#FF8C00", // Laranja
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: "Sazonalidade das Ocorrências" + titleSuffix,
              },
            },
          },
        });
      }

      // --- GRÁFICO 4: Prioridade (Pizza) - Lógica de Renderização Movida (CORREÇÃO) ---
      const priorityData = [
        { priority: "Baixa", count: 600 },
        { priority: "Média", count: 350 },
        { priority: "Alta", count: 150 },
      ];

      if (chartRef4.current) {
        new Chart(chartRef4.current, {
          type: "pie", // Gráfico de Pizza
          data: {
            labels: priorityData.map((item) => item.priority),
            datasets: [
              {
                data: priorityData.map((item) => item.count),
                backgroundColor: ["#28A745", "#FFC107", "#DC3545"], // Verde, Amarelo, Vermelho
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: "Distribuição de Prioridades" + titleSuffix,
              },
            },
          },
        });
      }
    };

    fetchDataAndRender();
  }, []); // Dependência vazia, roda apenas uma vez

  return (
    <div style={{ padding: "20px", backgroundColor: "#f9f9f9" }}>
      <h1
        style={{
          color: "#007BFF",
          borderBottom: "2px solid #007BFF",
          paddingBottom: "10px",
        }}
      >
        Dashboard Analítico
      </h1>

      {/* CONTAINER PRINCIPAL DOS GRÁFICOS (REMOÇÃO DA DUPLICAÇÃO) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", // 2x2 Layout Responsivo
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {/* GRÁFICO 1 */}
        <div style={styles.chartContainer}>
          <canvas ref={chartRef1}></canvas>
        </div>

        {/* GRÁFICO 2 */}
        <div style={styles.chartContainer}>
          <canvas ref={chartRef2}></canvas>
        </div>

        {/* GRÁFICO 3 (NOVO) */}
        <div style={styles.chartContainer}>
          <canvas ref={chartRef3}></canvas>
        </div>

        {/* GRÁFICO 4 (NOVO) */}
        <div style={styles.chartContainer}>
          <canvas ref={chartRef4}></canvas>
        </div>
      </div>
      {/* O SEGUNDO DIV/GRID DUPLICADO FOI REMOVIDO AQUI */}
    </div>
  );
}

export default DashboardDS;
