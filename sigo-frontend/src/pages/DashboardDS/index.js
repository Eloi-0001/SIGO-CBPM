import React, { useEffect, useRef } from "react";
// Certifique-se de que o Chart.js está instalado: npm install chart.js
import Chart from "chart.js/auto";

// *** NOVO ENDPOINT UTILIZADO ***
// Ajuste o BASE_URL se o Front-End e Back-End não estiverem rodando na mesma porta/domínio.
const API_BASE_URL = "http://localhost:3000"; // Exemplo: ajuste a porta do seu Back-End
const API_ENDPOINT = "/analysis/occurrence";
const FULL_API_URL = `${API_BASE_URL}${API_ENDPOINT}`;

const DashboardDS = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const fetchAndRenderChart = async () => {
      try {
        // 1. Faz o FETCH para o novo endpoint do Back-End
        const response = await fetch(FULL_API_URL);

        if (!response.ok) {
          throw new Error(
            `Erro: ${response.status}. Usando dados de fallback.`
          );
        }

        const apiData = await response.json();

        // -----------------------------------------------------
        // ** [Estrutura do JSON Esperada] **
        // Assume-se que o Back-End retorna dados já agregados, como:
        /* [
                     {"category": "fire", "count": 450},
                     {"category": "medic_emergency", "count": 210},
                     ...
                   ]
                */
        // -----------------------------------------------------

        // 2. Prepara os dados para o Chart.js
        const labels = apiData.map((item) => item.category);
        const counts = apiData.map((item) => item.count);

        // 3. Limpa o gráfico anterior
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        // 4. Cria o gráfico
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
          { category: "Atraso", count: 40 },
          { category: "Emergência", count: 55 },
          { category: "Resgate", count: 30 },
          { category: "Outros", count: 15 },
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
    <div>
      <h2>Dashboard de Data Science - Análise de Ocorrências</h2>
      <div style={{ maxWidth: "600px", margin: "20px auto" }}>
        <canvas ref={chartRef}></canvas>
      </div>
      <p>Fonte de Dados: HTTP GET /analysis/occurrence</p>
    </div>
  );
};

export default DashboardDS;
