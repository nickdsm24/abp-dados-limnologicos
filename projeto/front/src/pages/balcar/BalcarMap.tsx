import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Paleta de cores (MANTIDA)
const colors = {
  primary: "#047857",
  secondary: "#10B981",
  white: "#FFFFFF",
  sidebarBg: "#1E293B",
  sidebarBorder: "#334155",
  sidebarItem: "#334155",
  sidebarHover: "#475569",
  sidebarText: "#F8FAFC",
  sidebarTextMuted: "#94A3B8",
  mapPopupBg: "#334155",
  mapPopupText: "#F8FAFC",
  mapMarkerReservatorio: "#047857",
  mapMarkerSite: "#10B981",
};

// --- Interfaces e Funções Úteis (MANTIDOS) ---

interface ImageMap {
  [key: string]: string;
}

const reservatorioImages: ImageMap = {
  batalha: "/mapa/batalha.jpg",
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
  "mascarenhas-de-moraes": "/mapa/mascarenhas-de-moraes.jpg",
  segredo: "/mapa/segredo.jpg",
  "serra-da-mesa": "/mapa/serra-da-mesa.jpg",
  "tres-marias": "/mapa/tres-marias.jpg",
  tucurui: "/mapa/tucurui.jpg",
  "santo-antonio": "/mapa/santo-antonio.jpg",
};

const formatNameForImageKey = (name: string): string => {
  const formattedName = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s/g, "-");
  const namesToMatch = ["mascarenhas-de-moraes", "serra-da-mesa", "tres-marias", "santo-antonio"];
  for (const matchName of namesToMatch) {
    if (formattedName.startsWith(matchName)) return matchName;
  }
  return formattedName;
};

// --- Interfaces de Dados (CORRIGIDAS) ---

interface Reservatorio {
  idreservatorio: number;
  nome: string;
  lat: number | null;
  lng: number | null;
}

interface Sitio {
  // idsitio: number; // <-- CORREÇÃO: Removido, pois não existe na API
  nome: string;
  lat: number | null;
  lng: number | null;
  descricao: string;
  idreservatorio: number;
}

interface ApiResponse<T> {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: T[];
}

// --- Tipos e Funções da Sidebar (MANTIDOS) ---

type DataItemBalcar = (Reservatorio & { type: "reservatorio" }) | (Sitio & { type: "sitio" });

const getIcon = (isReservatorio: boolean) => (isReservatorio ? "💧" : "📍");

const getIconBgStyle = (isReservatorio: boolean) => ({
  backgroundColor: isReservatorio ? colors.primary : colors.secondary,
  color: colors.white,
});

// --- Componente: SidebarItem (MANTIDO) ---
const SidebarItemBalcar: React.FC<{
  item: DataItemBalcar;
  onSelect: () => void;
  isSelected: boolean;
}> = ({ item, onSelect, isSelected }) => {
  const isReservatorio = item.type === "reservatorio";
  return (
    <div
      className={`p-3 border rounded-lg cursor-pointer transition-colors shadow-sm relative flex items-center space-x-3`}
      style={{
        backgroundColor: isSelected ? colors.sidebarHover : colors.sidebarItem,
        borderColor: isSelected ? colors.primary : colors.sidebarBorder,
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

// --- Componente: Sidebar (CORRIGIDO) ---

interface SidebarPropsBalcar {
  searchText: string;
  setSearchText: (text: string) => void;
  reservatorios: DataItemBalcar[];
  sitios: DataItemBalcar[];
  selectedReservatorioId: number | null;
  isShowingSitios: boolean;
  selectedSitioId: string | "all";
  onReservatorioClick: (id: number) => void;
  onShowSitios: () => void;
  onCloseSitios: () => void;
  onSitioClick: (id: string) => void;
}

const SidebarBalcar: React.FC<SidebarPropsBalcar> = ({
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
                "--tw-ring-color": colors.primary,
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
                // CORREÇÃO: Usar a CHAVE COMPOSTA
                const sitio = item as Sitio & { type: "sitio" };
                const uniqueKey = `sitio-${sitio.idreservatorio}-${sitio.nome}`;

                return (
                  <SidebarItemBalcar
                    key={uniqueKey} // <-- CORRIGIDO
                    item={item}
                    onSelect={() => onSitioClick(uniqueKey)} // <-- CORRIGIDO
                    isSelected={selectedSitioId === uniqueKey} // <-- CORRIGIDO
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
                  <SidebarItemBalcar
                    item={reservatorio}
                    onSelect={() => onReservatorioClick(reservatorio.idreservatorio)}
                    isSelected={isSelected}
                  />
                  {isSelected && (
                    <button
                      onClick={onShowSitios}
                      className="w-full mt-2 p-2 rounded-lg text-sm font-medium transition-all"
                      style={{ backgroundColor: colors.primary, color: colors.white }}
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

// --- Configurações do Leaflet (MANTIDAS) ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const siteIcon = new L.DivIcon({
  className: "custom-site-icon",
  html: `<div style="background-color: ${colors.secondary}; width: 15px; height: 15px; border-radius: 50%; border: 3px solid ${colors.primary}; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
  iconSize: [21, 21],
  iconAnchor: [10, 10],
});

const INITIAL_CENTER: [number, number] = [-14.235, -51.9253];
const INITIAL_ZOOM = 4;

// --- Componente Principal: BalcarMap (CORRIGIDO) ---

const BalcarMap: React.FC = () => {
  // --- Estados de Dados ---
  const [reservatorios, setReservatorios] = useState<Reservatorio[]>([]);
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Estados de UI ---
  const [searchText, setSearchText] = useState("");
  const [selectedReservatorioId, setSelectedReservatorioId] = useState<number | null>(null);
  const [isShowingSitios, setIsShowingSitios] = useState(false);
  const [selectedSitioId, setSelectedSitioId] = useState<string | "all">("all");

  // --- LÓGICA DE DADOS (Fetch) ---
  useEffect(() => {
    const fetchData = async () => {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      try {
        const [reservatoriosResponse, sitiosResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/balcar/reservatorio/all?limit=10000`),
          fetch(`${API_BASE_URL}/api/balcar/sitio/all?limit=10000`),
        ]);
        const reservatoriosData: ApiResponse<Reservatorio> = await reservatoriosResponse.json();
        const sitiosData: ApiResponse<Sitio> = await sitiosResponse.json();
        setReservatorios(reservatoriosData.data || []);
        setSitios(sitiosData.data || []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Handlers de UI ---

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
  const listaDeSitiosBase = useMemo(
    () =>
      sitios
        .filter((s) => s.lat && s.lng)
        .map((s) => ({ ...s, type: "sitio" as const })),
    [sitios],
  );

  // --- LÓGICA DE RENDERIZAÇÃO (Listas Filtradas) ---

  // Lista de reservatórios para a sidebar
  const reservatoriosParaSidebar = useMemo(() => {
    if (isShowingSitios) return [];
    if (!searchText) return listaDeReservatoriosBase;
    const lowerCaseSearch = searchText.toLowerCase();
    return listaDeReservatoriosBase.filter((item) =>
      item.nome.toLowerCase().includes(lowerCaseSearch),
    );
  }, [listaDeReservatoriosBase, searchText, isShowingSitios]);

  // Lista de sítios para a sidebar
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
          (item.descricao || "").toLowerCase().includes(lowerCaseSearch), // Protege contra 'descricao' null
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
    return <div className="p-4 text-lg font-medium">Carregando mapa BALCAR... 🗺️</div>;
  }

  return (
    <div className="flex" style={{ height: "calc(100vh - 80px)" }}>
      <style>{popupStyles}</style>

      <SidebarBalcar
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
          Mapa - Áreas de coleta de dados - Projeto BALCAR
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
                  <h3 style={{ color: colors.mapMarkerReservatorio }} className="font-bold text-lg">
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
            // Usamos a chave composta para o <Marker> também
            const markerKey = `sitio-${sitio.idreservatorio}-${sitio.nome}`;
            return sitio.lat && sitio.lng ? (
              <Marker key={markerKey} position={[sitio.lat, sitio.lng]} icon={siteIcon}>
                <Popup className="balcar-popup">
                  <h3 style={{ color: colors.mapMarkerSite }} className="font-bold text-lg">
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

export default BalcarMap;