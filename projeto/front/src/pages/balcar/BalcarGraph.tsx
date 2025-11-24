import React, { useState, useEffect, useMemo} from "react";
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

// --- Configurações de Estilo (Dark Theme Consistente) ---
const THEME = {
  primary: "#10B981", // Emerald 500
  secondary: "#008000", // Blue 500
  accent: "#F97316", // Orange 500 (Destaque)
  bgCard: "#1E293B", // Slate 800
  bgPage: "#0F172A", // Slate 900
  textMain: "#F8FAFC", // Slate 50
  textMuted: "#94A3B8", // Slate 400
  border: "#334155", // Slate 700
};

// --- Mapeamento de Métricas ---
const METRICS: { [key: string]: { label: string; unit: string } } = {
  ch4: { label: "Metano (CH4)", unit: "ppm" },
  tempar: { label: "Temperatura do Ar", unit: "°C" },
  tempaguasubsuperficie: { label: "Temp. Água (Superfície)", unit: "°C" },
  phsubsuperficie: { label: "pH", unit: "" },
  condutividadesubsuperficie: { label: "Condutividade", unit: "mS/cm" },
  odsubsuperficie: { label: "Oxigênio Dissolvido", unit: "mg/L" },
  batimetria: { label: "Profundidade (Batimetria)", unit: "m" },
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

const BalcarGraph: React.FC = () => {
  // --- Estados de Controle ---
  const [selectedMetric, setSelectedMetric] = useState<string>("ch4");
  
  // --- Estados de Dados (Master - Reservatórios) ---
  const [reservoirData, setReservoirData] = useState<AnalyticsItem[]>([]);
  const [loadingReservoirs, setLoadingReservoirs] = useState(false);

  // --- Estados de Dados (Detail - Sítios) ---
  const [selectedReservoirId, setSelectedReservoirId] = useState<number | null>(null);
  const [selectedReservoirName, setSelectedReservoirName] = useState<string>("");
  const [siteData, setSiteData] = useState<AnalyticsItem[]>([]);
  const [loadingSites, setLoadingSites] = useState(false);

  // --- 1. Busca Dados dos Reservatórios (Master) ---
  useEffect(() => {
    const fetchReservoirs = async () => {
      setLoadingReservoirs(true);
      // Ao mudar o filtro global, limpamos a seleção de detalhe
      setSiteData([]);
      setSelectedReservoirId(null);
      setSelectedReservoirName("");

      try {
        const params = new URLSearchParams({
          metric: selectedMetric,
          groupBy: "reservatorio",
        });

        const res = await fetch(`http://localhost:3001/api/balcar/fluxo-inpe/graph/analytics?${params}`);
        const json: AnalyticsResponse = await res.json();

        if (json.success) {
          setReservoirData(json.data);
        }
      } catch (error) {
        console.error("Erro ao buscar reservatórios", error);
      } finally {
        setLoadingReservoirs(false);
      }
    };

    fetchReservoirs();
  }, [selectedMetric]); // Removemos selectedCampaign da dependência

  // --- 2. Busca Dados dos Sítios (Detail - Drill-down) ---
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

        const res = await fetch(`http://localhost:3001/api/balcar/fluxo-inpe/graph/analytics?${params}`);
        const json: AnalyticsResponse = await res.json();

        if (json.success) {
          setSiteData(json.data);
        }
      } catch (error) {
        console.error("Erro ao buscar sítios", error);
      } finally {
        setLoadingSites(false);
      }
    };

    fetchSites();
  }, [selectedReservoirId, selectedMetric]);

  // --- Handler de Clique no Gráfico de Reservatórios ---
  const handleReservoirClick = (_event: ChartEvent, elements: ActiveElement[]) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const reservoir = reservoirData[index];
      
      setSelectedReservoirId(reservoir.id);
      setSelectedReservoirName(reservoir.label);
    }
  };

  // --- Configuração dos Gráficos ---

  // Configuração Master (Reservatórios)
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
        },
      ],
    };
  }, [reservoirData, selectedMetric, selectedReservoirId]);

  // Configuração Detail (Sítios)
  const siteChartConfig = useMemo<ChartData<"bar">>(() => {
    return {
      labels: siteData.map((d) => d.label),
      datasets: [
        {
          label: `Média por Sítio`,
          data: siteData.map((d) => d.media),
          backgroundColor: THEME.secondary,
          borderRadius: 4,
        },
      ],
    };
  }, [siteData]);

  // Opções comuns
  const commonOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
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
            },
            afterLabel: () => ""
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
            color: THEME.textMuted 
        }
      },
      x: {
        grid: { display: false },
        ticks: { color: THEME.textMuted },
      },
    },
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
                    <span className="w-2 h-8 rounded bg-emerald-300 block"></span>
                    Painel Balcar
                </h1>
                <p className="text-slate-400 text-sm">
                    Análise comparativa de reservatórios e sítios de coleta.
                </p>
            </div>

            <div className="flex gap-4 bg-slate-800 p-4 rounded-lg border border-slate-700">
                <div className="flex flex-col">
                    <label className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-bold">Métrica</label>
                    <select 
                        value={selectedMetric}
                        onChange={(e) => setSelectedMetric(e.target.value)}
                        className="bg-slate-700 text-white border border-slate-600 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
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
            <div className={`p-6 rounded-xl border transition-all duration-300 ${loadingReservoirs ? 'opacity-50' : 'opacity-100'}`}
                 style={{ backgroundColor: THEME.bgCard, borderColor: THEME.border }}>
                
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-emerald-400">Por Reservatório</h2>
                    <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">
                        Clique na barra para detalhar
                    </span>
                </div>

                <div className="h-[400px] relative">
                    {loadingReservoirs && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="animate-spin h-8 w-8 border-4 border-emerald-500 rounded-full border-t-transparent"></span>
                        </div>
                    )}
                    
                    {!loadingReservoirs && reservoirData.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-slate-500">
                            Sem dados para esta métrica.
                        </div>
                    ) : (
                        <Bar 
                            data={reservoirChartConfig} 
                            options={{
                                ...commonOptions,
                                onClick: handleReservoirClick,
                                plugins: { ...commonOptions.plugins, title: { display: false } }
                            }} 
                        />
                    )}
                </div>
            </div>

            {/* GRÁFICO 2: SÍTIOS (DETAIL) */}
            <div className={`p-6 rounded-xl border transition-all duration-300 ${selectedReservoirId ? 'opacity-100' : 'opacity-40 grayscale'}`}
                 style={{ backgroundColor: THEME.bgCard, borderColor: THEME.border }}>
                
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-emerald-700">
                        {selectedReservoirName 
                            ? `Sítios de ${selectedReservoirName}` 
                            : "Visão Detalhada"}
                    </h2>
                    {!selectedReservoirId && (
                        <span className="text-xs text-slate-500 italic">
                            Selecione um reservatório ao lado
                        </span>
                    )}
                </div>

                <div className="h-[400px] relative">
                    {loadingSites && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 z-10">
                            <span className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></span>
                        </div>
                    )}

                    {!selectedReservoirId ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-700 rounded-lg">
                            <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                            <p>Clique em uma barra à esquerda</p>
                            <p className="text-sm">para ver a comparação entre sítios.</p>
                        </div>
                    ) : siteData.length === 0 && !loadingSites ? (
                        <div className="h-full flex items-center justify-center text-slate-500">
                            Nenhum dado de sítio encontrado.
                        </div>
                    ) : (
                        <Bar 
                            data={siteChartConfig} 
                            options={commonOptions} 
                        />
                    )}
                </div>
            </div>

        </div>

        {/* Rodapé Informativo */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-xs text-slate-500">
             <div className="bg-slate-800 p-3 rounded">
                <strong className="block text-slate-300 text-lg mb-1">{reservoirData.length}</strong>
                Reservatórios Analisados
             </div>
             <div className="bg-slate-800 p-3 rounded">
                <strong className="block text-slate-300 text-lg mb-1">
                    {selectedReservoirId ? siteData.length : '-'}
                </strong>
                Sítios no Detalhe
             </div>
             <div className="bg-slate-800 p-3 rounded">
                <strong className="block text-slate-300 text-lg mb-1">
                    {selectedMetric ? METRICS[selectedMetric].unit : '-'}
                </strong>
                Unidade de Medida
             </div>
        </div>

      </div>
    </div>
  );
};

export default BalcarGraph;