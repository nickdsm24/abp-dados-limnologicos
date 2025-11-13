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

// --- Mapeamento de Métricas ---
// Mapeia a chave da API para um rótulo amigável, unidade e cor.
// Cores inspiradas no Tailwind para melhor contraste visual.
const METRICS: {
    [key: string]: { label: string; unit: string; color: string };
} = {
    tempar: { label: "Temperatura do Ar", unit: "°C", color: "#F97316" },
    tempag1: { label: "Temperatura da Água", unit: "°C", color: "#3B82F6" },
    pressatm: { label: "Pressão Atmosférica", unit: "hPa", color: "#10B981" },
    ur: { label: "Umidade Relativa", unit: "%", color: "#8B5CF6" },
    intensvt: { label: "Intensidade do Vento", unit: "m/s", color: "#F59E0B" },
    dirvt: { label: "Direção do Vento", unit: "graus", color: "#EC4899" },
    radincid: { label: "Radiação Incidente", unit: "W/m²", color: "#EF4444" },
    co2_high: { label: "CO2 (Alto)", unit: "ppm", color: "#6B7280" },
    precipitacao: { label: "Precipitação", unit: "mm", color: "#06B6D4" },
    // Adicione as outras colunas conforme necessário,
    // mas priorizamos as que têm unidades distintas e dados no exemplo.
};

// --- Interfaces de Dados ---

interface EstacaoSimaAninhada {
    idestacao: string;
    rotulo: string;
    lat: number;
    lng: number;
}

// Interface de Registro SIMA estendida para todos os parâmetros mensuráveis
interface SimaRegistro {
    idsima: number;
    datahora: string;
    // Parâmetros a serem plotados
    dirvt: number | null;
    intensvt: number | null;
    u_vel: number | null;
    v_vel: number | null;
    tempag1: number | null;
    tempag2: number | null;
    tempag3: number | null;
    tempag4: number | null;
    tempar: number | null;
    ur: number | null;
    tempar_r: number | null;
    pressatm: number | null;
    radincid: number | null;
    radrefl: number | null;
    co2_low: number | null;
    co2_high: number | null;
    precipitacao: number | null;
    // Outros campos
    estacao: EstacaoSimaAninhada;
    [key: string]: any; // Permite acesso dinâmico
}

interface ApiResponse<T> {
    success: boolean;
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    data: T[];
}

// --- Componente Principal: SimaGraph ---

const SimaGraph: React.FC = () => {
    const [simaRegistros, setSimaRegistros] = useState<SimaRegistro[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Estado para as métricas que o usuário selecionou, começa com Temperatura do Ar
    const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["tempar", "pressatm"]);

    // Função para lidar com a seleção/desseleção de métricas
    const handleMetricChange = useCallback((key: string) => {
        setSelectedMetrics((prev) => {
            if (prev.includes(key)) {
                // Não permite desmarcar se for a única selecionada
                if (prev.length > 1) {
                    return prev.filter((k) => k !== key);
                }
                return prev;
            } else {
                // Adiciona a nova métrica
                return [...prev, key];
            }
        });
    }, []);

    // --- Busca de dados da API ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Manter o URL original que usa a porta 3001
                const simaResponse = await fetch(
                    "http://localhost:3001/api/sima/sima/all?limit=10000"
                );

                if (!simaResponse.ok) {
                    throw new Error(
                        `Erro ${simaResponse.status} ao carregar dados SIMA.`
                    );
                }

                const simaData: ApiResponse<SimaRegistro> = await simaResponse.json();

                if (simaData.success) {
                    // Filtra e limita os registros
                    const validRecords = simaData.data.filter((r) => r.datahora).slice(0, 10000);
                    setSimaRegistros(validRecords);
                } else {
                    throw new Error("API retornou sucesso: false");
                }
            } catch (e) {
                if (e instanceof Error) {
                    setError(`Erro ao buscar dados: ${e.message}. Verifique se a API está rodando em http://localhost:3001.`);
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
        // 1. Determinar todos os rótulos de estação (Eixo X)
        const labels: string[] = Array.from(
            new Set(simaRegistros.map((r) => r.estacao.rotulo))
        ).sort((a, b) => a.localeCompare(b));

        // 2. Mapear dados de registro por rótulo de estação
        const recordsByStation = new Map<string, SimaRegistro[]>();
        simaRegistros.forEach((registro) => {
            const rotulo = registro.estacao.rotulo;
            if (!recordsByStation.has(rotulo)) {
                recordsByStation.set(rotulo, []);
            }
            recordsByStation.get(rotulo)!.push(registro);
        });

        // 3. Calcular as médias para as métricas selecionadas
        const datasets = selectedMetrics
            .map((metricKey) => {
                const metricInfo = METRICS[metricKey];
                // Ignora métricas não definidas
                if (!metricInfo) return null; 

                const avgData: (number | null)[] = [];

                labels.forEach((rotulo) => {
                    const records = recordsByStation.get(rotulo) || [];
                    let total = 0;
                    let count = 0;

                    records.forEach((record) => {
                        const value = record[metricKey as keyof SimaRegistro];
                        // Garante que o valor seja um número válido
                        if (typeof value === "number" && value !== null && !isNaN(value)) {
                            total += value;
                            count += 1;
                        }
                    });

                    if (count > 0) {
                        const avgValue = total / count;
                        // Adiciona o valor médio arredondado
                        avgData.push(parseFloat(avgValue.toFixed(2)));
                    } else {
                        // Se não houver dados, adicione null para pular o ponto no gráfico
                        avgData.push(null);
                    }
                });

                // 4. Cria o objeto Dataset do Chart.js
                return {
                    label: `${metricInfo.label} (${metricInfo.unit})`,
                    data: avgData,
                    borderColor: metricInfo.color,
                    backgroundColor: metricInfo.color + "30", // Cor de preenchimento com opacidade
                    fill: false,
                    tension: 0.3,
                    pointRadius: 4,
                    pointBackgroundColor: metricInfo.color,
                    yAxisID: metricKey, // ID do eixo Y corresponde à chave da métrica
                    hidden: avgData.every(d => d === null), // Esconde datasets sem dados
                };
            })
            .filter((ds) => ds !== null && !ds.hidden); // Remove métricas inválidas ou sem dados

        return {
            labels,
            datasets: datasets as ChartData<"line">["datasets"],
        };
    }, [simaRegistros, selectedMetrics]);

    // --- Opções do Gráfico (Eixos Y Dinâmicos) ---
    const options = useMemo<ChartOptions<"line">>(() => {
        // Cria um objeto de configuração de eixos
        const dynamicScales: { [key: string]: any } = {
            x: {
                title: {
                    display: true,
                    text: "Estação",
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
                position: index % 2 === 0 ? ("left" as const) : ("right" as const), // Alterna L/R
                title: {
                    display: true,
                    text: `${metricInfo.label} (${unit})`,
                    color: color,
                    font: { weight: 'bold' as const },
                },
                grid: {
                    // Apenas o primeiro eixo desenha as linhas de grade para não poluir
                    drawOnChartArea: index === 0, 
                    color: colors.sidebarBorder + '40',
                },
                ticks: {
                    color: color,
                    callback: function (value) {
                        return value + " " + unit;
                    },
                },
                // Permite o "stacking" de múltiplos eixos no mesmo lado
                // offset: true,
                // Garantir que o eixo comece de um ponto relevante, não de zero forçadamente
                beginAtZero: false, 
            };
        });

        // Retorna as opções completas do gráfico
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
                            ? `Métricas Médias por Estação (${selectedMetrics.length} selecionada${selectedMetrics.length > 1 ? 's' : ''})`
                            : "Selecione uma Métrica para Visualizar",
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
                                // Encontra a unidade baseada no ID do eixo
                                const metricKey = context.dataset.yAxisID;
                                const unit = METRICS[metricKey!]?.unit || "";
                                label += `: ${context.parsed.y} ${unit}`;
                            }
                            return label;
                        },
                    },
                },
            },
            scales: dynamicScales,
        };
    }, [selectedMetrics]);

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
                    Carregando dados SIMA (até 10000 registros)... 📊
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
                        Erro ao Carregar Dados
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

    if (simaRegistros.length === 0) {
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
                    Mim dê salário
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
                                    disabled={
                                        selectedMetrics.includes(key) &&
                                        selectedMetrics.length === 1
                                    }
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
                                Por favor, selecione pelo menos uma métrica acima.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SimaGraph;