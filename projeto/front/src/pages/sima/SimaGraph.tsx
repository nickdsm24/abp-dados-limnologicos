import React, { useState, useEffect, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  // Adicione 'type' antes destes dois:
  type ChartData,
  type ChartOptions,
} from "chart.js";

// --- Registro do Chart.js ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// --- Configurações de Estilo (Dark Theme) ---
const THEME = {
  primary: "#F97316", // Orange 500
  bgCard: "#1E293B", // Slate 800
  bgPage: "#0F172A", // Slate 900
  textMain: "#F8FAFC", // Slate 50
  textMuted: "#94A3B8", // Slate 400
  border: "#334155", // Slate 700
};

// --- Mapeamento de Métricas (Chaves da API de Analytics) ---
// Note que as chaves agora correspondem ao retorno do backend (avg_*)
const METRICS: {
  [key: string]: { label: string; unit: string; color: string; type: "line" | "bar" };
} = {
  avg_tempar: { label: "Temp. Ar (Méd)", unit: "°C", color: "#F97316", type: "line" },
  max_tempar: { label: "Temp. Ar (Máx)", unit: "°C", color: "#fdba74", type: "line" }, // Laranja claro
  avg_temp_agua: { label: "Temp. Água", unit: "°C", color: "#3B82F6", type: "line" },
  avg_ur: { label: "Umidade Rel.", unit: "%", color: "#8B5CF6", type: "line" },
  avg_pressao: { label: "Pressão Atm", unit: "hPa", color: "#10B981", type: "line" },
  avg_vento: { label: "Vento", unit: "m/s", color: "#F59E0B", type: "line" },
  avg_radiacao: { label: "Radiação", unit: "W/m²", color: "#EF4444", type: "line" },
  total_chuva: { label: "Precipitação", unit: "mm", color: "#06B6D4", type: "bar" }, // Chuva geralmente é barra
};

// --- Interfaces ---
interface Station {
  idestacao: string;
  rotulo: string;
}

interface AnalyticsDataPoint {
  label: string; // Data formatada
  [key: string]: number | string;
}

interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsDataPoint[];
}

const SimaGraph: React.FC = () => {
  // --- Estados de Controle ---
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<string>("");
  
  // Datas iniciais (ex: Dezembro de 2016 conforme seus dados)
  const [startDate, setStartDate] = useState("2016-12-01");
  const [endDate, setEndDate] = useState("2016-12-31");
  const [granularity, setGranularity] = useState<"day" | "month">("day");

  // Estado dos Dados
  const [chartDataPoints, setChartDataPoints] = useState<AnalyticsDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Métricas selecionadas pelo usuário
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    "avg_tempar",
    "avg_temp_agua",
  ]);

  // --- 1. Carregar Lista de Estações (Ao montar) ---
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/sima/sima/graph/stations");
        const json = await res.json();
        if (json.success) {
          setStations(json.data);
          // Seleciona a primeira estação automaticamente se houver
          if (json.data.length > 0) setSelectedStation(json.data[0].idestacao);
        }
      } catch (err) {
        console.error("Erro ao buscar estações", err);
      }
    };
    fetchStations();
  }, []);

  // --- 2. Carregar Dados do Gráfico (Ao mudar filtros) ---
  useEffect(() => {
    if (!selectedStation) return;

    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams({
          stationId: selectedStation,
          start: startDate,
          end: endDate,
          granularity,
        });

        const res = await fetch(`http://localhost:3001/api/sima/sima/graph/analytics?${query}`);
        const json: AnalyticsResponse = await res.json();

        if (json.success) {
          setChartDataPoints(json.data);
        } else {
            setChartDataPoints([]);
            // Não tratar como erro crítico, apenas sem dados
        }
      } catch (err) {
        setError("Falha ao conectar com o servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedStation, startDate, endDate, granularity]);

  // --- 3. Manipuladores de UI ---
  const toggleMetric = (key: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // --- 4. Construção do Data Object para Chart.js ---
  const chartConfig = useMemo<ChartData<"line">>(() => {
    const labels = chartDataPoints.map((p) => {
        // Formatação simples da data para o eixo X
        const d = new Date(p.label);
        return granularity === 'day' 
            ? d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
            : d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
    });

    const datasets = selectedMetrics.map((metricKey) => {
      const info = METRICS[metricKey];
      return {
        label: info.label,
        data: chartDataPoints.map((p) => Number(p[metricKey]) || null),
        borderColor: info.color,
        backgroundColor: info.color,
        yAxisID: metricKey, // Eixo Y independente
        tension: 0.3, // Curva suave
        pointRadius: 3,
        pointHoverRadius: 6,
        borderWidth: 2,
        type: info.type as any, // Permite misturar Linha e Barra se necessário
      };
    });

    return { labels, datasets };
  }, [chartDataPoints, selectedMetrics, granularity]);

  // --- 5. Opções do Gráfico (Eixos Dinâmicos) ---
  const options = useMemo<ChartOptions<"line">>(() => {
    const scales: Record<string, any> = {
      x: {
        grid: { color: THEME.border },
        ticks: { color: THEME.textMuted },
      },
    };

    // Gera um eixo Y para cada métrica selecionada
    selectedMetrics.forEach((key, index) => {
      const info = METRICS[key];
      scales[key] = {
        type: "linear",
        display: true,
        position: index % 2 === 0 ? "left" : "right",
        grid: {
          drawOnChartArea: index === 0, // Apenas o primeiro desenha linhas horizontais
          color: THEME.border + "40", // Transparência
        },
        title: {
          display: true,
          text: info.unit,
          color: info.color,
          font: { size: 10, weight: "bold" },
        },
        ticks: { color: info.color },
      };
    });

    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          labels: { color: THEME.textMain, usePointStyle: true },
        },
        tooltip: {
            backgroundColor: THEME.bgPage,
            titleColor: THEME.textMain,
            bodyColor: THEME.textMain,
            borderColor: THEME.border,
            borderWidth: 1,
            callbacks: {
                label: (context) => {
                     const val = context.parsed.y;
                     // @ts-ignore
                     const unit = METRICS[context.dataset.yAxisID]?.unit || "";
                     return ` ${context.dataset.label}: ${val} ${unit}`;
                }
            }
        },
      },
      scales,
    };
  }, [selectedMetrics]);

  // --- Renderização ---
  return (
    <div
      className="min-h-screen p-4 md:p-8 font-sans"
      style={{ backgroundColor: THEME.bgPage, color: THEME.textMain }}
    >
      <div
        className="max-w-7xl mx-auto rounded-xl shadow-2xl overflow-hidden border"
        style={{ backgroundColor: THEME.bgCard, borderColor: THEME.border }}
      >
        {/* Cabeçalho e Controles */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span className="w-2 h-8 rounded bg-[#e3d7bf] block"></span>
              Monitoramento SIMA
            </h1>
            
            {/* Controles de Filtro */}
            <div className="flex flex-wrap gap-3 items-center bg-slate-900 p-3 rounded-lg border border-slate-700">
              
              {/* Select Estação */}
              <div className="flex flex-col">
                <label className="text-xs text-slate-400 mb-1">Estação</label>
                <select
                  className="bg-slate-800 border border-slate-600 text-sm rounded px-2 py-1 focus:ring-2 focus:ring-orange-500 outline-none"
                  value={selectedStation}
                  onChange={(e) => setSelectedStation(e.target.value)}
                  disabled={stations.length === 0}
                >
                  {stations.length === 0 && <option>Carregando...</option>}
                  {stations.map((s) => (
                    <option key={s.idestacao} value={s.idestacao}>
                      {s.rotulo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Data Inicio */}
              <div className="flex flex-col">
                <label className="text-xs text-slate-400 mb-1">Início</label>
                <input
                  type="date"
                  className="bg-slate-800 border border-slate-600 text-sm rounded px-2 py-1 outline-none"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              {/* Data Fim */}
              <div className="flex flex-col">
                <label className="text-xs text-slate-400 mb-1">Fim</label>
                <input
                  type="date"
                  className="bg-slate-800 border border-slate-600 text-sm rounded px-2 py-1 outline-none"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

               {/* Granularidade */}
               <div className="flex flex-col">
                <label className="text-xs text-slate-400 mb-1">Agrupar por</label>
                <select
                  className="bg-slate-800 border border-slate-600 text-sm rounded px-2 py-1 outline-none"
                  value={granularity}
                  onChange={(e) => setGranularity(e.target.value as "day" | "month")}
                >
                  <option value="day">Dia</option>
                  <option value="month">Mês</option>
                </select>
              </div>
            </div>
          </div>

          {/* Seleção de Métricas (Chips) */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(METRICS).map(([key, info]) => {
              const isActive = selectedMetrics.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => toggleMetric(key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                    isActive
                      ? "opacity-100 shadow-lg translate-y-[-1px]"
                      : "opacity-50 hover:opacity-80 bg-slate-800 border-slate-700"
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: info.color, color: "#fff", borderColor: info.color }
                      : { color: THEME.textMuted }
                  }
                >
                  {info.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Área do Gráfico */}
        <div className="relative h-[500px] w-full p-4 bg-slate-800/50">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10 backdrop-blur-sm">
              <div className="text-orange-500 font-bold animate-pulse text-lg">
                Processando dados analíticos...
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
               <div className="text-red-400 bg-red-900/20 border border-red-500/50 p-4 rounded text-center">
                 <p className="font-bold">Ops!</p>
                 <p>{error}</p>
               </div>
            </div>
          )}

          {!loading && !error && chartDataPoints.length === 0 && (
             <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-slate-500 text-center">
                    <p className="text-lg">Nenhum dado encontrado para este período.</p>
                    <p className="text-sm">Tente ajustar as datas ou trocar de estação.</p>
                </div>
             </div>
          )}

          {chartDataPoints.length > 0 && (
            <Line data={chartConfig} options={options} />
          )}
        </div>
        
        <div className="bg-slate-900 p-2 text-center text-xs text-slate-500 border-t border-slate-700">
           Total de registros analisados: {chartDataPoints.length} pontos temporais
        </div>
      </div>
    </div>
  );
};

export default SimaGraph;