import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface ColorPalette {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
}

const colors: ColorPalette = {
  background: '#F3F7FB',
  surface: '#FFFFFF',
  primary: '#CC5500',
  secondary: '#FF8C00',
};

// --- Interfaces e Funções Úteis (Mantidas) ---

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
    
    // Garantir que nomes compostos sejam mantidos
    const namesToMatch = [
      'mascarenhas-de-moraes',
      'serra-da-mesa',
      'tres-marias',
      'santo-antonio',
    ];
  
    for (const matchName of namesToMatch) {
      if (formattedName.startsWith(matchName)) {
        return matchName;
      }
    }
  
  return formattedName;
};

interface Reservatorio {
  idreservatorio: number;
  nome: string;
  lat: number | null;
  lng: number | null;
  status: 'Aberto' | 'Fechado'; // Adicionado status simulado
}

interface Sitio {
  idsitio: number;
  nome: string;
  lat: number | null;
  lng: number | null;
  descricao: string;
  idreservatorio: number;
  status: 'Aberto' | 'Fechado'; // Adicionado status simulado
}

interface ApiResponse<T> {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: T[];
}

// --- Tipos e Funções da Sidebar (ADAPTADOS) ---

type TipoFiltroBalcar = "Todos" | "Reservatório" | "Sitio";
type StatusFiltro = "Todos" | "Aberto" | "Fechado";
type DataItemBalcar = (Reservatorio & { type: 'reservatorio' }) | (Sitio & { type: 'sitio' });

const getIcon = (isReservatorio: boolean) => isReservatorio ? "💧" : "🔌"; // Sítio = Plug Elétrico
const getIconColorClass = (isReservatorio: boolean) => isReservatorio ? "text-red-600 bg-red-100" : "text-green-600 bg-green-100";


// --- Componente: SidebarItem (Adaptado para Balcar) ---

const SidebarItemBalcar: React.FC<{
  item: DataItemBalcar,
  reservatorioNameMap: Record<number, string>, // Necessário para exibir o nome do reservatório do sítio
  onSelect: (id: string) => void,
  isSelected: boolean
}> = ({ item, reservatorioNameMap, onSelect, isSelected }) => {

  const isReservatorio = item.type === 'reservatorio';
  const idString = `${item.type}-${isReservatorio ? item.idreservatorio : item.idsitio}`;

  const statusText = item.status === 'Fechado' ? "Fechado" : "Aberto";
  const statusColor = item.status === 'Fechado' ? "text-red-600" : "text-green-600";

  // Capacidade / Simulação de Carga ou Nível
  const itemID = isReservatorio ? item.idreservatorio : item.idsitio;
  const capacidade = Math.round(((itemID * 19) % 100) * 0.9) + 1;

  const barColor = capacidade > 70 ? "bg-green-500" : capacidade > 40 ? "bg-yellow-500" : "bg-red-500";

  const infoText = isReservatorio
    ? `Controle de Nível e Vazão` : `Conectado ao reservatório: ${reservatorioNameMap[item.idreservatorio] || "N/A"}`;
  const horaText = isReservatorio ? `Prioridade máxima` : `Última verificação: 2 horas atrás`;

  return (
    <div
      className={`p-3 border rounded-lg cursor-pointer transition-colors shadow-sm 
        ${isSelected ? 'border-2 border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}`}
      onClick={() => onSelect(idString)}
    >
      <div className={`flex items-center space-x-3 mb-2`}>
        <div className={`p-2 rounded-full ${getIconColorClass(isReservatorio)} text-lg`}>
          {getIcon(isReservatorio)}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">{item.nome}</h4>
        </div>
        <span className={`text-xs font-medium ${statusColor}`}>{statusText}</span>
      </div>

      <p className="text-xs text-gray-500 mt-1">{infoText}</p>
      <p className="text-xs text-gray-500">{horaText}</p>

      <div className="mt-2 text-xs text-gray-600">
        Carga / Nível (Simulado)
        <div className="flex items-center space-x-2">
          <div className="flex-1 w-full h-1 bg-gray-200 rounded-full">
            <div className={`h-1 rounded-full ${barColor}`}
              style={{ width: `${capacidade}%` }}>
            </div>
          </div>
          <span className="font-medium">{capacidade}%</span>
        </div>
      </div>
    </div>
  );
};


// --- Componente: Sidebar (Adaptado para Balcar) ---

interface SidebarPropsBalcar {
  tipoFiltro: TipoFiltroBalcar;
  setTipoFiltro: (tipo: TipoFiltroBalcar) => void;
  statusFiltro: StatusFiltro;
  setStatusFiltro: (status: StatusFiltro) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  filteredItems: DataItemBalcar[];
  totalReservatorios: number;
  totalSitios: number;
  selectedItemId: string | "all";
  onSelectItem: (id: string) => void;
  reservatorioNameMap: Record<number, string>;
}

const SidebarBalcar: React.FC<SidebarPropsBalcar> = ({
  tipoFiltro, setTipoFiltro,
  statusFiltro, setStatusFiltro,
  searchText, setSearchText,
  filteredItems,
  totalSitios, totalReservatorios,
  selectedItemId,
  onSelectItem,
  reservatorioNameMap
}) => {
  return (
    <div className="w-96 bg-white p-4 overflow-y-auto border-r border-gray-200 shadow-xl flex-shrink-0"
      style={{ height: "100%", zIndex: 10 }}>

      <h2 className="text-xl font-bold mb-1 text-gray-700">Localizações BALCAR</h2>
      <p className="text-sm text-gray-500 mb-4">{filteredItems.length} pontos encontrados</p>

      <div className="flex justify-between space-x-3 mb-4">
        <div className="flex-1 p-3 rounded-lg border border-gray-300 flex items-center shadow-sm">
          <div className={`p-2 rounded-full ${getIconColorClass(true)} text-xl mr-2`}>💧</div>
          <div>
            <p className="text-sm text-gray-500">Reservatórios</p>
            <p className="text-xl font-bold text-gray-800">{totalReservatorios}</p>
          </div>
        </div>
        <div className="flex-1 p-3 rounded-lg border border-gray-300 flex items-center shadow-sm">
          <div className={`p-2 rounded-full ${getIconColorClass(false)} text-xl mr-2`}>🔌</div>
          <div>
            <p className="text-sm text-gray-500">Sítios</p>
            <p className="text-xl font-bold text-gray-800">{totalSitios}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input
            type="text"
            placeholder="Buscar por nome ou descrição..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-sm mb-2 text-gray-700">Tipo</h3>
        <div className="flex space-x-2 p-1 rounded-lg border border-gray-200 bg-gray-50">
          {(["Todos", "Reservatório", "Sitio"] as TipoFiltroBalcar[]).map((tipo) => (
            <button
              key={tipo}
              onClick={() => setTipoFiltro(tipo)}
              className={`flex-1 p-2 rounded-lg text-sm font-medium transition-all ${tipoFiltro === tipo
                  ? `text-white shadow-sm`
                  : "text-gray-700 hover:bg-gray-100"
                }`}
              style={tipoFiltro === tipo ? { backgroundColor: colors.primary } : {}}
            >
              {tipo}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-sm mb-2 text-gray-700">Status (Simulado)</h3>
        <div className="flex space-x-2 p-1 rounded-lg border border-gray-200 bg-gray-50">
          {(["Todos", "Aberto", "Fechado"] as StatusFiltro[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFiltro(status)}
              className={`flex-1 p-2 rounded-lg text-sm font-medium transition-all ${statusFiltro === status
                  ? `text-white shadow-sm`
                  : "text-gray-700 hover:bg-gray-100"
                }`}
              style={statusFiltro === status ? { backgroundColor: colors.primary } : {}}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <SidebarItemBalcar
              key={`${item.type}-${item.type === 'reservatorio' ? item.idreservatorio : item.idsitio}`}
              item={item}
              reservatorioNameMap={reservatorioNameMap}
              onSelect={onSelectItem}
              isSelected={selectedItemId === `${item.type}-${item.type === 'reservatorio' ? item.idreservatorio : item.idsitio}`}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 p-8 text-sm">Nenhuma localização encontrada com os filtros e busca atuais.</p>
        )}
      </div>

    </div>
  );
};


// --- Configurações do Leaflet (Mantidas) ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
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


// --- Componente Principal: BalcarMap (Atualizado) ---

const BalcarMap: React.FC = () => {
  const [reservatorios, setReservatorios] = useState<Reservatorio[]>([]);
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [loading, setLoading] = useState(true);

  // ESTADOS DA SIDEBAR
  const [tipoFiltro, setTipoFiltro] = useState<TipoFiltroBalcar>("Todos");
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>("Todos");
  const [searchText, setSearchText] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<string | "all">("all");


  const reservatorioNameMap: Record<number, string> = useMemo(() => {
    return reservatorios.reduce(
      (acc, res) => {
        acc[res.idreservatorio] = res.nome;
        return acc;
      },
      {} as Record<number, string>
    );
  }, [reservatorios]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reservatoriosResponse, sitiosResponse] = await Promise.all([
          fetch("http://localhost:3001/api/balcar/reservatorio/all?limit=10000"),
          fetch("http://localhost:3001/api/balcar/sitio/all?limit=10000"),
        ]);

        if (!reservatoriosResponse.ok || !sitiosResponse.ok) {
          throw new Error("Uma das requisições falhou");
        }

        const reservatoriosData: ApiResponse<Reservatorio> =
          await reservatoriosResponse.json();
        const sitiosData: ApiResponse<Sitio> = await sitiosResponse.json();

        if (reservatoriosData.success && sitiosData.success) {
          // Adicionando status simulado
          const reservatoriosComStatus = (reservatoriosData.data || []).map((r, i) => ({
            ...r,
            status: i % 3 === 0 ? 'Fechado' : 'Aberto' as 'Aberto' | 'Fechado' 
          }));
          const sitiosComStatus = (sitiosData.data || []).map((s, i) => ({
            ...s,
            status: i % 5 === 0 ? 'Fechado' : 'Aberto' as 'Aberto' | 'Fechado' 
          }));
          
          setReservatorios(reservatoriosComStatus);
          setSitios(sitiosComStatus);
        } else {
          console.error(
            "Erro ao carregar dados da API (success: false):",
            reservatoriosData,
            sitiosData
          );
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
  const allData: DataItemBalcar[] = useMemo(() => {
    const reservatorioItems: DataItemBalcar[] = reservatorios
      .filter(r => r.lat && r.lng)
      .map(r => ({ ...r, type: 'reservatorio' }));

    const sitioItems: DataItemBalcar[] = sitios
      .filter(s => s.lat && s.lng)
      .map(s => ({ ...s, type: 'sitio' }));

    return [...reservatorioItems, ...sitioItems];
  }, [reservatorios, sitios]);


  // LÓGICA DE FILTRAGEM (Baseada na Sidebar)
  const filteredDataItems = useMemo(() => {
    let list = allData;

    // 1. Filtrar por Tipo (Reservatório/Sitio)
    list = list.filter(item => {
      if (tipoFiltro === "Reservatório") return item.type === 'reservatorio';
      if (tipoFiltro === "Sitio") return item.type === 'sitio';
      return true; // "Todos"
    });

    // 2. Filtrar por Status (Aberto/Fechado) - Usando o status simulado
    list = list.filter(item => {
      if (statusFiltro === "Aberto") return item.status === 'Aberto';
      if (statusFiltro === "Fechado") return item.status === 'Fechado';
      return true; // "Todos"
    });

    // 3. Filtrar por Busca
    if (searchText) {
      const lowerCaseSearch = searchText.toLowerCase();
      list = list.filter(item =>
        item.nome.toLowerCase().includes(lowerCaseSearch) ||
        (item.type === 'sitio' && item.descricao.toLowerCase().includes(lowerCaseSearch))
      );
    }
    return list;
  }, [allData, tipoFiltro, statusFiltro, searchText]);

  // FILTRO FINAL (Aplica a seleção do item único)
  const filteredMapItems = useMemo(() => {
    if (selectedItemId === "all") {
      return filteredDataItems;
    }
    // Retorna APENAS o item selecionado, se ele estiver na lista base
    const selected = filteredDataItems.filter((item) => {
      const idString = `${item.type}-${item.type === 'reservatorio' ? item.idreservatorio : item.idsitio}`;
      return idString === selectedItemId;
    });
    return selected.length > 0 ? selected : filteredDataItems; 
  }, [selectedItemId, filteredDataItems]);

  // Separa os itens filtrados para o mapa
  const filteredMapReservatorios = filteredMapItems.filter(item => item.type === 'reservatorio') as Reservatorio[];
  const filteredMapSitios = filteredMapItems.filter(item => item.type === 'sitio') as Sitio[];

  // Contadores para o cabeçalho da Sidebar
  const totalReservatorios = allData.filter(item => item.type === 'reservatorio').length;
  const totalSitios = allData.filter(item => item.type === 'sitio').length;


  // LÓGICA DE CENTRALIZAÇÃO DO MAPA
  const mapSettings = useMemo(() => {
    if (selectedItemId !== "all") {
      const [type, idStr] = selectedItemId.split('-');
      const id = Number(idStr);

      let item: Reservatorio | Sitio | undefined;
      if (type === 'reservatorio') {
        item = reservatorios.find(r => r.idreservatorio === id);
      } else if (type === 'sitio') {
        item = sitios.find(s => s.idsitio === id);
      }

      if (item && item.lat && item.lng) {
        return {
          center: [item.lat, item.lng] as [number, number],
          zoom: 9, 
        };
      }
    }
    return {
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    };
  }, [selectedItemId, reservatorios, sitios]);


  if (loading) {
    return <div className="p-4 text-lg font-medium">Carregando mapa BALCAR... 🗺️</div>;
  }

  return (
    // LAYOUT FLEXÍVEL
    <div className="flex" style={{ height: "calc(100vh - 80px)" }}>

      {/* Sidebar */}
      <SidebarBalcar
        tipoFiltro={tipoFiltro}
        setTipoFiltro={setTipoFiltro}
        statusFiltro={statusFiltro}
        setStatusFiltro={setStatusFiltro}
        searchText={searchText}
        setSearchText={setSearchText}
        filteredItems={filteredDataItems} 
        totalSitios={totalSitios}
        totalReservatorios={totalReservatorios}
        selectedItemId={selectedItemId}
        onSelectItem={setSelectedItemId} 
        reservatorioNameMap={reservatorioNameMap}
      />

      {/* Container do Mapa (flex-1) */}
      <div className="flex-1 p-4 overflow-hidden">
        <h1 className="text-3xl font-bold mb-4" style={{ color: colors.primary }}>
          Mapa de Localizações - Projeto BALCAR
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

                  <h3
                    style={{ color: colors.primary }}
                    className="font-bold text-lg"
                  >
                    Reservatório: {reservatorio.nome}
                  </h3>
                  <p>
                    <span className="font-semibold">ID:</span>{" "}
                    {reservatorio.idreservatorio}
                  </p>
                  <p>Lat: {reservatorio.lat.toFixed(4)}</p>
                  <p>Lng: {reservatorio.lng.toFixed(4)}</p>
                  <p>Status: {reservatorio.status}</p>
                </Popup>
              </Marker>
            );
          })}

          {/* Marcadores de Sítios */}
          {filteredMapSitios.map((sitio) => {
            const reservatorioNome =
              reservatorioNameMap[sitio.idreservatorio] || "Nome Desconhecido";

            return sitio.lat && sitio.lng ? (
              <Marker
                key={sitio.idsitio}
                position={[sitio.lat, sitio.lng]}
                icon={siteIcon}
              >
                <Popup>
                  <h3
                    style={{ color: colors.secondary }}
                    className="font-bold text-lg"
                  >
                    Sítio: {sitio.nome}
                  </h3>
                  <p>
                    <span className="font-semibold">ID Sítio:</span>{" "}
                    {sitio.idsitio}
                  </p>
                  <p>
                    <span className="font-semibold">Reservatório:</span>{" "}
                    {reservatorioNome} (ID: {sitio.idreservatorio})
                  </p>
                  <p>Lat: {sitio.lat.toFixed(4)}</p>
                  <p>Lng: {sitio.lng.toFixed(4)}</p>
                  <p>Status: {sitio.status}</p>
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