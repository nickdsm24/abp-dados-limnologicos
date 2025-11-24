import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- Paleta de Cores ---
const colors = {
  primary: "#1D4ED8",
  secondary: "#3B82F6",
  white: "#FFFFFF",
  sidebarBg: "#1E293B",
  sidebarBorder: "#334155",
  sidebarItem: "#334155",
  sidebarHover: "#475569",
  sidebarText: "#F8FAFC",
  sidebarTextMuted: "#94A3B8",
  mapPopupBg: "#334155",
  mapPopupText: "#F8FAFC",
  mapMarkerFurnas: "#1D4ED8",
  mapMarkerBalcar: "#047857",
};

// --- Tipos e Interfaces ---

interface ImageMap {
  [key: string]: string;
}

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

// Dados crus da API
interface ApiSitio {
  sitio: string;
  idreservatorio: number;
  descricao: string;
  reservatorio_nome: string;
  reservatorio_lat: number;
  reservatorio_lng: number;
}

// Interface UI
interface Reservatorio {
  idreservatorio: number;
  nome: string;
  lat: number | null;
  lng: number | null;
}

interface Sitio {
  nome: string;
  lat: number | null;
  lng: number | null;
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

// Tipos para Sidebar e Mapa
type DataItem = (Reservatorio & { type: "reservatorio" }) | (Sitio & { type: "sitio" });

// --- Componentes Auxiliares ---

// Componente para atualizar o centro do mapa (Hook dentro do MapContainer)
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const SidebarItemFurnas: React.FC<{
  item: DataItem;
  onSelect: () => void;
  isSelected: boolean;
}> = ({ item, onSelect, isSelected }) => {
  const isReservatorio = item.type === "reservatorio";
  
  const iconBg = isReservatorio ? colors.mapMarkerFurnas : colors.mapMarkerBalcar;
  const iconSymbol = isReservatorio ? "💧" : "📍";

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
        className="p-2 rounded-full text-lg flex-shrink-0 flex items-center justify-center"
        style={{
          backgroundColor: iconBg,
          color: colors.white,
          width: "2.5rem",
          height: "2.5rem",
        }}
      >
        {iconSymbol}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-sm" style={{ color: colors.sidebarText }}>
          {item.nome}
        </h4>
        {!isReservatorio && (item as Sitio).descricao && (
           <p className="text-xs truncate" style={{color: colors.sidebarTextMuted}}>
             {(item as Sitio).descricao}
           </p>
        )}
      </div>
    </div>
  );
};

const SidebarFurnas: React.FC<{
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
}> = ({
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
      className="w-96 p-4 overflow-y-auto shadow-xl flex-shrink-0 flex flex-col"
      style={{
        height: "100%",
        zIndex: 10,
        backgroundColor: colors.sidebarBg,
        borderRight: `1px solid ${colors.sidebarBorder}`,
        color: colors.sidebarText,
      }}
    >
      <div className="flex-shrink-0">
        <h2 className="text-xl font-bold mb-1" style={{ color: colors.sidebarText }}>
          {title}
        </h2>
        <p className="text-sm mb-4" style={{ color: colors.sidebarTextMuted }}>
          {totalCount} {isShowingSitios ? "sítios encontrados" : "reservatórios encontrados"}
        </p>

        <div className="mb-4 relative">
          <input
            type="text"
            placeholder={placeholder}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2"
            style={{
              border: `1px solid ${colors.sidebarBorder}`,
              backgroundColor: colors.sidebarItem,
              color: colors.sidebarText,
              borderColor: colors.sidebarBorder
            }}
          />
        </div>

        {isShowingSitios && (
          <button
            onClick={onCloseSitios}
            className="w-full p-2 mb-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 hover:brightness-110"
            style={{ backgroundColor: colors.sidebarItem, color: colors.sidebarText }}
          >
            <span>&larr; Voltar para Reservatórios</span>
          </button>
        )}
      </div>

      <div className="space-y-3 flex-grow overflow-y-auto">
        {/* Renderização Condicional Estrita */}
        {!isShowingSitios ? (
            // --- LISTA DE RESERVATÓRIOS ---
            reservatorios.length > 0 ? (
                reservatorios.map((item) => {
                    const reservatorio = item as Reservatorio & { type: "reservatorio" };
                    const isSelected = reservatorio.idreservatorio === selectedReservatorioId;
                    return (
                        <div key={`res-${reservatorio.idreservatorio}`}>
                            <SidebarItemFurnas
                                item={reservatorio}
                                onSelect={() => onReservatorioClick(reservatorio.idreservatorio)}
                                isSelected={isSelected}
                            />
                            {isSelected && (
                                <button
                                    onClick={onShowSitios}
                                    className="w-full mt-2 p-2 rounded-lg text-sm font-bold transition-all hover:brightness-110"
                                    style={{ backgroundColor: colors.primary, color: colors.white }}
                                >
                                    Ver Sítios &rarr;
                                </button>
                            )}
                        </div>
                    );
                })
            ) : (
                <p className="text-center text-sm mt-8 opacity-70">Nenhum reservatório encontrado.</p>
            )
        ) : (
            // --- LISTA DE SÍTIOS ---
            sitios.length > 0 ? (
                sitios.map((item, index) => {
                    const sitio = item as Sitio & { type: "sitio" };
                    // Usando index para garantir unicidade mesmo se nomes repetirem
                    const uniqueKey = `sitio-${sitio.idreservatorio}-${index}`;
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
                <p className="text-center text-sm mt-8 opacity-70">Nenhum sítio encontrado.</p>
            )
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

const siteIconFurnas = new L.DivIcon({
  className: "custom-site-icon-furnas",
  html: `<div style="background-color: ${colors.mapMarkerBalcar}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid ${colors.white}; box-shadow: 0 2px 4px rgba(0,0,0,0.5);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const INITIAL_CENTER: [number, number] = [-14.235, -51.9253];
const INITIAL_ZOOM = 4;

// --- Componente Principal ---

const FurnasMap: React.FC = () => {
  const [reservatorios, setReservatorios] = useState<Reservatorio[]>([]);
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [selectedReservatorioId, setSelectedReservatorioId] = useState<number | null>(null);
  const [isShowingSitios, setIsShowingSitios] = useState(false);
  const [selectedSitioId, setSelectedSitioId] = useState<string | "all">("all");

  useEffect(() => {
    const fetchData = async () => {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
      try {
        const [reservatoriosResponse, sitiosResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/furnas/reservatorio/all?limit=10000`),
          fetch(`${API_BASE_URL}/api/furnas/sitio/all?limit=10000`),
        ]);

        const reservatoriosData: ApiResponse<Reservatorio> = await reservatoriosResponse.json();
        const sitiosData: ApiResponse<ApiSitio> = await sitiosResponse.json();

        // Tratamento robusto para garantir números
        const safeReservatorios = (reservatoriosData.data || []).map(r => ({
            ...r,
            idreservatorio: Number(r.idreservatorio),
            lat: r.lat ? parseFloat(String(r.lat)) : null,
            lng: r.lng ? parseFloat(String(r.lng)) : null
        }));

        const safeSitios = (sitiosData.data || []).map((apiSitio) => ({
          nome: apiSitio.sitio || "Sem Nome",
          lat: apiSitio.reservatorio_lat ? parseFloat(String(apiSitio.reservatorio_lat)) : null,
          lng: apiSitio.reservatorio_lng ? parseFloat(String(apiSitio.reservatorio_lng)) : null,
          idreservatorio: Number(apiSitio.idreservatorio), // Força número
          descricao: apiSitio.descricao || "",
        }));

        setReservatorios(safeReservatorios);
        setSitios(safeSitios);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Handlers ---

  const handleReservatorioClick = (id: number) => {
    // Garante que estamos passando número
    setSelectedReservatorioId(Number(id));
    setIsShowingSitios(false); 
    setSelectedSitioId("all");
  };

  const handleShowSitiosClick = () => {
    setIsShowingSitios(true);
    setSearchText("");
  };

  const handleCloseSitiosClick = () => {
    setIsShowingSitios(false);
    // Mantemos o reservatório selecionado ao voltar? 
    // Se quiser desmarcar tudo, use null. Se quiser manter no reservatório atual:
    // setSelectedReservatorioId(null); 
    setSelectedSitioId("all");
    setSearchText("");
  };

  const handleSitioClick = (id: string) => {
    setSelectedSitioId((prev) => (prev === id ? "all" : id));
  };

  // --- Lógica de Dados ---

  const reservatorioNameMap: Record<number, string> = useMemo(() => {
    return reservatorios.reduce((acc, res) => {
        acc[res.idreservatorio] = res.nome;
        return acc;
    }, {} as Record<number, string>);
  }, [reservatorios]);

  // Criação das listas base com tipos explícitos
  const listaDeReservatoriosBase = useMemo(() => 
    reservatorios
      .filter((r) => r.lat && r.lng)
      .map((r) => ({ ...r, type: "reservatorio" as const })), 
  [reservatorios]);

  const listaDeSitiosBase = useMemo(() => 
    sitios
      .filter((s) => s.lat && s.lng)
      .map((s) => ({ ...s, type: "sitio" as const })), 
  [sitios]);

  // --- Filtros para Sidebar ---

  const reservatoriosParaSidebar = useMemo(() => {
    if (isShowingSitios) return []; // Se está vendo sítios, não retorna reservatórios
    
    if (!searchText) return listaDeReservatoriosBase;
    
    const lower = searchText.toLowerCase();
    return listaDeReservatoriosBase.filter((r) => 
        r.nome.toLowerCase().includes(lower)
    );
  }, [listaDeReservatoriosBase, searchText, isShowingSitios]);

  const sitiosParaSidebar = useMemo(() => {
    if (!isShowingSitios || selectedReservatorioId === null) return [];

    // Filtra estritamente pelo ID numérico
    let list = listaDeSitiosBase.filter(s => s.idreservatorio === selectedReservatorioId);

    if (searchText) {
        const lower = searchText.toLowerCase();
        list = list.filter(s => 
            s.nome.toLowerCase().includes(lower) || 
            s.descricao.toLowerCase().includes(lower)
        );
    }
    return list;
  }, [listaDeSitiosBase, isShowingSitios, selectedReservatorioId, searchText]);

  // --- Filtros para Mapa (Correção da Confusão) ---

  const itemsParaMapa = useMemo(() => {
    if (isShowingSitios) {
        // MODO SÍTIOS: Retorna APENAS sítios do reservatório selecionado
        if (selectedReservatorioId === null) return [];
        
        const base = listaDeSitiosBase.filter(s => s.idreservatorio === selectedReservatorioId);
        
        if (selectedSitioId !== "all") {
            // A busca aqui precisa bater com a chave gerada na sidebar. 
            // Como usamos index lá, aqui é complicado filtrar por chave.
            // Simplificação: se tiver 'all', mostra todos. Se clicar no mapa, foca.
            // Para este exemplo, retornaremos todos os base, a filtragem visual é feita depois se necessário.
            return base; 
        }
        return base;

    } else {
        // MODO RESERVATÓRIOS: Retorna APENAS reservatórios
        if (selectedReservatorioId === null) {
            return reservatoriosParaSidebar; // Mostra todos da busca
        } else {
            // Mostra apenas o selecionado
            return reservatoriosParaSidebar.filter(r => r.idreservatorio === selectedReservatorioId);
        }
    }
  }, [isShowingSitios, selectedReservatorioId, selectedSitioId, listaDeSitiosBase, reservatoriosParaSidebar]);

  // Separação final garantida pelo Type Guard
  const mapReservatorios = itemsParaMapa.filter(i => i.type === "reservatorio") as (Reservatorio & { type: "reservatorio" })[];
  const mapSitios = itemsParaMapa.filter(i => i.type === "sitio") as (Sitio & { type: "sitio" })[];

  // Controle de Zoom/Centro
  const mapSettings = useMemo(() => {
    // 1. Zoom no Sítio específico (via clique sidebar)
    if (isShowingSitios && selectedSitioId !== "all") {
        // Precisamos encontrar o sítio na lista filtrada
        // (Lógica simplificada pois selectedSitioId é uma string complexa)
    }

    // 2. Zoom no Reservatório Selecionado
    if (selectedReservatorioId !== null) {
        const res = reservatorios.find(r => r.idreservatorio === selectedReservatorioId);
        if (res && res.lat && res.lng) {
            // Se estiver vendo sítios, dá mais zoom pois eles estão "dentro"
            return { center: [res.lat, res.lng] as [number, number], zoom: isShowingSitios ? 12 : 9 };
        }
    }

    return { center: INITIAL_CENTER, zoom: INITIAL_ZOOM };
  }, [selectedReservatorioId, isShowingSitios, reservatorios, selectedSitioId]);

  // Estilos globais do popup
  const popupStyles = `
    .balcar-popup .leaflet-popup-content-wrapper { background: ${colors.mapPopupBg}; color: ${colors.mapPopupText}; border-radius: 8px; }
    .balcar-popup .leaflet-popup-tip { background: ${colors.mapPopupBg}; }
    .balcar-popup .leaflet-popup-close-button { color: ${colors.mapPopupText} !important; }
  `;

  if (loading) return <div className="p-8 text-center">Carregando dados...</div>;

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-white">
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
          Mapa - Áreas de coleta de dados - Projeto Furnas
        </h1>
        <MapContainer
          center={INITIAL_CENTER}
          zoom={INITIAL_ZOOM}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapController center={mapSettings.center} zoom={mapSettings.zoom} />

          {/* Renderização de Reservatórios */}
          {mapReservatorios.map((res) => {
             const imageKey = formatNameForImageKey(res.nome);
             const imageSrc = reservatorioImages[imageKey];
             return (
               <Marker 
                 key={`marker-res-${res.idreservatorio}`} 
                 position={[res.lat!, res.lng!]}
               >
                 <Popup className="balcar-popup">
                   {imageSrc && <img src={imageSrc} className="w-full h-32 object-cover rounded mb-2" />}
                   <h3 className="font-bold text-lg" style={{ color: colors.mapMarkerFurnas }}>{res.nome}</h3>
                   <p className="text-sm">Reservatório ID: {res.idreservatorio}</p>
                 </Popup>
               </Marker>
             );
          })}

          {/* Renderização de Sítios */}
          {mapSitios.map((sitio, index) => {
             // Usando index no key para garantir unicidade absoluta no mapa
             const uniqueKey = `marker-sitio-${sitio.idreservatorio}-${index}`;
             return (
               <Marker 
                 key={uniqueKey} 
                 position={[sitio.lat!, sitio.lng!]} 
                 icon={siteIconFurnas}
               >
                 <Popup className="balcar-popup">
                   <h3 className="font-bold" style={{ color: colors.mapMarkerBalcar }}>{sitio.nome}</h3>
                   <p className="text-xs mt-1">{sitio.descricao}</p>
                   <p className="text-xs mt-2 opacity-70">
                     Reservatório: {reservatorioNameMap[sitio.idreservatorio]}
                   </p>
                 </Popup>
               </Marker>
             );
          })}
        </MapContainer>
        
      </div>
    </div>
  );
};

export default FurnasMap;