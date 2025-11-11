import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Paleta de cores
const colors = {
  // Cores Primárias/Secundárias para Ênfase e Marca (Tema "Sima")
  primary: '#C2410C',      // Laranja Queimado (Cor Sima)
  secondary: '#F97316',    // Laranja Vibrante (para Sítios/detalhes)
  white: '#FFFFFF',        // Cor do texto em botões primários

  // Cores da Sidebar (Tema Escuro - Neutro)
  sidebarBg: '#1E293B',      // Fundo Principal da Sidebar (Slate 800)
  sidebarBorder: '#334155', // Borda sutil e separadores (Slate 700)
  sidebarItem: '#334155',    // Fundo de itens não selecionados (Slate 700)
  sidebarHover: '#475569',   // Fundo de hover (Slate 600)
  sidebarText: '#F8FAFC',     // Cor principal do texto (White/Slate 50)
  sidebarTextMuted: '#94A3B8', // Cor do texto secundário/muted (Slate 400)

  // Cores do Mapa (UI Neutra)
  mapPopupBg: '#334155',    // Fundo do Popup do mapa (Slate 700)
  mapPopupText: '#F8FAFC', // Texto do Popup do mapa (White/Slate 50)

  // Cores dos Marcadores (Entidades)
  mapMarkerSima: '#C2410C',          // Laranja Queimado (Sima)
  mapMarkerSimaVibrant: '#F97316',  // Laranja Vibrante (Sítio Sima)

  // Outras cores do sistema (para consistência)
  mapMarkerFurnas: '#1D4ED8',
  mapMarkerBalcar: '#047857',
};

// --- Interfaces e Funções Úteis ---

interface ImageMap {
  [key: string]: string;
}

const reservatorioImages: ImageMap = {
  antar: "/mapa/antar.jpg",
  balbina: "/mapa/balbina.jpg",
  batalha: "/mapa/batalha.jpg",
  "belo-monte": "/mapa/belo-monte.jpg",
  corumba: "/mapa/corumba.jpg",
  curuai: "/mapa/curua.jpg",
  estreito: "/mapa/estreito.jpg",
  funil: "/mapa/funil.jpg",
  furnas: "/mapa/furnas.jpg",
  ibitinga: "/mapa/ibitinga.jpg",
  itumbiara: "/mapa/itumbiara.jpg",
  itaipu: "/mapa/itaipu.jpg",
  jirau: "/mapa/jirau.jpg",
  mamiraua: "/mapa/mamiraua.jpg",
  manso: "/mapa/manso.jpg",
  marimbondo: "/mapa/marimbondo.jpg",
  "mascarenhas-de-moraes": "/mapa/mascarenhas-de-moraes.jpg",
  "porto-colombia": "/mapa/porto-colombia.jpg",
  segredo: "/mapa/segredo.jpg",
  "serra-da-mesa": "/mapa/serra-da-mesa.jpg",
  "tres-marias": "/mapa/tres-marias.jpg",
  tucurui: "/mapa/tucurui.jpg",
  "santo-antonio": "/mapa/santo-antonio.jpg",
  xingo: "/mapa/xingo.jpg",
};

const formatNameForImageKey = (name: string): string => {
  const formattedName = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ /g, "-")
    .replace(/--/g, "-");

  const namesToMatch = [
    "mascarenhas-de-moraes",
    "serra-da-mesa",
    "tres-marias",
    "santo-antonio",
    "belo-monte",
    "porto-colombia",
  ];

  for (const matchName of namesToMatch) {
    if (formattedName.startsWith(matchName)) {
      return matchName;
    }
  }

  const baseMatch = formattedName.match(/^([a-z]+)/);
  if (baseMatch && baseMatch[1]) {
    return baseMatch[1];
  }

  return formattedName;
};

// --- Interfaces de Dados ---

interface ApiResponse<T> {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: T[];
}

interface Estacao {
  idestacao: string;
  rotulo: string;
  lat: number | null;
  lng: number | null;
  inicio: string;
  fim: string | null;
}

interface EstacaoSimaAninhada {
  idestacao: string;
  rotulo: string;
  lat: number;
  lng: number;
}

interface SimaRegistro {
  idsima: number;
  datahora: string;
  precipitacao: number | null;
  estacao: EstacaoSimaAninhada;
}

interface EstacaoComDados extends Estacao {
  ultimaPrecipitacao: number | null;
}

// --- Tipos e Funções da Sidebar ---

type TipoFiltro = "Todos" | "Coleta" | "Reservatório";
type StatusFiltro = "Todos" | "Aberto" | "Fechado";

const getIcon = (isReservatorio: boolean) => (isReservatorio ? "💧" : "🗑️");
const getIconBgStyle = (isReservatorio: boolean) => ({
  backgroundColor: isReservatorio ? colors.primary : colors.secondary, // Laranja Escuro e Laranja Vibrante
  color: colors.white,
});


// --- Componente: SidebarItem ---

const SidebarItem: React.FC<{
  estacao: EstacaoComDados;
  onSelect: (id: string) => void;
  isSelected: boolean;
}> = ({ estacao, onSelect, isSelected }) => {
  const imageKey = formatNameForImageKey(estacao.rotulo);
  const isReservatorio = !!reservatorioImages[imageKey];
  const statusText = estacao.fim ? "Fechado" : "Aberto";
  const statusColor = estacao.fim ? "text-red-400" : "text-green-400"; // Cores ajustadas para o fundo escuro
  const capacidade = isReservatorio
    ? Math.round(((estacao.ultimaPrecipitacao ?? 0) % 100) * 0.9) + 1
    : 45;

  const barColor =
    capacidade > 70
      ? "bg-green-500"
      : capacidade > 40
        ? "bg-yellow-500"
        : "bg-red-500";

  return (
    <div
      className={`p-3 border rounded-lg cursor-pointer transition-colors shadow-sm relative`}
      style={{
        backgroundColor: isSelected ? colors.sidebarHover : colors.sidebarItem, // Usa sidebarHover para o fundo selecionado
        borderColor: isSelected ? colors.primary : colors.sidebarBorder, // Borda primária (Laranja) ou sutil
        borderStyle: 'solid',
        borderWidth: isSelected ? '2px' : '1px',
      }}
      onClick={() => onSelect(estacao.idestacao)}
    >
      <div className="flex items-center space-x-3 mb-2">
        {/* ATUALIZADO: Usando 'getIconBgStyle' */}
        <div
          className={`p-2 rounded-full text-lg`}
          style={getIconBgStyle(isReservatorio)}
        >
          {getIcon(isReservatorio)}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold" style={{ color: colors.sidebarText }}>{estacao.rotulo}</h4>
        </div>
        <span className={`text-xs font-medium ${statusColor}`}>{statusText}</span>
      </div>

      <div className="mt-2 text-xs" style={{ color: colors.sidebarTextMuted }}>
        Capacidade / Nível (Simulado)
        <div className="flex items-center space-x-2">
          {/* Cor de fundo da barra de progresso ajustada para o tema escuro (gray-600) */}
          <div className="flex-1 w-full h-1 bg-gray-600 rounded-full">
            <div className={`h-1 rounded-full ${barColor}`} style={{ width: `${capacidade}%` }} />
          </div>
          <span className="font-medium" style={{ color: colors.sidebarText }}>{capacidade}%</span>
        </div>
      </div>
    </div>
  );
};

// --- Componente: Sidebar ---

interface SidebarProps {
  tipoFiltro: TipoFiltro;
  setTipoFiltro: (tipo: TipoFiltro) => void;
  statusFiltro: StatusFiltro;
  setStatusFiltro: (status: StatusFiltro) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  filteredEstacoes: EstacaoComDados[];
  totalReservatorios: number;
  totalColeta: number;
  selectedEstacaoId: string | "all";
  onSelectEstacao: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  tipoFiltro,
  setTipoFiltro,
  searchText,
  setSearchText,
  filteredEstacoes,
  totalColeta,
  totalReservatorios,
  selectedEstacaoId,
  onSelectEstacao,
  statusFiltro,
  setStatusFiltro,
}) => {
  return (
    <div
      className="w-96 p-4 overflow-y-auto shadow-xl flex-shrink-0"
      style={{
        height: "100%",
        zIndex: 10,
        backgroundColor: colors.sidebarBg, // Cor de fundo da sidebar
        borderRight: `1px solid ${colors.sidebarBorder}`, // Borda sutil
        color: colors.sidebarText // Cor do texto base
      }}
    >
      <h2 className="text-xl font-bold mb-1" style={{ color: colors.sidebarText }}>Localizações SIMA</h2>
      <p className="text-sm mb-4" style={{ color: colors.sidebarTextMuted }}>
        {filteredEstacoes.length} pontos encontrados
      </p>

      <div className="flex justify-between space-x-3 mb-4">
        {/* Card Coleta */}
        <div
          className="flex-1 p-3 rounded-lg flex items-center shadow-sm"
          style={{ border: `1px solid ${colors.sidebarBorder}`, backgroundColor: colors.sidebarItem }}
        >
          <div
            className={`p-2 rounded-full text-xl mr-2`}
            style={getIconBgStyle(false)}
          >🗑️</div>
          <div>
            <p className="text-sm" style={{ color: colors.sidebarTextMuted }}>Coleta</p>
            <p className="text-xl font-bold" style={{ color: colors.sidebarText }}>{totalColeta}</p>
          </div>
        </div>
        {/* Card Reservatórios */}
        <div
          className="flex-1 p-3 rounded-lg flex items-center shadow-sm"
          style={{ border: `1px solid ${colors.sidebarBorder}`, backgroundColor: colors.sidebarItem }}
        >
          <div
            className={`p-2 rounded-full text-xl mr-2`}
            style={getIconBgStyle(true)}
          >💧</div>
          <div>
            <p className="text-sm" style={{ color: colors.sidebarTextMuted }}>Reservatórios</p>
            <p className="text-xl font-bold" style={{ color: colors.sidebarText }}>{totalReservatorios}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: colors.sidebarTextMuted }} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg focus:ring-opacity-50"
            style={{
              border: `1px solid ${colors.sidebarBorder}`,
              backgroundColor: colors.sidebarItem, // Fundo do input
              color: colors.sidebarText, // Texto digitado
              '--tw-ring-color': colors.primary, // Foco Laranja
            } as React.CSSProperties} // <-- CORREÇÃO 1: Corrige o erro de tipo da prop customizada
          />
        </div>
      </div>

      <div className="mb-4 pt-6">
        <h3 className="font-semibold text-sm mb-2" style={{ color: colors.sidebarText }}>Tipo</h3>
        <div
          className="flex space-x-2 p-1 rounded-lg border"
          style={{
            borderColor: colors.sidebarBorder,
            backgroundColor: colors.sidebarItem // Fundo do container do filtro
          }}
        >
          {(["Todos", "Coleta", "Reservatório"] as TipoFiltro[]).map((tipo) => (
            <button
              key={tipo}
              onClick={() => setTipoFiltro(tipo)}
              className={`flex-1 p-2 rounded-lg text-sm font-medium transition-all ${tipoFiltro === tipo
                  ? "text-white shadow-sm"
                  : "hover:opacity-80"
                }`}
              style={
                // Botão Laranja
                tipoFiltro === tipo
                  ? { backgroundColor: colors.primary, color: colors.white }
                  : { color: colors.sidebarText, backgroundColor: 'transparent' }
              }
            >
              {tipo}
            </button>
          ))}
        </div>
      </div>

      {/* Filtro de Status */}
      <div className="mb-6">
        <h3 className="font-semibold text-sm mb-2" style={{ color: colors.sidebarText }}>Status (Em Operação)</h3>
        <div
          className="flex space-x-2 p-1 rounded-lg border"
          style={{
            borderColor: colors.sidebarBorder,
            backgroundColor: colors.sidebarItem
          }}
        >
          {(["Todos", "Aberto", "Fechado"] as StatusFiltro[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFiltro(status)}
              className={`flex-1 p-2 rounded-lg text-sm font-medium transition-all ${statusFiltro === status
                  ? "text-white shadow-sm"
                  : "hover:opacity-80"
                }`}
              style={
                // Botão Laranja
                statusFiltro === status
                  ? { backgroundColor: colors.primary, color: colors.white }
                  : { color: colors.sidebarText, backgroundColor: 'transparent' }
              }
            >
              {status}
            </button>
          ))}
        </div>
      </div>


      <div className="space-y-3">
        {filteredEstacoes.length > 0 ? (
          filteredEstacoes.map((estacao) => (
            <SidebarItem
              key={estacao.idestacao}
               estacao={estacao}
              onSelect={onSelectEstacao}
              isSelected={selectedEstacaoId === estacao.idestacao}
            />
          ))
        ) : (
          <p className="text-center p-8 text-sm" style={{ color: colors.sidebarTextMuted }}>
            Nenhuma localização encontrada com os filtros e busca atuais.
          </p>
        )}
      </div>
    </div>
  );
};

// --- Configurações do Leaflet ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Lógica dos estilos dos círculos
const getPrecipitacaoStyle = (mm: number | null) => {
  let color: string;
  let radius: number;

  if (mm === null || typeof mm === 'undefined') {
    color = colors.primary; // Estação sem dados (Laranja)
    radius = 6;
  } else if (mm > 50) {
    color = "#FF4500"; // > 50mm (Vermelho)
    radius = 12;
  } else if (mm > 20) {
    color = "#00CED1"; // > 20mm (Turquesa)
    radius = 9;
  } else if (mm > 0) {
    color = "#ADD8E6"; // > 0mm (Azul Claro)
    radius = 6;
  } else { // mm === 0
    color = "#CCCCCC"; // Exatamente 0mm (Cinza)
    radius = 5;
  }

  return { color, radius };
};

const INITIAL_CENTER: [number, number] = [-13.5, -50.0];
const INITIAL_ZOOM = 5;

// --- Componente Principal: SimaMap ---

const SimaMap: React.FC = () => {
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [simaRegistros, setSimaRegistros] = useState<SimaRegistro[]>([]);
  const [loading, setLoading] = useState(true);
  const [tipoFiltro, setTipoFiltro] = useState<TipoFiltro>("Todos");
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>("Todos");
  const [searchText, setSearchText] = useState("");
  const [selectedEstacaoId, setSelectedEstacaoId] = useState<string | "all">("all");

  const formatDate = (dateString: string) =>
    dateString ? new Date(dateString).toLocaleDateString("pt-BR") : "N/A";

  // --- Busca de dados da API ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [estacoesResponse, simaResponse] = await Promise.all([
          fetch("http://localhost:3001/api/sima/estacao/all?limit=10000"),
          fetch("http://localhost:3001/api/sima/sima/all?limit=10000"),
        ]);

        if (!estacoesResponse.ok || !simaResponse.ok)
          throw new Error("Erro ao carregar dados");

        const estacoesData: ApiResponse<Estacao> = await estacoesResponse.json();
        const simaData: ApiResponse<SimaRegistro> = await simaResponse.json();

        if (estacoesData.success && simaData.success) {
          setEstacoes(estacoesData.data);
          setSimaRegistros(simaData.data);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Combina Estações com última precipitação ---
  const estacoesComPrecipitacao = useMemo<EstacaoComDados[]>(() => {
    const lastPrecipitacaoMap = new Map<string, number | null>();
    
    // Encontra o registro mais recente para cada estação
    const latestTimestamps = new Map<string, string>();
    for (const registro of simaRegistros) {
        const id = registro.estacao.idestacao;
        const currentTimestamp = latestTimestamps.get(id);
        if (!currentTimestamp || registro.datahora > currentTimestamp) {
            latestTimestamps.set(id, registro.datahora);
            lastPrecipitacaoMap.set(id, registro.precipitacao);
        }
    }

    return estacoes
      .filter((e) => e.lat && e.lng)
      .map((e) => ({ ...e, ultimaPrecipitacao: lastPrecipitacaoMap.get(e.idestacao) ?? null })); // Usar null se não houver dados
  }, [estacoes, simaRegistros]);

  // --- Contadores ---
  const totalColeta = estacoesComPrecipitacao.filter(
    (e) => !reservatorioImages[formatNameForImageKey(e.rotulo)]
  ).length;
  const totalReservatorios = estacoesComPrecipitacao.filter(
    (e) => !!reservatorioImages[formatNameForImageKey(e.rotulo)]
  ).length;

  // --- Filtros principais ---
  const filteredEstacoesBase = useMemo(() => {
    let list = estacoesComPrecipitacao;

    if (tipoFiltro !== "Todos") {
      list = list.filter((e) => {
        const isReservatorio = !!reservatorioImages[formatNameForImageKey(e.rotulo)];
        return tipoFiltro === "Reservatório" ? isReservatorio : !isReservatorio;
      });
    }

    if (statusFiltro !== "Todos") {
      list = list.filter((e) =>
        statusFiltro === "Aberto" ? !e.fim : !!e.fim
      );
    }

    if (searchText) {
      const q = searchText.toLowerCase();
      list = list.filter(
        (e) =>
          e.rotulo.toLowerCase().includes(q) || e.idestacao.toLowerCase().includes(q)
      );
    }

    return list;
  }, [estacoesComPrecipitacao, tipoFiltro, statusFiltro, searchText]);

  // --- Filtro final (com seleção) ---
  const filteredEstacoes = useMemo(() => {
    if (selectedEstacaoId === "all") return filteredEstacoesBase;
    const selected = filteredEstacoesBase.filter(
      (e) => e.idestacao === selectedEstacaoId
    );
    // Se a estação selecionada estiver nos filtros, mostre só ela.
    // Senão, mostre a lista filtrada normal.
    return selected.length > 0 ? selected : filteredEstacoesBase;
  }, [selectedEstacaoId, filteredEstacoesBase]);

  // --- Centralização dinâmica ---
  const mapSettings = useMemo(() => {
    if (selectedEstacaoId !== "all") {
      const estacao = estacoesComPrecipitacao.find(
        (e) => e.idestacao === selectedEstacaoId
      );
      if (estacao && estacao.lat && estacao.lng) {
        return { center: [estacao.lat, estacao.lng] as [number, number], zoom: 12 };
      }
    }

    // A seleção de "all" ainda é usada internamente se a estação selecionada desaparecer.
    return { center: INITIAL_CENTER, zoom: INITIAL_ZOOM };
  }, [selectedEstacaoId, estacoesComPrecipitacao]);

  // <-- CORREÇÃO 2: Injeção de Estilo para Popups (Solução "Sem CSS Externo")
  // Define os estilos do popup usando os valores do objeto 'colors'
  // Usamos a classe 'sima-popup' para não conflitar com 'balcar-popup'
  const popupStyles = `
    .sima-popup .leaflet-popup-content-wrapper {
      background-color: ${colors.mapPopupBg};
      color: ${colors.mapPopupText};
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }
    .sima-popup .leaflet-popup-tip {
       background: ${colors.mapPopupBg};
    }
    .sima-popup .leaflet-popup-close-button {
       color: ${colors.mapPopupText} !important; 
       opacity: 0.7;
    }
    .sima-popup .leaflet-popup-close-button:hover {
       opacity: 1;
    }
  `;

  // --- Renderização ---
  if (loading) return <div className="p-4">Carregando mapa SIMA... 🗺️</div>;

  return (
    <div className="flex" style={{ height: "calc(100vh - 80px)" }}>
      {/* <-- CORREÇÃO 2 (Continuação): Renderiza a tag <style> no DOM */}
      <style>{popupStyles}</style>

      <Sidebar
        tipoFiltro={tipoFiltro}
        setTipoFiltro={setTipoFiltro}
        statusFiltro={statusFiltro}
        setStatusFiltro={setStatusFiltro}
        searchText={searchText}
        setSearchText={setSearchText}
        // A sidebar sempre mostra a lista filtrada completa
        filteredEstacoes={filteredEstacoesBase} 
        totalColeta={totalColeta}
        totalReservatorios={totalReservatorios}
        selectedEstacaoId={selectedEstacaoId}
        onSelectEstacao={setSelectedEstacaoId}
      />

      <div className="flex-1 p-4 overflow-hidden">
        <h1 className="text-3xl font-bold mb-4" style={{ color: colors.primary }}>
          Mapa de Monitoramento - Projeto SIMA
        </h1>

        <MapContainer
          center={mapSettings.center}
          zoom={mapSettings.zoom}
          scrollWheelZoom
          style={{ height: "100%", width: "100%", borderRadius: "12px" }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* O mapa renderiza apenas as estações selecionadas (ou todas, se 'all') */}
{           filteredEstacoes.map(
            (estacao) =>
              estacao.lat &&
              estacao.lng && (
                <Marker key={estacao.idestacao} position={[estacao.lat, estacao.lng]}>
                  <Popup
                    // <-- CORREÇÃO 3: Substitui a prop 'style' por 'className'
                    className="sima-popup"
                  >
                    {(() => {
                      const imageKey = formatNameForImageKey(estacao.rotulo);
                      const imageSrc = reservatorioImages[imageKey] || null;

                      return (
                        <>
                          {imageSrc && (
                            <img
                              src={imageSrc}
                              alt={`Imagem da Estação ${estacao.rotulo}`}
                              style={{
                                width: "100%",
                                height: "auto",
                                maxHeight: "150px",
                                marginBottom: "10px",
                                borderRadius: "4px",
                                objectFit: "cover",
                              }}
                            />
                          )}

                          <h3
                            style={{ color: colors.primary }} // Título Laranja
                            className="font-bold text-lg"
                          >
                            Estação: {estacao.rotulo}
                          </h3>
                          <p>ID: {estacao.idestacao}</p>
                          <p>Início: {formatDate(estacao.inicio)}</p>
                          <p>Fim: {estacao.fim ? formatDate(estacao.fim) : "Em operação"}</p>
A                       <p>Lat: {estacao.lat.toFixed(4)}</p>
                          <p>Lng: {estacao.lng.toFixed(4)}</p>
                        </>
                      );
                    })()}
                  </Popup>
                </Marker>
              )
          )}

          {/* Círculos de Precipitação */}
          {filteredEstacoes.map((estacao) => {
            const precipitacao = estacao.ultimaPrecipitacao; // Pode ser null
            const { color, radius } = getPrecipitacaoStyle(precipitacao);

            return (
              estacao.lat &&
              estacao.lng && (
                <CircleMarker
                  key={`precip-${estacao.idestacao}`}
                  center={[estacao.lat, estacao.lng]}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.7,
                    weight: 1,
                  }}
                  radius={radius}
                >
                  <Popup
                    // <-- CORREÇÃO 4: Substitui a prop 'style' por 'className'
                    className="sima-popup"
                  >
                    <h3 style={{ color }} className="font-bold text-lg">
                      Estação: {estacao.rotulo}
                    </h3>
                    <p>
                      Precipitação (último registro):{" "}
                      <strong style={{ color }}>
                        {precipitacao !== null ? `${precipitacao.toFixed(2)} mm` : "Sem dados"}
                      </strong>
                    </p>
                    <p>ID: {estacao.idestacao}</p>
                  </Popup>
              _ </CircleMarker>
              )
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default SimaMap;