const CATEGORY_CSV = "../data/processed/dim_categoria.csv";
const FACT_CSV = "../data/processed/fato_ocorrencia.csv";

let factData = [];
let categoryData = [];

let categoryChart;
let priorityChart;

// =========================
// Carregamento dos dados
// =========================

function loadCSV(path) {
  return new Promise((resolve) => {
    Papa.parse(path, {
      download: true,
      header: true,
      complete: (result) => resolve(result.data),
    });
  });
}

async function loadData() {
  categoryData = await loadCSV(CATEGORY_CSV);
  factData = await loadCSV(FACT_CSV);
  renderCharts();
}

// =========================
// Filtros
// =========================

function getFilteredFacts() {
  const priority = document.getElementById("priorityFilter").value;

  if (priority === "all") {
    return factData;
  }

  return factData.filter((d) => d.priority === priority);
}

// =========================
// Gráficos
// =========================

function renderCharts() {
  const filteredFacts = getFilteredFacts();

  renderCategoryChart(filteredFacts);
  renderPriorityChart(filteredFacts);
}

function renderCategoryChart(data) {
  const counts = {};

  data.forEach((d) => {
    const category = categoryData.find(
      (c) => c.categoria_id === d.categoria_id
    )?.occurrence_category;

    if (!category) return;

    counts[category] = (counts[category] || 0) + 1;
  });

  const labels = Object.keys(counts);
  const values = Object.values(counts);

  if (categoryChart) categoryChart.destroy();

  categoryChart = new Chart(document.getElementById("categoryChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Ocorrências",
          data: values,
        },
      ],
    },
  });
}

function renderPriorityChart(data) {
  const counts = { low: 0, medium: 0, high: 0 };

  data.forEach((d) => {
    if (counts[d.priority] !== undefined) {
      counts[d.priority]++;
    }
  });

  if (priorityChart) priorityChart.destroy();

  priorityChart = new Chart(document.getElementById("priorityChart"), {
    type: "pie",
    data: {
      labels: ["Baixa", "Média", "Alta"],
      datasets: [
        {
          data: [counts.low, counts.medium, counts.high],
        },
      ],
    },
  });
}

// =========================
// Eventos
// =========================

document
  .getElementById("priorityFilter")
  .addEventListener("change", renderCharts);

// Inicialização
loadData();
