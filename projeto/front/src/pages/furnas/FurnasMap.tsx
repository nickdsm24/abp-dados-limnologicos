import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Paleta de cores
const colors = {
  // Cores Primárias/Secundárias para Ênfase e Marca (Tema "Furnas")
  primary: "#1D4ED8", // Azul Escuro (Blue 800) - Para botões, seleção, títulos
  secondary: "#3B82F6", // Azul Vibrante (Blue 500) - Para detalhes e ênfase secundária
  white: "#FFFFFF", // Cor do texto em botões primários

  // Cores da Sidebar (Tema Escuro - Neutro)
  sidebarBg: "#1E293B", // Fundo Principal da Sidebar (Slate 800)
  sidebarBorder: "#334155", // Borda sutil e separadores (Slate 700)
  sidebarItem: "#334155", // Fundo de itens não selecionados (Slate 700)
  sidebarHover: "#475569", // Fundo de hover (Slate 600)
  sidebarText: "#F8FAFC", // Cor principal do texto (White/Slate 50)
  sidebarTextMuted: "#94A3B8", // Cor do texto secundário/muted (Slate 400)

  // Cores do Mapa (UI Neutra)
  mapPopupBg: "#334155", // Fundo do Popup do mapa (Slate 700)
  mapPopupText: "#F8FAFC", // Texto do Popup do mapa (White/Slate 50)

  // Cores dos Marcadores (Entidades)
  mapMarkerFurnas: "#1D4ED8", // Azul (Cor primária)
  mapMarkerBalcar: "#047857", // Verde Esmeralda Escuro (Usado para "Sítio")
  mapMarkerSima: "#C2410C", // Laranja Queimado (Orange 700)
};

// --- Interfaces e Tipos Furnas ---

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

interface Reservatorio {
  idreservatorio: number;
  nome: string;
  lat: number | null;
  lng: number | null;
  // Adicionando um campo de status simulado (se necessário)
  status: "Aberto" | "Fechado";
}

interface Sitio {
  idsitio: number;
  nome: string;
  lat: number | null;
  lng: number | null;
  descricao: string;
  reservatorio: {
    idreservatorio: number;
    nome: string;
    lat: number;
    lng: number;
  };
  // Adicionando um campo de status simulado (se necessário)
  status: "Aberto" | "Fechado";
}

interface ApiResponse<T> {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: T[];
}

// --- Tipos e Funções da Sidebar ---

type TipoFiltroFurnas = "Todos" | "Reservatório" | "Sitio";
type StatusFiltro = "Todos" | "Aberto" | "Fechado";
type DataItem = (Reservatorio & { type: "reservatorio" }) | (Sitio & { type: "sitio" });

// Usando mapMarkerFurnas para Reservatório (Azul) e mapMarkerBalcar para Sítio (Verde)
const getIcon = (isReservatorio: boolean) => (isReservatorio ? "💧" : "⚙️"); // Sítio = Engrenagem/Instalação

// Customizando os backgrounds dos ícones para refletir a marca
const getIconBgStyle = (isReservatorio: boolean) => ({
  backgroundColor: isReservatorio ? colors.mapMarkerFurnas : colors.mapMarkerBalcar,
  color: "white", // Ícones brancos para contraste
});

// --- Componente: SidebarItem ---

const SidebarItemFurnas: React.FC<{
  item: DataItem;
  onSelect: (id: string) => void;
  isSelected: boolean;
}> = ({ item, onSelect, isSelected }) => {
  const isReservatorio = item.type === "reservatorio";
  const idString = `${item.type}-${isReservatorio ? item.idreservatorio : item.idsitio}`;

  // Usando um status simulado
  const statusText = item.status === "Fechado" ? "Fechado" : "Aberto";
  const statusColor = item.status === "Fechado" ? "text-red-400" : "text-green-400";

  // Capacidade ou Simulação de Ocupação/Status
  const capacidade = isReservatorio
    ? Math.round(((item.idreservatorio * 17) % 100) * 0.9) + 1 // Simulação para reservatório
    : Math.round(((item.idsitio * 13) % 100) * 0.9) + 1; // Simulação para sítio

  const barColor =
    capacidade > 70 ? "bg-green-500" : capacidade > 40 ? "bg-yellow-500" : "bg-red-500";

  const infoText = isReservatorio
    ? `Geradora de energia: ${item.nome}`
    : `Localização ligada à: ${item.reservatorio.nome}`;
  const horaText = isReservatorio
    ? `Monitoramento contínuo`
    : `Horário de visita/operação: 8h às 17h`;

  return (
    <div
      className={`p-3 border rounded-lg cursor-pointer transition-colors shadow-sm
        ${isSelected ? "border-2" : "border-gray-700 hover:bg-gray-700"}`}
      style={{
        backgroundColor: isSelected ? colors.sidebarHover : colors.sidebarItem,
        // Aplica a cor PRIMÁRIA (Azul) na borda do item selecionado
        borderColor: isSelected ? colors.primary : colors.sidebarBorder,
      }}
      onClick={() => onSelect(idString)}
    >
      <div className={`flex items-center space-x-3 mb-2`}>
        <div
          className={`p-2 rounded-full text-lg`}
          style={getIconBgStyle(isReservatorio)} // Aplica a cor de fundo do ícone
        >
          {getIcon(isReservatorio)}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold" style={{ color: colors.sidebarText }}>
            {item.nome}
          </h4>
        </div>
        <span className={`text-xs font-medium ${statusColor}`}>{statusText}</span>
      </div>

      <p className="text-xs" style={{ color: colors.sidebarTextMuted }}>
        {infoText}
      </p>
      <p className="text-xs" style={{ color: colors.sidebarTextMuted }}>
        {horaText}
      </p>

      <div className="mt-2 text-xs" style={{ color: colors.sidebarText }}>
        Nível / Ocupação (Simulado)
        <div className="flex items-center space-x-2">
          <div className="flex-1 w-full h-1 bg-gray-600 rounded-full">
            <div
              className={`h-1 rounded-full ${barColor}`}
              style={{ width: `${capacidade}%` }}
            ></div>
          </div>
          <span className="font-medium">{capacidade}%</span>
        </div>
      </div>
    </div>
  );
};

// --- Componente: Sidebar ---

interface SidebarPropsFurnas {
  tipoFiltro: TipoFiltroFurnas;
  setTipoFiltro: (tipo: TipoFiltroFurnas) => void;
  statusFiltro: StatusFiltro;
  setStatusFiltro: (status: StatusFiltro) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  filteredItems: DataItem[];
  totalReservatorios: number;
  totalSitios: number;
  selectedItemId: string | "all";
  onSelectItem: (id: string) => void;
}

const SidebarFurnas: React.FC<SidebarPropsFurnas> = ({
  tipoFiltro,
  setTipoFiltro,
  statusFiltro,
  setStatusFiltro,
  searchText,
  setSearchText,
  filteredItems,
  totalSitios,
  totalReservatorios,
  selectedItemId,
  onSelectItem,
}) => {
  return (
    <div
      className="w-96 p-4 overflow-y-auto border-r border-gray-700 shadow-xl flex-shrink-0"
      style={{
        height: "100%",
        zIndex: 10,
        backgroundColor: colors.sidebarBg,
        color: colors.sidebarText,
      }}
    >
      <h2 className="text-xl font-bold mb-1" style={{ color: colors.sidebarText }}>
        Localizações FURNAS
      </h2>
      <p className="text-sm" style={{ color: colors.sidebarTextMuted }}>
        {filteredItems.length} pontos encontrados
      </p>

      <div className="flex justify-between space-x-3 mb-4">
        <div
          className="flex-1 p-3 rounded-lg border border-gray-700 flex items-center shadow-sm"
          style={{ backgroundColor: colors.sidebarItem }}
        >
          {/* Aplica a cor FURNAS (Azul) nos ícones de resumo */}
          <div
            className={`p-2 rounded-full text-xl mr-2`}
            style={{ backgroundColor: colors.mapMarkerFurnas, color: "white" }}
          >
            💧
          </div>
          <div>
            <p className="text-sm" style={{ color: colors.sidebarTextMuted }}>
              Reservatórios
            </p>
            <p className="text-xl font-bold" style={{ color: colors.sidebarText }}>
              {totalReservatorios}
            </p>
          </div>
        </div>
        <div
          className="flex-1 p-3 rounded-lg border border-gray-700 flex items-center shadow-sm"
          style={{ backgroundColor: colors.sidebarItem }}
        >
          {/* Aplica a cor SÍTIO (Verde/Balcar) nos ícones de resumo */}
          <div
            className={`p-2 rounded-full text-xl mr-2`}
            style={{ backgroundColor: colors.mapMarkerBalcar, color: "white" }}
          >
            ⚙️
          </div>
          <div>
            <p className="text-sm" style={{ color: colors.sidebarTextMuted }}>
              Sítios
            </p>
            <p className="text-xl font-bold" style={{ color: colors.sidebarText }}>
              {totalSitios}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
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
            placeholder="Buscar por nome ou descrição..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent text-sm"
            style={
              {
                border: `1px solid ${colors.sidebarBorder}`,
                backgroundColor: colors.sidebarItem, // Fundo do input
                color: colors.sidebarText, // Texto digitado
                "--tw-ring-color": colors.primary, // Foco Laranja
              } as React.CSSProperties
            } // <-- CORREÇÃO 1: Corrige o erro de tipo da prop customizada
          />
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-sm mb-2" style={{ color: colors.sidebarText }}>
          Tipo
        </h3>
        <div
          className="flex space-x-2 p-1 rounded-lg border border-gray-700"
          style={{ backgroundColor: colors.sidebarItem }}
        >
          {(["Todos", "Reservatório", "Sitio"] as TipoFiltroFurnas[]).map((tipo) => (
            <button
              key={tipo}
              onClick={() => setTipoFiltro(tipo)}
              className={`flex-1 p-2 rounded-lg text-sm font-medium transition-all ${
                tipoFiltro === tipo ? `text-white shadow-sm` : ""
              }`}
              style={{
                backgroundColor: tipoFiltro === tipo ? colors.primary : colors.sidebarItem,
                color: tipoFiltro === tipo ? "white" : colors.sidebarText,
              }}
            >
              {tipo}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-sm mb-2" style={{ color: colors.sidebarText }}>
          Status (Simulado)
        </h3>
        <div
          className="flex space-x-2 p-1 rounded-lg border border-gray-700"
          style={{ backgroundColor: colors.sidebarItem }}
        >
          {(["Todos", "Aberto", "Fechado"] as StatusFiltro[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFiltro(status)}
              className={`flex-1 p-2 rounded-lg text-sm font-medium transition-all ${
                statusFiltro === status ? `text-white shadow-sm` : ""
              }`}
              style={{
                backgroundColor: statusFiltro === status ? colors.primary : colors.sidebarItem,
                color: statusFiltro === status ? "white" : colors.sidebarText,
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <SidebarItemFurnas
              key={`${item.type}-${item.type === "reservatorio" ? item.idreservatorio : item.idsitio}`}
              item={item}
              onSelect={onSelectItem}
              isSelected={
                selectedItemId ===
                `${item.type}-${item.type === "reservatorio" ? item.idreservatorio : item.idsitio}`
              }
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

// Ícone do Sítio: Fundo Verde (Balcar) com borda Azul (Furnas)
const siteIconFurnas = new L.DivIcon({
  className: "custom-site-icon-furnas",
  html: `<div style="background-color: ${colors.mapMarkerBalcar}; width: 15px; height: 15px; border-radius: 50%; border: 3px solid ${colors.mapMarkerFurnas}; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
  iconSize: [21, 21],
  iconAnchor: [10, 10],
});

const INITIAL_CENTER: [number, number] = [-20.0, -47.0];
const INITIAL_ZOOM = 6;

// --- Componente Principal: FurnasMap ---

const FurnasMap: React.FC = () => {
  const [reservatorios, setReservatorios] = useState<Reservatorio[]>([]);
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados da sidebar
  const [tipoFiltro, setTipoFiltro] = useState<TipoFiltroFurnas>("Todos");
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>("Todos"); // Status simulado
  const [searchText, setSearchText] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<string | "all">("all");

  // Efeito de busca de dados
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reservatoriosResponse, sitiosResponse] = await Promise.all([
          fetch("http://localhost:3001/api/furnas/reservatorio/all?limit=10000"),
          fetch("http://localhost:3001/api/furnas/sitio/all?limit=10000"),
        ]);

        const reservatoriosData: ApiResponse<Reservatorio> = await reservatoriosResponse.json();
        const sitiosData: ApiResponse<Sitio> = await sitiosResponse.json();

        if (reservatoriosData.success && sitiosData.success) {
          // Adicionando status simulado
          const reservatoriosComStatus = (reservatoriosData.data || []).map((r, i) => ({
            ...r,
            status: i % 3 === 0 ? "Fechado" : ("Aberto" as "Aberto" | "Fechado"),
          }));
          const sitiosComStatus = (sitiosData.data || []).map((s, i) => ({
            ...s,
            status: i % 5 === 0 ? "Fechado" : ("Aberto" as "Aberto" | "Fechado"),
          }));

          setReservatorios(reservatoriosComStatus);
          setSitios(sitiosComStatus);
        } else {
          console.error("Erro ao carregar dados da API:", reservatoriosData, sitiosData);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Combina Reservatórios e Sítios para a lógica de filtro
  const allData: DataItem[] = useMemo(() => {
    const reservatorioItems: DataItem[] = reservatorios
      .filter((r) => r.lat && r.lng)
      .map((r) => ({ ...r, type: "reservatorio" }));

    const sitioItems: DataItem[] = sitios
      .filter((s) => s.lat && s.lng)
      .map((s) => ({ ...s, type: "sitio" }));

    return [...reservatorioItems, ...sitioItems];
  }, [reservatorios, sitios]);

  // Lógica de filtragem base (para a Sidebar)
  const filteredDataItems = useMemo(() => {
    let list = allData;

    // Filtrar por Tipo (Reservatório/Sitio)
    list = list.filter((item) => {
      if (tipoFiltro === "Reservatório") return item.type === "reservatorio";
      if (tipoFiltro === "Sitio") return item.type === "sitio";
      return true; // "Todos"
    });

    // Filtrar por Status (Aberto/Fechado) - Usando o status simulado
    list = list.filter((item) => {
      if (statusFiltro === "Aberto") return item.status === "Aberto";
      if (statusFiltro === "Fechado") return item.status === "Fechado";
      return true; // "Todos"
    });

    // Filtrar por Busca
    if (searchText) {
      const lowerCaseSearch = searchText.toLowerCase();
      list = list.filter(
        (item) =>
          item.nome.toLowerCase().includes(lowerCaseSearch) ||
          (item.type === "sitio" && item.descricao.toLowerCase().includes(lowerCaseSearch)),
      );
    }
    return list;
  }, [allData, tipoFiltro, statusFiltro, searchText]);

  // --- NOVO: Lógica de Toggle de Seleção ---
  const handleSelectItemToggle = (id: string) => {
    // Se o item clicado for o mesmo que já está selecionado, deseleciona (volta para "all")
    if (selectedItemId === id) {
      setSelectedItemId("all");
    } else {
      // Caso contrário, seleciona o novo item
      setSelectedItemId(id);
    }
  };

  // Filtro final (Aplica a seleção do item único para o mapa)
  const filteredMapItems = useMemo(() => {
    if (selectedItemId === "all") {
      // Se "all" estiver selecionado, o mapa mostra todos os itens filtrados
      return filteredDataItems;
    }
    // Se um item específico estiver selecionado, mostra APENAS ele no mapa
    const selected = filteredDataItems.filter((item) => {
      const idString = `${item.type}-${item.type === "reservatorio" ? item.idreservatorio : item.idsitio}`;
      return idString === selectedItemId;
    });
    return selected; // Retorna apenas o item selecionado (pode ser vazio se o item foi filtrado para fora)
  }, [selectedItemId, filteredDataItems]);

  // Separa os itens filtrados para o mapa
  const filteredMapReservatorios = filteredMapItems.filter(
    (item) => item.type === "reservatorio",
  ) as Reservatorio[];
  const filteredMapSitios = filteredMapItems.filter((item) => item.type === "sitio") as Sitio[];

  // Contadores para o cabeçalho da Sidebar
  const totalReservatorios = allData.filter((item) => item.type === "reservatorio").length;
  const totalSitios = allData.filter((item) => item.type === "sitio").length;

  // Lógica de centralização do mapa
  const mapSettings = useMemo(() => {
    if (selectedItemId !== "all") {
      const [type, idStr] = selectedItemId.split("-");
      const id = Number(idStr);

      let item: Reservatorio | Sitio | undefined;
      if (type === "reservatorio") {
        item = reservatorios.find((r) => r.idreservatorio === id);
      } else if (type === "sitio") {
        item = sitios.find((s) => s.idsitio === id);
      }

      if (item && item.lat && item.lng) {
        return {
          center: [item.lat, item.lng] as [number, number],
          zoom: 9, // Zoom mais próximo para item único
        };
      }
    }
    return {
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    };
  }, [selectedItemId, reservatorios, sitios]);

  if (loading) {
    return <div className="p-4 text-lg font-medium">Carregando mapa FURNAS... 🗺️</div>;
  }

  return (
    // Layout flexível
    <div className="flex" style={{ height: "calc(100vh - 80px)" }}>
      {/* Sidebar */}
      <SidebarFurnas
        tipoFiltro={tipoFiltro}
        setTipoFiltro={setTipoFiltro}
        statusFiltro={statusFiltro}
        setStatusFiltro={setStatusFiltro}
        searchText={searchText}
        setSearchText={setSearchText}
        filteredItems={filteredDataItems} // Passa a lista base para mostrar todos os itens filtrados na Sidebar
        totalSitios={totalSitios}
        totalReservatorios={totalReservatorios}
        selectedItemId={selectedItemId}
        onSelectItem={handleSelectItemToggle}
      />

      {/* Container do Mapa (flex-1) */}
      <div className="flex-1 p-4 overflow-hidden">
        <h1 className="text-3xl font-bold mb-4" style={{ color: colors.primary }}>
          Mapa de Localizações - Projeto FURNAS
        </h1>

        <MapContainer
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
                <Popup>
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
                  <p>
                    <span className="font-semibold">ID:</span> {reservatorio.idreservatorio}
                  </p>
                  <p>Lat: {reservatorio.lat.toFixed(4)}</p>
                  <p>Lng: {reservatorio.lng.toFixed(4)}</p>
                  <p>Status: {reservatorio.status}</p>
                </Popup>
              </Marker>
            );
          })}

          {/* Marcadores de Sítios */}
          {filteredMapSitios.map((sitio) =>
            sitio.lat && sitio.lng ? (
              <Marker key={sitio.idsitio} position={[sitio.lat, sitio.lng]} icon={siteIconFurnas}>
                <Popup>
                  <h3 style={{ color: colors.mapMarkerBalcar }} className="font-bold text-lg">
                    Sítio: {sitio.nome}
                  </h3>
                  <p>
                    <span className="font-semibold">ID:</span> {sitio.idsitio}
                  </p>
                  <p>
                    <span className="font-semibold">Reservatório:</span> {sitio.reservatorio.nome}{" "}
                    (ID: {sitio.reservatorio.idreservatorio})
                  </p>
                  <p>Lat: {sitio.lat.toFixed(4)}</p>
                  <p>Lng: {sitio.lng.toFixed(4)}</p>
                  <p>Status: {sitio.status}</p>
                </Popup>
              </Marker>
            ) : null,
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default FurnasMap;
