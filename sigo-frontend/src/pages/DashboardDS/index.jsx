import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

// 1. DEFINIÇÃO DO OBJETO 'styles' MOVIDA PARA O TOPO (CORREÇÃO DO ERRO)
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

  useEffect(() => {
    // Função para buscar dados ou usar mock
    const fetchDataAndRender = async () => {
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

      // --- GRÁFICO 2: Exemplo de Outro Gráfico (Barras) ---
      if (chartRef2.current) {
        // Exemplo de dados diferentes para o segundo gráfico
        const secondaryData = [
          { label: "Jan", value: 50 },
          { label: "Fev", value: 70 },
          { label: "Mar", value: 90 },
        ];

        new Chart(chartRef2.current, {
          type: "bar", // Tipo Bar
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
                text: "Ocorrências por Mês (Exemplo)",
              },
            },
          },
        });
      }
    };

    fetchDataAndRender();
  }, []);

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

      {/* CONTAINER DOS GRÁFICOS - USA GRID PARA ORGANIZAÇÃO */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", // Cria colunas responsivas
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {/* Gráfico 1: Frequência de Ocorrências (Doughnut) */}
        <div style={styles.chartContainer}>
          <canvas ref={chartRef1}></canvas>
        </div>

        {/* Gráfico 2: Ocorrências por Mês (Barras) */}
        <div style={styles.chartContainer}>
          <canvas ref={chartRef2}></canvas>
        </div>

        {/* Adicione mais divs para outros gráficos aqui */}
      </div>
    </div>
  );
}

export default DashboardDS;
