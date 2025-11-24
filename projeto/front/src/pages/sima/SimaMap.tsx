import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Paleta de cores (ATUALIZADA: Tema Escuro + Bege/Cinza)
const colors = {
  // Cores Primárias (Bege/Cinza)
  primary: "#D2B48C", // Bege (para acentos e seleção)
  secondary: "#AAAAAA", // Cinza (para texto secundário)
  primaryText: "#000000", // Texto para usar sobre o Bege (Contraste)

  // Cores da Sidebar (Tema Escuro)
  sidebarBg: "#1F2937", // Fundo Principal da Sidebar (Cinza Escuro)
  sidebarBorder: "#374151", // Borda sutil e separadores
  sidebarItem: "#374151", // Fundo de itens e inputs
  sidebarHover: "#4B5563", // Fundo de hover
  sidebarText: "#F3F4F6", // Cor principal do texto (Branco/Cinza Claro)
  sidebarTextMuted: "#AAAAAA", // Cor do texto secundário (Cinza)

  // Cores do Mapa (UI Escura para Popups)
  mapPopupBg: "#374151", // Fundo do Popup (Escuro)
  mapPopupText: "#F3F4F6", // Texto do Popup (Claro)

  // Cores não utilizadas (mantidas para referência)
  mapMarkerSima: "#BDB76B",
  mapMarkerSimaVibrant: "#BDB76B",
  mapMarkerFurnas: "#1D4ED8",
  mapMarkerBalcar: "#047857",
  white: "#FFFFFF",
};

// --- Interfaces e Funções Úteis (Mantidas) ---

interface ImageMap {
  [key: string]: string;
}

// (MANTIDO) Objeto de imagens
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

// (MANTIDO) Função para mapear nome -> chave de imagem
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

// --- Interfaces de Dados (Mantidas) ---

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

// (ADICIONADO) Estilo do Círculo do Ícone
const getIconBgStyle = (isReservatorio: boolean) => {
  // Se não for reservatório, retorna um objeto vazio (ou de alinhamento)
  if (!isReservatorio) {
    return {
      backgroundColor: "transparent", // Mantém o espaço
    };
  }
  // Se for, aplica o fundo Bege
  return {
    backgroundColor: colors.primary, // Bege
    color: colors.primaryText, // Texto preto para contraste
  };
};

// --- Componente: SidebarItem (REFATORADO) ---

const SidebarItem: React.FC<{
  estacao: Estacao;
  onSelect: (id: string) => void;
  isSelected: boolean;
}> = ({ estacao, onSelect, isSelected }) => {
  const imageKey = formatNameForImageKey(estacao.rotulo);
  const isReservatorio = !!reservatorioImages[imageKey];

  return (
    <div
      className={`p-3 border rounded-lg cursor-pointer transition-colors shadow-sm flex items-center space-x-3`}
      style={{
        // Estilo Tema Escuro
        backgroundColor: isSelected ? colors.sidebarHover : colors.sidebarItem,
        borderColor: isSelected ? colors.primary : colors.sidebarBorder, // Borda Bege
        borderStyle: "solid",
        borderWidth: isSelected ? "2px" : "1px",
      }}
      onClick={() => onSelect(estacao.idestacao)}
    >
      {/* (ATUALIZADO) Círculo de ícone para reservatórios */}
      <div
        className={`p-1 rounded-full text-lg flex-shrink-0 flex items-center justify-center`}
        style={{
          ...getIconBgStyle(isReservatorio),
          width: "2rem", // 32px
          height: "2rem", // 32px
        }}
      >
        {isReservatorio ? "💧" : ""}
      </div>
      <h4 className="font-semibold" style={{ color: colors.sidebarText }}>
        {estacao.rotulo}
      </h4>
    </div>
  );
};

// --- Componente: Sidebar (CORRIGIDO COM BOTÃO "TODOS") ---

interface SidebarProps {
  searchText: string;
  setSearchText: (text: string) => void;
  filteredEstacoes: Estacao[];
  selectedEstacaoId: string | "all";
  onSelectEstacao: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  searchText,
  setSearchText,
  filteredEstacoes,
  selectedEstacaoId,
  onSelectEstacao,
}) => {
  return (
    <div
      className="w-96 p-4 overflow-y-auto shadow-xl flex-shrink-0"
      style={{
        height: "100%",
        zIndex: 10,
        backgroundColor: colors.sidebarBg, // Tema Escuro
        borderRight: `1px solid ${colors.sidebarBorder}`,
        color: colors.sidebarText, // Texto Claro
      }}
    >
      <h2 className="text-xl font-bold mb-1" style={{ color: colors.sidebarText }}>
        Localizações
      </h2>
      <p className="text-sm mb-4" style={{ color: colors.sidebarTextMuted }}>
        {filteredEstacoes.length} pontos encontrados
      </p>

      {/* (MANTIDO) Barra de Busca - Tema Escuro */}
      <div className="mb-6">
        {" "}
        {/* Aumentei o espaçamento */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
            style={{ color: colors.sidebarTextMuted }}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg focus:ring-opacity-50"
            style={
              {
                border: `1px solid ${colors.sidebarBorder}`,
                backgroundColor: colors.sidebarItem, // Fundo escuro
                color: colors.sidebarText, // Texto claro
                "--tw-ring-color": colors.primary, // Foco Bege
              } as React.CSSProperties
            }
          />
        </div>
      </div>

      <div className="space-y-3">
        {/* === BOTÃO "TODOS" ADICIONADO AQUI === */}
        <div
          className={`p-3 border rounded-lg cursor-pointer transition-colors shadow-sm flex items-center space-x-3`}
          style={{
            backgroundColor: selectedEstacaoId === "all" ? colors.sidebarHover : colors.sidebarItem,
            borderColor: selectedEstacaoId === "all" ? colors.primary : colors.sidebarBorder,
            borderStyle: "solid",
            borderWidth: selectedEstacaoId === "all" ? "2px" : "1px",
          }}
          onClick={() => onSelectEstacao("all")} // Seta o ID para "all"
        >
          {/* Ícone para "Todos" */}
          <div
            className={`p-1 rounded-full text-lg flex-shrink-0 flex items-center justify-center`}
            style={{
              backgroundColor: selectedEstacaoId === "all" ? colors.primary : "transparent",
              color: selectedEstacaoId === "all" ? colors.primaryText : colors.sidebarText,
              width: "2rem",
              height: "2rem",
            }}
          >
            🌍
          </div>
          <h4 className="font-semibold" style={{ color: colors.sidebarText }}>
            Todos os Pontos
          </h4>
        </div>
        {/* ======================================= */}

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
            Nenhuma localização encontrada.
          </p>
        )}
      </div>
    </div>
  );
};

// --- Configurações do Leaflet (Mantidas) ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const INITIAL_CENTER: [number, number] = [-13.5, -50.0];
const INITIAL_ZOOM = 5;

// --- Componente Principal: SimaMap (Lógica Simplificada) ---

const SimaMap: React.FC = () => {
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedEstacaoId, setSelectedEstacaoId] = useState<string | "all">("all");

  const formatDate = (dateString: string) =>
    dateString ? new Date(dateString).toLocaleDateString("pt-BR") : "N/A";

  // --- Busca de dados da API (Apenas Estações) ---
  useEffect(() => {
    const fetchData = async () => {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      try {
        const estacoesResponse = await fetch(`${API_BASE_URL}/api/sima/estacao/all?limit=10000`);

        if (!estacoesResponse.ok) throw new Error("Erro ao carregar dados");

        const estacoesData: ApiResponse<Estacao> = await estacoesResponse.json();

        if (estacoesData.success) {
          setEstacoes(estacoesData.data);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Filtros principais (Apenas Busca) ---
  const filteredEstacoesBase = useMemo(() => {
    let list = estacoes.filter((e) => e.lat && e.lng);

    if (searchText) {
      const q = searchText.toLowerCase();
      list = list.filter(
        (e) => e.rotulo.toLowerCase().includes(q) || e.idestacao.toLowerCase().includes(q),
      );
    }

    return list;
  }, [estacoes, searchText]);

  // --- Filtro final (com seleção) ---
  const filteredEstacoes = useMemo(() => {
    if (selectedEstacaoId === "all") return filteredEstacoesBase;
    const selected = filteredEstacoesBase.filter((e) => e.idestacao === selectedEstacaoId);
    return selected.length > 0 ? selected : filteredEstacoesBase;
  }, [selectedEstacaoId, filteredEstacoesBase]);

  // --- Centralização dinâmica ---
  const mapSettings = useMemo(() => {
    if (selectedEstacaoId !== "all") {
      const estacao = estacoes.find((e) => e.idestacao === selectedEstacaoId);
      if (estacao && estacao.lat && estacao.lng) {
        return { center: [estacao.lat, estacao.lng] as [number, number], zoom: 12 };
      }
    }
    return { center: INITIAL_CENTER, zoom: INITIAL_ZOOM };
  }, [selectedEstacaoId, estacoes]);

  // --- Estilos do Popup (ATUALIZADO para Tema Escuro) ---
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
  if (loading) return <div className="p-4">Carregando mapa... 🗺️</div>;

  return (
    <div className="flex" style={{ height: "calc(100vh - 80px)" }}>
      <style>{popupStyles}</style>

      <Sidebar
        searchText={searchText}
        setSearchText={setSearchText}
        filteredEstacoes={filteredEstacoesBase}
        selectedEstacaoId={selectedEstacaoId}
        onSelectEstacao={setSelectedEstacaoId}
      />

      {/* O fundo do mapa permanece claro */}
      <div className="flex-1 p-4 overflow-hidden" style={{ backgroundColor: "#FFFFFF" }}>
        <h1 className="text-3xl font-bold mb-4" style={{ color: "#333333" }}>
          Mapa - Áreas de Monitoramento - Projeto SIMA
        </h1>

        <MapContainer
          key={mapSettings.center.toString()} // Força o recenter
          center={mapSettings.center}
          zoom={mapSettings.zoom}
          scrollWheelZoom
          style={{ height: "100%", width: "100%", borderRadius: "12px" }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Marcadores */}
          {filteredEstacoes.map(
            (estacao) =>
              estacao.lat &&
              estacao.lng && (
                <Marker key={estacao.idestacao} position={[estacao.lat, estacao.lng]}>
                  <Popup
                    className="sima-popup" // Usa o estilo escuro
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
                            style={{ color: colors.primary }} // Título Bege
                            className="font-bold text-lg"
                          >
                            Estação: {estacao.rotulo}
                          </h3>
                          <p>ID: {estacao.idestacao}</p>
                          <p>Início: {formatDate(estacao.inicio)}</p>
                          <p>Fim: {estacao.fim ? formatDate(estacao.fim) : "Em operação"}</p>
                          <p>Lat: {estacao.lat.toFixed(4)}</p>
                          <p>Lng: {estacao.lng.toFixed(4)}</p>
                        </>
                      );
                    })()}
                  </Popup>
                </Marker>
              ),
          )}

          {/* (REMOVIDO) Círculos de Precipitação */}
        </MapContainer>
      </div>
    </div>
  );
};

export default SimaMap;