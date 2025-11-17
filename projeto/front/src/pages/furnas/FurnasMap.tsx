import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Paleta de cores (Tema Furnas)
const colors = {
  primary: "#1D4ED8", // Azul Escuro (Blue 800)
  secondary: "#3B82F6", // Azul Vibrante (Blue 500)
  white: "#FFFFFF",
  sidebarBg: "#1E293B", // Fundo Principal da Sidebar (Slate 800)
  sidebarBorder: "#334155", // Borda sutil e separadores (Slate 700)
  sidebarItem: "#334155", // Fundo de itens não selecionados (Slate 700)
  sidebarHover: "#475569", // Fundo de hover (Slate 600)
  sidebarText: "#F8FAFC", // Cor principal do texto (White/Slate 50)
  sidebarTextMuted: "#94A3B8", // Cor do texto secundário/muted (Slate 400)
  mapPopupBg: "#334155", // Fundo do Popup do mapa (Slate 700)
  mapPopupText: "#F8FAFC", // Texto do Popup do mapa (White/Slate 50)
  mapMarkerFurnas: "#1D4ED8", // Azul (Cor primária)
  mapMarkerBalcar: "#047857", // Verde Esmeralda (Usado para "Sítio")
};

// --- Interfaces e Funções Úteis ---

interface ImageMap {
  [key: string]: string;
}

// Imagens de reservatório (mantidas do seu código original)
const reservatorioImages: ImageMap = {
  balbina: "/mapa/balbina.jpg",
  batalha: "/mapa/batalha.jpg",
  "belo-monte": "/mapa/belo-monte.jpg",
  corumba: "/mapa/corumba.jpg",
  curuai: "/mapa/curua.jpg",
  estreito: "/mapa/estreito.jpg",
  funil: "/mapa/funil.jpg",
  furnas: "/mapa/furnas.jpg",
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
    "mascarenhas-de-moraes", "serra-da-mesa", "tres-marias", "santo-antonio", "belo-monte", "porto-colombia",
  ];
  for (const matchName of namesToMatch) {
    if (formattedName.startsWith(matchName)) return matchName;
  }
  return formattedName;
};

// --- Interfaces de Dados (Adaptadas para API de Furnas) ---

// Interface para os dados PUROS da API de Sítios
interface ApiSitio {
  sitio: string; // Este é o NOME do sítio
  idreservatorio: number;
  descricao: string;
  reservatorio_nome: string;
  reservatorio_lat: number;
  reservatorio_lng: number;
}

// Interface PADRÃO para Reservatórios (igual ao Balcar)
interface Reservatorio {
  idreservatorio: number;
  nome: string;
  lat: number | null;
  lng: number | null;
}

// Interface PADRÃO para Sítios (adaptada para o que vamos usar na UI)
interface Sitio {
  nome: string; // <-- Mapeado de ApiSitio.sitio
  lat: number | null; // <-- Mapeado de ApiSitio.reservatorio_lat
  lng: number | null; // <-- Mapeado de ApiSitio.reservatorio_lng
  idreservatorio: number;
  descricao: string;
}

interface ApiResponse<T> {
  success: boolean;
  page: number;
  limit: number;
  totalPages: number;
  data: T[];
}

// --- Tipos e Funções da Sidebar ---

type DataItem = (Reservatorio & { type: "reservatorio" }) | (Sitio & { type: "sitio" });

// Ícones de Furnas
const getIcon = (isReservatorio: boolean) => (isReservatorio ? "💧" : "📍");

// Estilos de ícone de Furnas (Reservatório Azul, Sítio Verde)
const getIconBgStyle = (isReservatorio: boolean) => ({
  backgroundColor: isReservatorio ? colors.mapMarkerFurnas : colors.mapMarkerBalcar,
  color: colors.white,
});

// --- Componente: SidebarItemFurnas (Lógica limpa do Balcar) ---

const SidebarItemFurnas: React.FC<{
  item: DataItem;
  onSelect: () => void;
  isSelected: boolean;
}> = ({ item, onSelect, isSelected }) => {
  const isReservatorio = item.type === "reservatorio";
  return (
    <div
      className={`p-3 border rounded-lg cursor-pointer transition-colors shadow-sm relative flex items-center space-x-3`}
      style={{
        backgroundColor: isSelected ? colors.sidebarHover : colors.sidebarItem,
        borderColor: isSelected ? colors.primary : colors.sidebarBorder, // Borda Azul
        borderStyle: "solid",
        borderWidth: isSelected ? "2px" : "1px",
      }}
      onClick={onSelect}
    >
      <div
        className={`p-2 rounded-full text-lg flex-shrink-0 flex items-center justify-center`}
        style={{
          ...getIconBgStyle(isReservatorio),
          width: "2.5rem",
          height: "2.5rem",
        }}
      >
        {getIcon(isReservatorio)}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold" style={{ color: colors.sidebarText }}>
          {item.nome}
        </h4>
      </div>
    </div>
  );
};

// --- Componente: SidebarFurnas (Lógica limpa do Balcar) ---

interface SidebarPropsFurnas {
  searchText: string;
  setSearchText: (text: string) => void;
  reservatorios: DataItem[];
  sitios: DataItem[];
  selectedReservatorioId: number | null;
  isShowingSitios: boolean;
  selectedSitioId: string | "all";
  onReservatorioClick: (id: number) => void;
  onShowSitios: () => void;
  onCloseSitios: () => void;
  onSitioClick: (id: string) => void;
}

const SidebarFurnas: React.FC<SidebarPropsFurnas> = ({
  searchText,
  setSearchText,
  reservatorios,
  sitios,
  selectedReservatorioId,
  isShowingSitios,
  selectedSitioId,
  onReservatorioClick,
  onShowSitios,
  onCloseSitios,
  onSitioClick,
}) => {
  const totalCount = isShowingSitios ? sitios.length : reservatorios.length;
  const title = isShowingSitios ? "Sítios" : "Reservatórios";
  const placeholder = isShowingSitios ? "Buscar sítio..." : "Buscar reservatório...";

  return (
    <div
      className="w-96 p-4 overflow-y-auto shadow-xl flex-shrink-0"
      style={{
        height: "100%",
        zIndex: 10,
        backgroundColor: colors.sidebarBg,
        borderRight: `1px solid ${colors.sidebarBorder}`,
        color: colors.sidebarText,
      }}
    >
      <h2 className="text-xl font-bold mb-1" style={{ color: colors.sidebarText }}>
        {title}
      </h2>
      <p className="text-sm mb-4" style={{ color: colors.sidebarTextMuted }}>
        {totalCount} {isShowingSitios ? "sítios encontrados" : "reservatórios encontrados"}
      </p>

      {/* Barra de Busca */}
      <div className="mb-4">
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
            placeholder={placeholder}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg focus:ring-opacity-50"
            style={
              {
                border: `1px solid ${colors.sidebarBorder}`,
                backgroundColor: colors.sidebarItem,
                color: colors.sidebarText,
                "--tw-ring-color": colors.primary, // Foco Azul
              } as React.CSSProperties
            }
          />
        </div>
      </div>

      {/* Lista de Itens */}
      <div className="space-y-3">
        {reservatorios.length === 0 && !isShowingSitios && (
          <p className="text-center p-8 text-sm" style={{ color: colors.sidebarTextMuted }}>
            Nenhum reservatório encontrado.
          </p>
        )}

        {isShowingSitios && (
          <button
            onClick={onCloseSitios}
            className="w-full p-2 mb-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2"
            style={{ backgroundColor: colors.sidebarItem, color: colors.sidebarText }}
          >
            <span>&larr;</span>
            <span>Voltar para Reservatórios</span>
          </button>
        )}

        {isShowingSitios ? (
          // --- MODO SÍTIOS ---
          <div className="space-y-3">
            {sitios.length > 0 ? (
              sitios.map((item) => {
                const sitio = item as Sitio & { type: "sitio" };
                // Chave composta (idreservatorio + nome)
                const uniqueKey = `sitio-${sitio.idreservatorio}-${sitio.nome}`;

                return (
                  <SidebarItemFurnas
                    key={uniqueKey}
                    item={item}
                    onSelect={() => onSitioClick(uniqueKey)}
                    isSelected={selectedSitioId === uniqueKey}
                  />
                );
              })
            ) : (
              <p className="text-center p-8 text-sm" style={{ color: colors.sidebarTextMuted }}>
                Nenhum sítio encontrado.
              </p>
            )}
          </div>
        ) : (
          // --- MODO RESERVATÓRIOS ---
          <div className="space-y-3">
            {reservatorios.map((item) => {
              const reservatorio = item as Reservatorio & { type: "reservatorio" };
              const isSelected = reservatorio.idreservatorio === selectedReservatorioId;

              return (
                <div key={reservatorio.idreservatorio}>
                  <SidebarItemFurnas
                    item={reservatorio}
                    onSelect={() => onReservatorioClick(reservatorio.idreservatorio)}
                    isSelected={isSelected}
                  />
                  {isSelected && (
                    <button
                      onClick={onShowSitios}
                      className="w-full mt-2 p-2 rounded-lg text-sm font-medium transition-all"
                      style={{ backgroundColor: colors.primary, color: colors.white }} // Botão Azul
                    >
                      Ver Sítios &rarr;
                    </button>
                  )}
                </div>
              );
            })}
          </div>
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

// Ícone do Sítio: Fundo Verde (Balcar) com borda Azul (Furnas)
const siteIconFurnas = new L.DivIcon({
  className: "custom-site-icon-furnas",
  html: `<div style="background-color: ${colors.mapMarkerBalcar}; width: 15px; height: 15px; border-radius: 50%; border: 3px solid ${colors.mapMarkerFurnas}; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
  iconSize: [21, 21],
  iconAnchor: [10, 10],
});

const INITIAL_CENTER: [number, number] = [-14.235, -51.9253]; // Centro do Brasil
const INITIAL_ZOOM = 4;

// --- Componente Principal: FurnasMap ---

const FurnasMap: React.FC = () => {
  // --- Estados de Dados ---
  const [reservatorios, setReservatorios] = useState<Reservatorio[]>([]);
  const [sitios, setSitios] = useState<Sitio[]>([]); // <- Usará a interface Sitio (UI)
  const [loading, setLoading] = useState(true);

  // --- Estados de UI ---
  const [searchText, setSearchText] = useState("");
  const [selectedReservatorioId, setSelectedReservatorioId] = useState<number | null>(null);
  const [isShowingSitios, setIsShowingSitios] = useState(false);
  const [selectedSitioId, setSelectedSitioId] = useState<string | "all">("all");

  // --- LÓGICA DE DADOS (Fetch e Transformação) ---
  useEffect(() => {
    const fetchData = async () => {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
      try {
        const [reservatoriosResponse, sitiosResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/furnas/reservatorio/all?limit=10000`),
          fetch(`${API_BASE_URL}/api/furnas/sitio/all?limit=10000`),
        ]);

        const reservatoriosData: ApiResponse<Reservatorio> = await reservatoriosResponse.json();
        const sitiosData: ApiResponse<ApiSitio> = await sitiosResponse.json(); // <-- Pega dados brutos

        setReservatorios(reservatoriosData.data || []);

        // *** ETAPA DE TRANSFORMAÇÃO ***
        // Converte os dados da API de Sítios para o formato que a UI espera
        const transformedSitios: Sitio[] = (sitiosData.data || []).map((apiSitio) => ({
          nome: apiSitio.sitio, // Mapeia 'sitio' para 'nome'
          lat: apiSitio.reservatorio_lat, // Mapeia 'reservatorio_lat' para 'lat'
          lng: apiSitio.reservatorio_lng, // Mapeia 'reservatorio_lng' para 'lng'
          idreservatorio: apiSitio.idreservatorio,
          descricao: apiSitio.descricao,
        }));
        
        setSitios(transformedSitios); // <-- Seta os dados transformados

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Handlers de UI (Idênticos ao Balcar) ---

  const handleReservatorioClick = (id: number) => {
    setSelectedReservatorioId(id);
    setIsShowingSitios(false);
    setSelectedSitioId("all");
  };

  const handleShowSitiosClick = () => {
    setIsShowingSitios(true);
    setSearchText("");
  };

  const handleCloseSitiosClick = () => {
    setIsShowingSitios(false);
    setSelectedReservatorioId(null);
    setSelectedSitioId("all");
    setSearchText("");
  };

  const handleSitioClick = (id: string) => {
    setSelectedSitioId((prev) => (prev === id ? "all" : id));
  };

  // --- LÓGICA DE DADOS (Listas Memoizadas) ---

  const reservatorioNameMap: Record<number, string> = useMemo(() => {
    return reservatorios.reduce(
      (acc, res) => {
        acc[res.idreservatorio] = res.nome;
        return acc;
      },
      {} as Record<number, string>,
    );
  }, [reservatorios]);

  // Lista base de reservatórios (com lat/lng)
  const listaDeReservatoriosBase = useMemo(
    () =>
      reservatorios
        .filter((r) => r.lat && r.lng)
        .map((r) => ({ ...r, type: "reservatorio" as const })),
    [reservatorios],
  );

  // Lista base de sítios (com lat/lng)
  // Nota: O filtro lat/lng aqui agora filtra com base nas coordenadas do reservatório
  const listaDeSitiosBase = useMemo(
    () =>
      sitios
        .filter((s) => s.lat && s.lng) // Filtra sítios sem coordenadas de reservatório
        .map((s) => ({ ...s, type: "sitio" as const })),
    [sitios],
  );

  // --- LÓGICA DE RENDERIZAÇÃO (Listas Filtradas) ---

  const reservatoriosParaSidebar = useMemo(() => {
    if (isShowingSitios) return [];
    if (!searchText) return listaDeReservatoriosBase;
    const lowerCaseSearch = searchText.toLowerCase();
    return listaDeReservatoriosBase.filter((item) =>
      item.nome.toLowerCase().includes(lowerCaseSearch),
    );
  }, [listaDeReservatoriosBase, searchText, isShowingSitios]);

  const sitiosParaSidebar = useMemo(() => {
    if (!isShowingSitios || selectedReservatorioId === null) return [];

    let baseList = listaDeSitiosBase.filter(
      (s) => s.idreservatorio === selectedReservatorioId,
    );

    if (searchText) {
      const lowerCaseSearch = searchText.toLowerCase();
      baseList = baseList.filter(
        (item) =>
          item.nome.toLowerCase().includes(lowerCaseSearch) ||
          (item.descricao || "").toLowerCase().includes(lowerCaseSearch),
      );
    }
    return baseList;
  }, [listaDeSitiosBase, isShowingSitios, selectedReservatorioId, searchText]);

  // Lista de itens para o MAPA
  const itemsParaMapa = useMemo(() => {
    if (isShowingSitios) {
      // --- Modo Sítios ---
      const baseSitios = listaDeSitiosBase.filter(
        (s) => s.idreservatorio === selectedReservatorioId,
      );
      if (selectedSitioId === "all") {
        return baseSitios; // Mostra TODOS os sítios do reservatório
      }
      // Mostra apenas o sítio selecionado
      return baseSitios.filter(
        (s) => `sitio-${s.idreservatorio}-${s.nome}` === selectedSitioId,
      );
    } else {
      // --- Modo Reservatórios ---
      if (selectedReservatorioId === null) {
        // Nenhum selecionado: mostra todos da sidebar
        return reservatoriosParaSidebar;
      } else {
        // Um reservatório FOI selecionado: mostra APENAS ele
        return reservatoriosParaSidebar.filter(
          (r) => (r as Reservatorio).idreservatorio === selectedReservatorioId
        );
      }
    }
  }, [
    isShowingSitios,
    selectedReservatorioId,
    selectedSitioId,
    listaDeSitiosBase,
    reservatoriosParaSidebar,
  ]);

  // --- Separa listas para os marcadores do mapa ---
  const filteredMapReservatorios = itemsParaMapa.filter(
    (item) => item.type === "reservatorio",
  ) as Reservatorio[];
  const filteredMapSitios = itemsParaMapa.filter((item) => item.type === "sitio") as Sitio[];

  // Configurações de zoom e centro do mapa
  const mapSettings = useMemo(() => {
    // 1. Zoom em um Sítio específico (prioridade máxima)
    if (selectedSitioId !== "all") {
      const item = sitios.find(
        (s) => `sitio-${s.idreservatorio}-${s.nome}` === selectedSitioId,
      );
      if (item && item.lat && item.lng) {
        return { center: [item.lat, item.lng] as [number, number], zoom: 12 };
      }
    }
    
    // 2. Zoom no Reservatório ATIVO (seja selecionado ou mostrando sítios)
    if (selectedReservatorioId !== null) {
      const item = reservatorios.find((r) => r.idreservatorio === selectedReservatorioId);
      if (item && item.lat && item.lng) {
        return { center: [item.lat, item.lng] as [number, number], zoom: 9 };
      }
    }

    // 3. Estado inicial (nenhum reservatório selecionado)
    return { center: INITIAL_CENTER, zoom: INITIAL_ZOOM };
  }, [selectedSitioId, selectedReservatorioId, reservatorios, sitios]);
  // --- RENDER ---

  const popupStyles = `
  	.balcar-popup .leaflet-popup-content-wrapper {
  	background-color: ${colors.mapPopupBg};
  	color: ${colors.mapPopupText};
  	border-radius: 8px;
  	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  	}
  	.balcar-popup .leaflet-popup-tip {
  	background: ${colors.mapPopupBg};
  	}
  	.balcar-popup .leaflet-popup-close-button {
  	color: ${colors.mapPopupText} !important;	
  	opacity: 0.7;
  	}
  	.balcar-popup .leaflet-popup-close-button:hover {
  	opacity: 1;
  	}
  `;

  if (loading) {
    return <div className="p-4 text-lg font-medium">Carregando mapa FURNAS... 🗺️</div>;
  }

  return (
    <div className="flex" style={{ height: "calc(100vh - 80px)" }}>
      <style>{popupStyles}</style>

      <SidebarFurnas
        searchText={searchText}
        setSearchText={setSearchText}
        reservatorios={reservatoriosParaSidebar}
        sitios={sitiosParaSidebar}
        selectedReservatorioId={selectedReservatorioId}
        isShowingSitios={isShowingSitios}
        selectedSitioId={selectedSitioId}
        onReservatorioClick={handleReservatorioClick}
        onShowSitios={handleShowSitiosClick}
        onCloseSitios={handleCloseSitiosClick}
        onSitioClick={handleSitioClick}
      />

      <div className="flex-1 p-4 overflow-hidden" style={{ backgroundColor: "#FFFFFF" }}>
        <h1 className="text-3xl font-bold mb-4" style={{ color: colors.primary }}>
          Mapa de Localizações - Projeto FURNAS
        </h1>
        <MapContainer
          key={mapSettings.center.toString()}
          center={mapSettings.center}
          zoom={mapSettings.zoom}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%", borderRadius: "12px" }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Marcadores de Reservatórios */}
          {filteredMapReservatorios.map((reservatorio) => {
            if (!reservatorio.lat || !reservatorio.lng) return null;
            const imageKey = formatNameForImageKey(reservatorio.nome);
            const imageSrc = reservatorioImages[imageKey] || null;
            return (
              <Marker
                key={reservatorio.idreservatorio}
                position={[reservatorio.lat, reservatorio.lng]}
              >
                <Popup className="balcar-popup">
                  {imageSrc && (
                    <img
                      src={imageSrc}
                      alt={`Imagem do Reservatório ${reservatorio.nome}`}
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
                  <h3 style={{ color: colors.mapMarkerFurnas }} className="font-bold text-lg">
                    Reservatório: {reservatorio.nome}
                  </h3>
                  <p>ID: {reservatorio.idreservatorio}</p>
                  <p>Lat: {reservatorio.lat.toFixed(4)}</p>
                  <p>Lng: {reservatorio.lng.toFixed(4)}</p>
                </Popup>
              </Marker>
            );
          })}

          {/* Marcadores de Sítios */}
          {filteredMapSitios.map((sitio) => {
            const reservatorioNome =
              reservatorioNameMap[sitio.idreservatorio] || "Desconhecido";
            const markerKey = `sitio-${sitio.idreservatorio}-${sitio.nome}`;
            return sitio.lat && sitio.lng ? (
              // O ícone 'siteIconFurnas' será usado aqui
              <Marker key={markerKey} position={[sitio.lat, sitio.lng]} icon={siteIconFurnas}>
                <Popup className="balcar-popup">
                  <h3 style={{ color: colors.mapMarkerBalcar }} className="font-bold text-lg">
                    Sítio: {sitio.nome}
                  </h3>
                  <p>Reservatório: {reservatorioNome} (ID: {sitio.idreservatorio})</p>
                  <p>Lat: {sitio.lat.toFixed(4)}</p>
                  <p>Lng: {sitio.lng.toFixed(4)}</p>
                </Popup>
              </Marker>
            ) : null;
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default FurnasMap;