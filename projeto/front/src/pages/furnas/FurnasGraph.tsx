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

// --- Mapeamento de Métricas ---
const METRICS: { [key: string]: { label: string; unit: string } } = {
  ch4: { label: "Metano (CH4)", unit: "fluxo" },
  co2: { label: "Dióxido de Carbono (CO₂)", unit: "fluxo" },
  n2o: { label: "Óxido Nitroso (N₂O)", unit: "fluxo" },
  ph: { label: "pH", unit: "" },
  tempagua: { label: "Temp. Água", unit: "°C" },
  tempar: { label: "Temp. Ar", unit: "°C" },
  profundidade: { label: "Profundidade", unit: "m" },
  vento: { label: "Vento", unit: "m/s" },
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
  const [selectedMetric, setSelectedMetric] = useState<string>("ch4");
  
  // --- Estados de Dados ---
  const [reservoirData, setReservoirData] = useState<AnalyticsItem[]>([]);
  const [loadingReservoirs, setLoadingReservoirs] = useState(false);

  const [selectedReservoirId, setSelectedReservoirId] = useState<number | null>(null);
  const [selectedReservoirName, setSelectedReservoirName] = useState<string>("");
  const [siteData, setSiteData] = useState<AnalyticsItem[]>([]);
  const [loadingSites, setLoadingSites] = useState(false);

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

        const res = await fetch(`http://localhost:3001/api/furnas/difusao/graph/analytics?${params}`);
        const json: AnalyticsResponse = await res.json();

        if (json.success) {
          setReservoirData(json.data);
        }
      } catch (error) {
        console.error("Erro ao buscar reservatórios Furnas", error);
      } finally {
        setLoadingReservoirs(false);
      }
    };

    fetchReservoirs();
  }, [selectedMetric]);

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

        const res = await fetch(`http://localhost:3001/api/furnas/difusao/graph/analytics?${params}`);
        const json: AnalyticsResponse = await res.json();

        if (json.success) {
          setSiteData(json.data);
        }
      } catch (error) {
        console.error("Erro ao buscar sítios Furnas", error);
      } finally {
        setLoadingSites(false);
      }
    };

    fetchSites();
  }, [selectedReservoirId, selectedMetric]);

  // --- CONFIGURAÇÃO DO GRÁFICO DE RESERVATÓRIOS (MASTER) ---

  const reservoirChartConfig = useMemo<ChartData<"bar">>(() => {
    return {
      labels: reservoirData.map((d) => d.label),
      datasets: [
        {
          label: `Média de ${METRICS[selectedMetric].label}`,
          data: reservoirData.map((d) => d.media),
          backgroundColor: reservoirData.map((d) => 
             d.id === selectedReservoirId ? THEME.accent : THEME.primary
          ),
          borderRadius: 4,
          // Tenta usar mais espaço horizontal para evitar barras finas
          barPercentage: 0.9, 
          categoryPercentage: 0.9,
          // Garante uma largura máxima para não ficar gigante se houver poucos dados
          maxBarThickness: 60,
        },
      ],
    };
  }, [reservoirData, selectedMetric, selectedReservoirId]);

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

  // --- OPÇÕES COMUNS & LÓGICA DE CLIQUE AVANÇADA ---

  const masterOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    // Muda o cursor para pointer para indicar interatividade em toda a área
    onHover: (event, _elements, _chart) => {
        // @ts-ignore
        event.native.target.style.cursor = 'pointer'; 
    },
    onClick: (event: ChartEvent, elements: ActiveElement[], chart: Chart) => {
        let index = -1;

        // 1. Tenta pegar pelo clique direto na barra
        if (elements.length > 0) {
            index = elements[0].index;
        } else {
            // 2. Se não clicou na barra, calcula baseado na posição X do mouse
            // Isso permite clicar no nome (rótulo) ou no espaço vazio da coluna
            const canvasPosition = {
                x: event.x,
                y: event.y
            };
            
            // Pega o índice correspondente à posição X do pixel
            if (canvasPosition.x !== null && chart.scales.x) {
                index = chart.scales.x.getValueForPixel(canvasPosition.x) as number;
            }
        }

        // Valida se o índice é válido e dispara a ação
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
                const unit = METRICS[selectedMetric].unit;
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
            text: METRICS[selectedMetric].unit,
            color: THEME.textMuted,
            font: { size: 10 }
        }
      },
      x: {
        grid: { display: false },
        ticks: { 
            color: THEME.textMuted,
            // Aumenta fonte para facilitar leitura e clique
            font: { size: 11 } 
        },
      },
    },
  };

  const detailOptions: ChartOptions<"bar"> = {
      ...masterOptions,
      onClick: undefined, // Gráfico de detalhe não precisa ser clicável da mesma forma
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
                    Painel Furnas (Difusão)
                </h1>
                <p className="text-slate-400 text-sm">
                    Monitoramento de emissões e qualidade da água por reservatório.
                </p>
            </div>

            <div className="flex gap-4 bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-lg">
                <div className="flex flex-col min-w-[200px]">
                    <label className="text-xs text-cyan-400 mb-1 uppercase tracking-wider font-bold">Métrica Analisada</label>
                    <select 
                        value={selectedMetric}
                        onChange={(e) => setSelectedMetric(e.target.value)}
                        className="bg-slate-700 text-white border border-slate-600 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    >
                        {Object.entries(METRICS).map(([key, info]) => (
                            <option key={key} value={key}>{info.label}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-bold">Campanha</label>
                    <div className="bg-slate-700/50 text-slate-300 border border-slate-600 rounded px-3 py-2 text-sm font-medium cursor-not-allowed select-none">
                       Todas as Campanhas
                    </div>
                </div>
            </div>
        </div>

        {/* --- Área de Gráficos (Master - Detail) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* GRÁFICO 1: RESERVATÓRIOS (MASTER) */}
            <div className={`p-6 rounded-xl border transition-all duration-300 ${loadingReservoirs ? 'opacity-70' : 'opacity-100'}`}
                 style={{ backgroundColor: THEME.bgCard, borderColor: THEME.border }}>
                
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-cyan-400">Por Reservatório</h2>
                    <span className="text-xs bg-cyan-900/30 text-cyan-200 border border-cyan-800 px-2 py-1 rounded">
                        Clique na barra ou nome
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
                            <p>Sem dados para esta métrica.</p>
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
                            Nenhum dado de sítio encontrado para este reservatório.
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
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-xs text-slate-500">
             <div className="bg-slate-800 p-4 rounded border border-slate-700">
                <strong className="block text-cyan-400 text-2xl mb-1">{reservoirData.length}</strong>
                Reservatórios com Dados
             </div>
             <div className="bg-slate-800 p-4 rounded border border-slate-700">
                <strong className="block text-sky-400 text-2xl mb-1">
                    {selectedReservoirId ? siteData.length : '-'}
                </strong>
                Sítios Monitorados
             </div>
             <div className="bg-slate-800 p-4 rounded border border-slate-700">
                <strong className="block text-amber-400 text-2xl mb-1">
                    {selectedMetric ? METRICS[selectedMetric].unit || "N/A" : '-'}
                </strong>
                Unidade ({METRICS[selectedMetric].label})
             </div>
        </div>

      </div>
    </div>
  );
};

export default FurnasDashboard;