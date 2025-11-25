// src/pages/furnas/FurnasGraph.tsx
import React, { useState, useEffect, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
  type ChartEvent,
  type ActiveElement,
  Chart,
} from "chart.js";

// --- Registro do Chart.js ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// --- Configurações de Estilo (Tema Furnas - Verde/Esmeralda) ---
const THEME = {
  primary: "#06B6D4", // Cyan 500
  secondary: "#0EA5E9", // Sky 500
  accent: "#F59E0B", // Amber 500
  bgCard: "#1E293B", // Slate 800
  bgPage: "#0F172A", // Slate 900
  textMain: "#F8FAFC", // Slate 50
  textMuted: "#94A3B8", // Slate 400
  border: "#334155", // Slate 700
};

// --- Configuração da API ---
// Verifica se import.meta.env existe para evitar erros em ambientes ES2015/CommonJS
const API_BASE_URL = (import.meta.env && import.meta.env.VITE_API_BASE_URL) || "http://localhost:3001";

// --- Tipagem das Configurações ---
interface MetricConfig {
  label: string;
  unit: string;
}

interface DatasetConfig {
  label: string;
  endpoint: string;
  metrics: Record<string, MetricConfig>;
}

// --- CONFIGURAÇÃO MESTRA DE DATASETS E ROTAS ---
const DATASETS: Record<string, DatasetConfig> = {
  difusao: {
    label: "Difusão",
    endpoint: "/api/furnas/difusao/graph/analytics",
    metrics: {
      ch4: { label: "Metano (CH4)", unit: "fluxo" },
      co2: { label: "Dióxido de Carbono (CO₂)", unit: "fluxo" },
      n2o: { label: "Óxido Nitroso (N₂O)", unit: "fluxo" },
      ph: { label: "pH", unit: "" },
      tempagua: { label: "Temp. Água", unit: "°C" },
      tempar: { label: "Temp. Ar", unit: "°C" },
      profundidade: { label: "Profundidade", unit: "m" },
      vento: { label: "Vento", unit: "m/s" },
    },
  },
  abiotico_coluna: {
    label: "Abiótico (Coluna)",
    endpoint: "/api/furnas/abiotico-coluna/graph/analytics",
    metrics: {
      profundidade: { label: "Profundidade", unit: "m" },
      dic: { label: "DIC", unit: "µM" },
      nt: { label: "Nitrogênio Total", unit: "µM" },
      pt: { label: "Fósforo Total", unit: "µM" },
      delta13c: { label: "Delta 13C", unit: "‰" },
      delta15n: { label: "Delta 15N", unit: "‰" },
    },
  },
  abiotico_superficie: {
    label: "Abiótico (Superfície)",
    endpoint: "/api/furnas/abiotico-superficie/graph/analytics",
    metrics: {
      dic: { label: "DIC", unit: "µM" },
      nt: { label: "Nitrogênio Total", unit: "µM" },
      pt: { label: "Fósforo Total", unit: "µM" },
      delta13c: { label: "Delta 13C", unit: "‰" },
      delta15n: { label: "Delta 15N", unit: "‰" },
    },
  },
  horiba: {
    label: "Sonda Horiba",
    endpoint: "/api/furnas/horiba/graph/analytics",
    metrics: {
      profundidade: { label: "Profundidade", unit: "m" },
      tempAgua: { label: "Temp. Água", unit: "°C" },
      condutividade: { label: "Condutividade", unit: "µS/cm" },
      pH: { label: "pH", unit: "" },
      DO: { label: "Oxigênio Dissolvido", unit: "mg/L" },
      TDS: { label: "Sólidos Totais", unit: "mg/L" },
      redox: { label: "Potencial Redox", unit: "mV" },
      turbidez: { label: "Turbidez", unit: "NTU" },
    },
  },
};

// --- Interfaces ---
interface AnalyticsItem {
  id: number;
  label: string;
  media: number;
  minimo: number;
  maximo: number;
  desvio_padrao: number;
  contagem: number;
}

interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsItem[];
}

const FurnasDashboard: React.FC = () => {
  // --- Estados de Controle ---
  // Seleção do Dataset (Difusão, Horiba, etc)
  const [selectedDataset, setSelectedDataset] = useState<string>("difusao");
  
  // Seleção da Métrica (depende do Dataset)
  const [selectedMetric, setSelectedMetric] = useState<string>("ch4");
  
  // --- Estados de Dados ---
  const [reservoirData, setReservoirData] = useState<AnalyticsItem[]>([]);
  const [loadingReservoirs, setLoadingReservoirs] = useState(false);

  const [selectedReservoirId, setSelectedReservoirId] = useState<number | null>(null);
  const [selectedReservoirName, setSelectedReservoirName] = useState<string>("");
  const [siteData, setSiteData] = useState<AnalyticsItem[]>([]);
  const [loadingSites, setLoadingSites] = useState(false);

  // --- Helpers ---
  const currentDatasetConfig = DATASETS[selectedDataset];
  const currentMetricInfo = currentDatasetConfig.metrics[selectedMetric] || { label: selectedMetric, unit: "" };

  // --- Handler para mudança de Dataset ---
  const handleDatasetChange = (newDataset: string) => {
    setSelectedDataset(newDataset);
    // Reseta a métrica para a primeira disponível no novo dataset para evitar erros
    const firstMetric = Object.keys(DATASETS[newDataset].metrics)[0];
    setSelectedMetric(firstMetric);
    // Reseta seleção de reservatório
    setSelectedReservoirId(null);
    setSelectedReservoirName("");
    setSiteData([]);
  };

  // --- 1. Busca Dados dos Reservatórios ---
  useEffect(() => {
    const fetchReservoirs = async () => {
      setLoadingReservoirs(true);
      setSiteData([]);
      setSelectedReservoirId(null);
      setSelectedReservoirName("");

      try {
        const params = new URLSearchParams({
          metric: selectedMetric,
          groupBy: "reservatorio",
        });

        // Monta a URL usando a base + endpoint configurado
        const url = `${API_BASE_URL}${currentDatasetConfig.endpoint}?${params}`;
        
        const res = await fetch(url);
        const json: AnalyticsResponse = await res.json();

        if (json.success) {
          setReservoirData(json.data);
        } else {
            setReservoirData([]);
        }
      } catch (error) {
        console.error("Erro ao buscar reservatórios Furnas", error);
        setReservoirData([]);
      } finally {
        setLoadingReservoirs(false);
      }
    };

    fetchReservoirs();
  }, [selectedDataset, selectedMetric]);

  // --- 2. Busca Dados dos Sítios ---
  useEffect(() => {
    if (!selectedReservoirId) return;

    const fetchSites = async () => {
      setLoadingSites(true);
      try {
        const params = new URLSearchParams({
          metric: selectedMetric,
          groupBy: "sitio",
          filterReservatorioId: selectedReservoirId.toString(),
        });

        const url = `${API_BASE_URL}${currentDatasetConfig.endpoint}?${params}`;

        const res = await fetch(url);
        const json: AnalyticsResponse = await res.json();

        if (json.success) {
          setSiteData(json.data);
        } else {
            setSiteData([]);
        }
      } catch (error) {
        console.error("Erro ao buscar sítios Furnas", error);
        setSiteData([]);
      } finally {
        setLoadingSites(false);
      }
    };

    fetchSites();
  }, [selectedDataset, selectedMetric, selectedReservoirId]);

  // --- CONFIGURAÇÃO DO GRÁFICO DE RESERVATÓRIOS (MASTER) ---
  const reservoirChartConfig = useMemo<ChartData<"bar">>(() => {
    return {
      labels: reservoirData.map((d) => d.label),
      datasets: [
        {
          label: `Média de ${currentMetricInfo.label}`,
          data: reservoirData.map((d) => d.media),
          backgroundColor: reservoirData.map((d) => 
             d.id === selectedReservoirId ? THEME.accent : THEME.primary
          ),
          borderRadius: 4,
          barPercentage: 0.9, 
          categoryPercentage: 0.9,
          maxBarThickness: 60,
        },
      ],
    };
  }, [reservoirData, currentMetricInfo, selectedReservoirId]);

  // --- CONFIGURAÇÃO DO GRÁFICO DE SÍTIOS (DETAIL) ---
  const siteChartConfig = useMemo<ChartData<"bar">>(() => {
    return {
      labels: siteData.map((d) => d.label),
      datasets: [
        {
          label: `Média por Sítio`,
          data: siteData.map((d) => d.media),
          backgroundColor: THEME.secondary,
          borderRadius: 4,
          barPercentage: 0.8,
          maxBarThickness: 50,
        },
      ],
    };
  }, [siteData]);

  // --- OPÇÕES COMUNS & LÓGICA DE CLIQUE ---
  const masterOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    onHover: (event, _elements, _chart) => {
        // @ts-ignore
        event.native.target.style.cursor = 'pointer'; 
    },
    onClick: (event: ChartEvent, elements: ActiveElement[], chart: Chart) => {
        let index = -1;

        if (elements.length > 0) {
            index = elements[0].index;
        } else {
            const canvasPosition = {
                x: event.x,
                y: event.y
            };
            if (canvasPosition.x !== null && chart.scales.x) {
                index = chart.scales.x.getValueForPixel(canvasPosition.x) as number;
            }
        }

        if (index >= 0 && index < reservoirData.length) {
            const reservoir = reservoirData[index];
            setSelectedReservoirId(reservoir.id);
            setSelectedReservoirName(reservoir.label);
        }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: THEME.bgPage,
        titleColor: THEME.textMain,
        bodyColor: THEME.textMain,
        borderColor: THEME.border,
        borderWidth: 1,
        callbacks: {
            label: (ctx) => {
                const val = ctx.parsed.y;
                const unit = currentMetricInfo.unit;
                return `Média: ${val} ${unit}`;
            }
        }
      },
    },
    scales: {
      y: {
        grid: { color: THEME.border + "40" },
        ticks: { color: THEME.textMuted },
        title: { 
            display: true, 
            text: currentMetricInfo.unit,
            color: THEME.textMuted,
            font: { size: 10 }
        }
      },
      x: {
        grid: { display: false },
        ticks: { 
            color: THEME.textMuted,
            font: { size: 11 } 
        },
      },
    },
  };

  const detailOptions: ChartOptions<"bar"> = {
      ...masterOptions,
      onClick: undefined, 
      onHover: undefined
  };

  return (
    <div
      className="min-h-screen p-4 md:p-8 font-sans"
      style={{ backgroundColor: THEME.bgPage, color: THEME.textMain }}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* --- Cabeçalho e Controles --- */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-end md:items-center gap-4 border-b border-slate-700 pb-6">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
                    <span className="w-2 h-8 rounded bg-cyan-700 block"></span>
                    Analytics Furnas
                </h1>
                <p className="text-slate-400 text-sm">
                    Monitoramento multidimensional por reservatório e sítio.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-lg w-full md:w-auto">
                
                {/* SELETOR DE FONTE DE DADOS */}
                <div className="flex flex-col min-w-[220px]">
                    <label className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-bold">Fonte de Dados</label>
                    <select 
                        value={selectedDataset}
                        onChange={(e) => handleDatasetChange(e.target.value)}
                        className="bg-slate-700 text-white border border-slate-600 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                    >
                        {Object.entries(DATASETS).map(([key, config]) => (
                            <option key={key} value={key}>{config.label}</option>
                        ))}
                    </select>
                </div>

                {/* SELETOR DE MÉTRICA (DINÂMICO) */}
                <div className="flex flex-col min-w-[220px]">
                    <label className="text-xs text-amber-400 mb-1 uppercase tracking-wider font-bold">Métrica Analisada</label>
                    <select 
                        value={selectedMetric}
                        onChange={(e) => setSelectedMetric(e.target.value)}
                        className="bg-slate-700 text-white border border-slate-600 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    >
                        {Object.entries(currentDatasetConfig.metrics).map(([key, info]) => (
                            <option key={key} value={key}>{info.label}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>

        {/* --- Área de Gráficos (Master - Detail) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* GRÁFICO 1: RESERVATÓRIOS (MASTER) */}
            <div className={`p-6 rounded-xl border transition-all duration-300 ${loadingReservoirs ? 'opacity-70' : 'opacity-100'}`}
                 style={{ backgroundColor: THEME.bgCard, borderColor: THEME.border }}>
                
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-cyan-400">Por Reservatório</h2>
                        <span className="text-xs text-slate-400">{currentDatasetConfig.label}</span>
                    </div>
                    <span className="text-xs bg-cyan-900/30 text-cyan-200 border border-cyan-800 px-2 py-1 rounded">
                        Clique para filtrar
                    </span>
                </div>

                <div className="h-[400px] relative">
                    {loadingReservoirs && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <span className="animate-spin h-10 w-10 border-4 border-emerald-500 rounded-full border-t-transparent"></span>
                        </div>
                    )}
                    
                    {!loadingReservoirs && reservoirData.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                            <svg className="w-12 h-12 mb-2 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                            <p>Sem dados para {currentMetricInfo.label}.</p>
                        </div>
                    ) : (
                        <Bar 
                            data={reservoirChartConfig} 
                            options={masterOptions} 
                        />
                    )}
                </div>
            </div>

            {/* GRÁFICO 2: SÍTIOS (DETAIL) */}
            <div className={`p-6 rounded-xl border transition-all duration-300 ${selectedReservoirId ? 'opacity-100 shadow-2xl ring-1 ring-slate-600' : 'opacity-50 grayscale'}`}
                 style={{ backgroundColor: THEME.bgCard, borderColor: THEME.border }}>
                
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-sky-400">
                        {selectedReservoirName 
                            ? `Sítios de ${selectedReservoirName}` 
                            : "Visão Detalhada"}
                    </h2>
                    {!selectedReservoirId && (
                        <span className="text-xs text-slate-500 italic">
                            Selecione um reservatório &larr;
                        </span>
                    )}
                </div>

                <div className="h-[400px] relative">
                    {loadingSites && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80 z-10 backdrop-blur-sm rounded-lg">
                            <span className="animate-spin h-10 w-10 border-4 border-sky-500 rounded-full border-t-transparent"></span>
                        </div>
                    )}

                    {!selectedReservoirId ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-700 rounded-lg bg-slate-800/30">
                            <p>Selecione um reservatório no gráfico ao lado</p>
                            <p className="text-sm mt-1">para comparar os sítios de coleta.</p>
                        </div>
                    ) : siteData.length === 0 && !loadingSites ? (
                        <div className="h-full flex items-center justify-center text-slate-500">
                            Nenhum dado de sítio encontrado.
                        </div>
                    ) : (
                        <Bar 
                            data={siteChartConfig} 
                            options={detailOptions} 
                        />
                    )}
                </div>
            </div>

        </div>

        {/* Rodapé Informativo */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs text-slate-500">
             <div className="bg-slate-800 p-4 rounded border border-slate-700">
                <strong className="block text-slate-300 text-lg mb-1">{currentDatasetConfig.label}</strong>
                Fonte de Dados
             </div>
             <div className="bg-slate-800 p-4 rounded border border-slate-700">
                <strong className="block text-cyan-400 text-2xl mb-1">{reservoirData.length}</strong>
                Reservatórios
             </div>
             <div className="bg-slate-800 p-4 rounded border border-slate-700">
                <strong className="block text-sky-400 text-2xl mb-1">
                    {selectedReservoirId ? siteData.length : '-'}
                </strong>
                Sítios Visíveis
             </div>
             <div className="bg-slate-800 p-4 rounded border border-slate-700">
                <strong className="block text-amber-400 text-lg mb-1 truncate px-2">
                    {currentMetricInfo.unit || "N/A"}
                </strong>
                Unidade
             </div>
        </div>

      </div>
    </div>
  );
};

export default FurnasDashboard;