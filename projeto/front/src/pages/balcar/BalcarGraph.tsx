/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo, useCallback } from "react";
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
    // Tipagem básica
    type ChartData,
    type ChartOptions,
    // Adicione Scale para eixos dinâmicos
    Scale,
} from "chart.js";

// --- Registro de Componentes do Chart.js ---
ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

// --- Paleta de Cores e Estilos ---
const colors = {
    primary: "#C2410C", // Laranja Queimado (Cor Sima)
    secondary: "#F97316", // Laranja Vibrante
    sidebarBg: "#1E293B", // Fundo Principal da Sidebar (Slate 800)
    sidebarText: "#F8FAFC", // Cor principal do texto (White/Slate 50)
    sidebarBorder: "#334155", // Borda sutil e separadores (Slate 700)
};

// --- Mapeamento de Métricas Balcar ---
const METRICS: {
    [key: string]: { label: string; unit: string; color: string };
} = {
    // Métricas principais do Balcar (Fluxo INPE)
    ch4: { label: "Metano (CH4)", unit: "ppm", color: "#F97316" }, // Laranja
    tempar: { label: "Temperatura do Ar", unit: "°C", color: "#EF4444" }, // Vermelho
    tempaguasubsuperficie: {
        label: "Temp Água (Subsuperfície)",
        unit: "°C",
        color: "#3B82F6", // Azul
    },
    phsubsuperficie: {
        label: "pH (Subsuperfície)",
        unit: "pH",
        color: "#10B981", // Verde
    },
    orpsubsuperficie: {
        label: "ORP (Subsuperfície)",
        unit: "mV",
        color: "#8B5CF6", // Roxo
    },
    condutividadesubsuperficie: {
        label: "Condutividade (Subsuperfície)",
        unit: "mS/cm",
        color: "#F59E0B", // Âmbar
    },
    odsubsuperficie: {
        label: "Oxigênio Dissolvido (Subsuperfície)",
        unit: "mg/L",
        color: "#06B6D4", // Ciano
    },
    tsdsubsuperficie: {
        label: "Sólidos Dissolvidos Totais (Subsuperfície)",
        unit: "g/L",
        color: "#EC4899", // Rosa
    },
    batimetria: { label: "Batimetria", unit: "m", color: "#6B7280" }, // Cinza
    // Adicione mais se necessário
};

// --- Interfaces de Dados Balcar (Fluxo INPE) ---

interface SitioAninhado {
    idsitio: number;
    nome: string; // Rótulo do Sítio
    lat: number;
    lng: number;
}

interface CampanhaAninhada {
    idcampanha: number;
    nrocampanha: number;
}

// Interface de Registro Balcar
interface BalcarRegistro {
    idfluxoinpe: number;
    campanha: CampanhaAninhada;
    sitio: SitioAninhado;
    datamedida: string;
    // Parâmetros a serem plotados
    ch4: number | null;
    batimetria: number | null;
    tempar: number | null;
    tempcupula: number | null;
    tempaguasubsuperficie: number | null;
    tempaguameio: number | null;
    tempaguafundo: number | null;
    phsubsuperficie: number | null;
    phmeio: number | null;
    phfundo: number | null;
    orpsubsuperficie: number | null;
    orpmeio: number | null;
    orpfundo: number | null;
    condutividadesubsuperficie: number | null;
    condutividademeio: number | null;
    condutividadefundo: number | null;
    odsubsuperficie: number | null;
    odmeio: number | null;
    odfundo: number | null;
    tsdsubsuperficie: number | null;
    tsdmeio: number | null;
    tsdfundo: number | null;
    [key: string]: any; // Permite acesso dinâmico para os campos de medição
}

interface ApiResponse<T> {
    success: boolean;
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    data: T[];
}

// --- Componente Principal: BalcarGraph ---

const BalcarGraph: React.FC = () => {
    const [balcarRegistros, setBalcarRegistros] = useState<BalcarRegistro[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Estado inicial com CH4 e Temp do Ar
    const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
        "ch4",
        "tempar",
    ]);

    // Função para lidar com a seleção/desseleção de métricas
    const handleMetricChange = useCallback((key: string) => {
        setSelectedMetrics((prev) => {
            if (prev.includes(key)) {
                // *** ALTERAÇÃO AQUI: Permite desmarcar a última métrica ***
                return prev.filter((k) => k !== key);
            } else {
                // Adiciona a nova métrica
                return [...prev, key];
            }
        });
    }, []);

    // --- Busca de dados da API Balcar (Fluxo INPE) ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                // URL da API Balcar (Fluxo INPE)
                const apiUrl =
                    "http://localhost:3001/api/balcar/fluxo-inpe/all?limit=10000";
                const balcarResponse = await fetch(apiUrl);

                if (!balcarResponse.ok) {
                    throw new Error(
                        `Erro ${balcarResponse.status} ao carregar dados Balcar (Fluxo INPE).`
                    );
                }

                const balcarData: ApiResponse<BalcarRegistro> =
                    await balcarResponse.json();

                if (balcarData.success) {
                    const validRecords = balcarData.data
                        .filter((r) => r.datamedida)
                        .slice(0, 10000);
                    setBalcarRegistros(validRecords);
                } else {
                    throw new Error("API retornou sucesso: false");
                }
            } catch (e) {
                if (e instanceof Error) {
                    setError(
                        `Erro ao buscar dados: ${e.message}. Verifique se a API está rodando em http://localhost:3001.`
                    );
                } else {
                    setError("Erro desconhecido ao buscar dados.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- Processamento dos dados para o Chart.js (Múltiplas Métricas) ---
    const chartData = useMemo<ChartData<"line">>(() => {
        // 1. Determinar todos os rótulos de Sítio (Eixo X)
        const labels: string[] = Array.from(
            new Set(balcarRegistros.map((r) => r.sitio.nome))
        ).sort((a, b) => a.localeCompare(b));

        // 2. Mapear dados de registro por rótulo de Sítio
        const recordsBySite = new Map<string, BalcarRegistro[]>();
        balcarRegistros.forEach((registro) => {
            const rotulo = registro.sitio.nome;
            if (!recordsBySite.has(rotulo)) {
                recordsBySite.set(rotulo, []);
            }
            recordsBySite.get(rotulo)!.push(registro);
        });

        // 3. Calcular as médias para as métricas selecionadas
        const datasets = selectedMetrics
            .map((metricKey) => {
                const metricInfo = METRICS[metricKey];
                if (!metricInfo) return null;

                const avgData: (number | null)[] = [];

                labels.forEach((rotulo) => {
                    const records = recordsBySite.get(rotulo) || [];
                    let total = 0;
                    let count = 0;

                    records.forEach((record) => {
                        const value = record[metricKey as keyof BalcarRegistro];

                        if (
                            typeof value === "number" &&
                            value !== null &&
                            !isNaN(value)
                        ) {
                            total += value;
                            count += 1;
                        }
                    });

                    if (count > 0) {
                        const avgValue = total / count;
                        avgData.push(parseFloat(avgValue.toFixed(2)));
                    } else {
                        avgData.push(null);
                    }
                });

                // 4. Cria o objeto Dataset do Chart.js
                return {
                    label: `${metricInfo.label} (${metricInfo.unit})`,
                    data: avgData,
                    borderColor: metricInfo.color,
                    backgroundColor: metricInfo.color + "30",
                    fill: false,
                    tension: 0.3,
                    pointRadius: 4,
                    pointBackgroundColor: metricInfo.color,
                    yAxisID: metricKey,
                    hidden: avgData.every((d) => d === null),
                };
            })
            .filter((ds) => ds !== null && !ds.hidden);

        return {
            labels,
            datasets: datasets as ChartData<"line">["datasets"],
        };
    }, [balcarRegistros, selectedMetrics]);

    // --- Opções do Gráfico (Eixos Y Dinâmicos) ---
    const options = useMemo<ChartOptions<"line">>(() => {
        const dynamicScales: { [key: string]: any } = {
            x: {
                title: {
                    display: true,
                    text: "Sítio de Medição",
                    color: colors.sidebarText,
                },
                grid: {
                    color: colors.sidebarBorder,
                },
                ticks: {
                    color: colors.sidebarText,
                },
            },
        };

        // Adiciona um eixo Y para cada métrica selecionada
        selectedMetrics.forEach((metricKey, index) => {
            const metricInfo = METRICS[metricKey];
            if (!metricInfo) return;

            const color = metricInfo.color;
            const unit = metricInfo.unit;

            dynamicScales[metricKey] = {
                type: "linear" as const,
                position: index % 2 === 0 ? ("left" as const) : ("right" as const),
                title: {
                    display: true,
                    text: `${metricInfo.label} (${unit})`,
                    color: color,
                    font: { weight: "bold" as const },
                },
                grid: {
                    drawOnChartArea: index === 0,
                    color: colors.sidebarBorder + "40",
                },
                ticks: {
                    color: color,
                    callback: function (value: any) {
                        return value + " " + unit;
                    },
                },
                beginAtZero: false,
            };
        });

        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "top" as const,
                    labels: {
                        color: colors.sidebarText,
                        usePointStyle: true,
                    },
                },
                title: {
                    display: true,
                    text:
                        selectedMetrics.length > 0
                            ? `Métricas Médias Balcar (Fluxo INPE) por Sítio (${selectedMetrics.length} selecionada${
                                  selectedMetrics.length > 1 ? "s" : ""
                              })`
                            : "Nenhuma Métrica Selecionada", // Título ajustado quando vazio
                    color: colors.primary,
                    font: {
                        size: 18,
                        weight: "bold" as const,
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || "";
                            if (context.parsed.y !== null) {
                                const metricKey = context.dataset.yAxisID;
                                const unit = METRICS[metricKey!]?.unit || "";
                                label += `: ${context.parsed.y} ${unit}`;
                            }
                            return label;
                        },
                        title: function (tooltipItems) {
                            if (tooltipItems.length > 0) {
                                const siteName = tooltipItems[0].label;
                                const latestRecord = balcarRegistros
                                    .filter(r => r.sitio.nome === siteName)
                                    .sort((a, b) => new Date(b.datamedida).getTime() - new Date(a.datamedida).getTime())[0];
                                
                                const dateInfo = latestRecord ? `Data: ${new Date(latestRecord.datamedida).toLocaleDateString()} (Campanha ${latestRecord.campanha.nrocampanha})` : '';

                                return [siteName, dateInfo].filter(Boolean);
                            }
                            return [];
                        }
                    },
                },
            },
            scales: dynamicScales,
        };
    }, [selectedMetrics, balcarRegistros]);

    // --- Renderização de Status ---

    if (loading) {
        return (
            <div
                className="p-8 flex justify-center items-center h-screen"
                style={{
                    backgroundColor: colors.sidebarBg,
                    color: colors.sidebarText,
                }}
            >
                <div className="text-xl font-semibold animate-pulse">
                    Carregando dados Balcar  (até 10000 registros)...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="p-8 text-center"
                style={{
                    backgroundColor: colors.sidebarBg,
                    color: colors.sidebarText,
                    minHeight: "100vh",
                }}
            >
                <div className="bg-red-900/50 p-6 rounded-lg border border-red-500">
                    <h2 className="text-2xl text-red-400 font-bold mb-4">
                        Erro ao Carregar Dados Balcar
                    </h2>
                    <p>{error}</p>
                    <p className="mt-2 text-sm text-red-300">
                        Por favor, confirme se o serviço em{" "}
                        <code>http://localhost:3001</code> está ativo.
                    </p>
                </div>
            </div>
        );
    }

    if (balcarRegistros.length === 0) {
        return (
            <div
                className="p-8 flex justify-center items-center h-screen"
                style={{
                    backgroundColor: colors.sidebarBg,
                    color: colors.sidebarText,
                }}
            >
                <div className="text-xl font-semibold">
                    Nenhum dado válido encontrado para exibição.
                </div>
            </div>
        );
    }

    return (
        <div
            className="p-4 md:p-8 font-inter"
            style={{
                backgroundColor: colors.sidebarBg,
                color: colors.sidebarText,
                minHeight: "100vh",
            }}
        >
            <div
                className="p-6 rounded-xl shadow-2xl"
                style={{
                    backgroundColor: colors.sidebarBorder,
                    border: `1px solid ${colors.sidebarBorder}`,
                    width: "100%",
                    maxWidth: "1400px",
                    margin: "0 auto",
                }}
            >
                <h1
                    className="text-2xl font-bold mb-6 text-center md:text-left"
                    style={{ color: colors.primary }}
                >
                    Dados Balcar (Médias por Sítio)
                </h1>

                {/* Seletor de Métricas */}
                <div className="mb-6 border-b pb-4 border-gray-600">
                    <p className="text-lg font-semibold mb-3">
                        Selecione as métricas para comparar:
                    </p>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                        {Object.entries(METRICS).map(([key, info]) => (
                            <label
                                key={key}
                                className={`cursor-pointer inline-flex items-center p-2 rounded-lg text-sm font-medium transition-all shadow-md flex-shrink-0 ${
                                    selectedMetrics.includes(key)
                                        ? `text-white ring-2 ring-offset-2 ring-offset-${colors.sidebarBorder} ring-[${info.color}]`
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                }`}
                                // Estilos inline para garantir a cor dinâmica do Tailwind
                                style={
                                    selectedMetrics.includes(key)
                                        ? { backgroundColor: info.color, color: "#FFF" }
                                        : {}
                                }
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedMetrics.includes(key)}
                                    onChange={() => handleMetricChange(key)}
                                    className="hidden"
                                    // *** REMOVIDO: disabled={selectedMetrics.includes(key) && selectedMetrics.length === 1} ***
                                />
                                {info.label} ({info.unit})
                            </label>
                        ))}
                    </div>
                </div>

                {/* Área do Gráfico */}
                <div className="h-[60vh] min-h-[400px]">
                    {chartData.datasets.length > 0 ? (
                        <Line data={chartData} options={options} />
                    ) : (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-xl text-gray-400">
                                Selecione pelo menos uma métrica acima.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BalcarGraph;