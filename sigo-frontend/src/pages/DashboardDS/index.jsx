// Arquivo: src/pages/DashboardDS/index.jsx

import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
// Certifique-se de que o Chart.js está instalado: npm install chart.js

// URL COMPLETA DO ENDPOINT
const API_BASE_URL = "http://localhost:3000"; // Ajuste a porta do seu Back-End
const API_ENDPOINT = "/analysis/occurrence";
const FULL_API_URL = `${API_BASE_URL}${API_ENDPOINT}`;

const DashboardDS = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const fetchAndRenderChart = async () => {
      let apiData = [];

      try {
        const response = await fetch(FULL_API_URL);
        if (!response.ok) {
          throw new Error(
            `Erro: ${response.status}. Usando dados de fallback.`
          );
        }
        apiData = await response.json();

        // Mapeia os dados do JSON (Ex: [{"category": "fire", "count": 450}, ...])
        const labels = apiData.map((item) => item.category);
        const counts = apiData.map((item) => item.count);

        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext("2d");
        chartInstance.current = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Contagem de Ocorrências",
                data: counts,
                backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#4BC0C0",
                  "#9966FF",
                ],
                hoverOffset: 8,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Frequência de Ocorrências (Fonte: API /analysis/occurrence)",
              },
            },
          },
        });
      } catch (error) {
        console.error(
          "Falha ao se conectar com a API ou processar dados:",
          error.message
        );

        // ** Fallback: Dados de Exemplo (Mockados) **
        const mockData = [
          { category: "Fire", count: 40 },
          { category: "Medical", count: 55 },
          { category: "Rescue", count: 30 },
          { category: "Other", count: 15 },
        ];

        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext("2d");
        chartInstance.current = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: mockData.map((item) => item.category),
            datasets: [
              {
                data: mockData.map((item) => item.count),
                label: "Dados Mockados (API indisponível)",
                backgroundColor: ["#F2994A", "#EB5757", "#2F80ED", "#27AE60"],
              },
            ],
          },
          options: {
            plugins: {
              title: {
                display: true,
                text: "Frequência de Ocorrências (API Indisponível)",
              },
            },
          },
        });
      }
    };

    fetchAndRenderChart();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard de Data Science - Análise de Ocorrências</h2>
      <p>
        Visualização da Frequência de Ocorrências consumida do endpoint{" "}
        <strong>/analysis/occurrence</strong>.
      </p>
      <div style={{ maxWidth: "600px", margin: "20px auto" }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default DashboardDS;
