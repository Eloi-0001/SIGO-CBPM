// =====================================================
// ETL SIGO - Analytics
// Fonte: Backend SIGO (senac-brigade-server)
// Tecnologia: Node.js + Polars
// =====================================================

import fs from "fs";
import fetch from "node-fetch";
import pl from "nodejs-polars";

// =====================================================
// CONFIGURAÇÕES GERAIS
// =====================================================

const SIGO_API_URL = "https://SEU_BACKEND_SIGO/analysis/occurrence";
const SIGO_API_TOKEN = "SEU_TOKEN_AQUI";

const OUTPUT_DIR = "../data/processed/";

// =====================================================
// EXTRACT - Consumo da API SIGO
// =====================================================

async function extractFromSIGO() {
  const response = await fetch(SIGO_API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${SIGO_API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao consumir API SIGO");
  }

  return await response.json();
}

// =====================================================
// TRANSFORM - Limpeza e tipagem
// =====================================================

function transform(rawData) {
  let df = pl.DataFrame(rawData);

  df = df.withColumns([
    pl.col("reported_timestamp").cast(pl.Float64),
    pl.col("arrival_timestamp").cast(pl.Float64),
    pl.col("resolved_timestamp").cast(pl.Float64),
    pl.col("latitude").cast(pl.Float64),
    pl.col("longitude").cast(pl.Float64),
    pl.col("priority").cast(pl.Utf8),
    pl.col("occurrence_category").cast(pl.Utf8),
    pl.col("occurrence_subcategory").cast(pl.Utf8),
    pl.col("applicant_role").cast(pl.Utf8),
  ]);

  return df;
}

// =====================================================
// LOAD - Modelo Dimensional (Star Schema)
// =====================================================

function load(df) {
  // Dimensão Categoria
  const dimCategoria = df
    .select(["occurrence_category", "occurrence_subcategory"])
    .unique()
    .withRowCount("categoria_id");

  // Dimensão Papel do Solicitante
  const dimApplicantRole = df
    .select(["applicant_role"])
    .unique()
    .withRowCount("applicant_role_id");

  // Tabela Fato
  const fatoOcorrencia = df
    .join(dimCategoria, {
      on: ["occurrence_category", "occurrence_subcategory"],
      how: "left",
    })
    .join(dimApplicantRole, {
      on: ["applicant_role"],
      how: "left",
    })
    .select([
      "occurrence_id",
      "categoria_id",
      "applicant_role_id",
      "priority",
      "reported_timestamp",
      "arrival_timestamp",
      "resolved_timestamp",
      "latitude",
      "longitude",
    ]);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  fs.writeFileSync(`${OUTPUT_DIR}dim_categoria.csv`, dimCategoria.writeCSV());
  fs.writeFileSync(
    `${OUTPUT_DIR}dim_applicant_role.csv`,
    dimApplicantRole.writeCSV()
  );
  fs.writeFileSync(
    `${OUTPUT_DIR}fato_ocorrencia.csv`,
    fatoOcorrencia.writeCSV()
  );
}

// =====================================================
// PIPELINE PRINCIPAL
// =====================================================

async function runETL() {
  const rawData = await extractFromSIGO();
  const df = transform(rawData);
  load(df);

  console.log("✅ ETL SIGO executado com sucesso");
}

runETL();
