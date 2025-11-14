import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Paleta de cores
const colors = {
 // Cores Primárias/Secundárias para Ênfase e Marca (Tema "Balcar")
 primary: '#047857',   // Verde Esmeralda Escuro (Cor Balcar)
 secondary: '#10B981',  // Verde Limão/Menta Vibrante (para Sítios/detalhes)
 white: '#FFFFFF',    // Cor do texto em botões primários

 // Cores da Sidebar (Tema Escuro - Neutro)
 sidebarBg: '#1E293B',   // Fundo Principal da Sidebar (Slate 800)
 sidebarBorder: '#334155', // Borda sutil e separadores (Slate 700)
 sidebarItem: '#334155',  // Fundo de itens não selecionados (Slate 700)
 sidebarHover: '#475569',  // Fundo de hover (Slate 600)
 sidebarText: '#F8FAFC',   // Cor principal do texto (White/Slate 50)
 sidebarTextMuted: '#94A3B8', // Cor do texto secundário/muted (Slate 400)

 // Cores do Mapa (UI Neutra)
 mapPopupBg: '#334155',  // Fundo do Popup do mapa (Slate 700)
 mapPopupText: '#F8FAFC', // Texto do Popup do mapa (White/Slate 50)

 // Cores dos Marcadores (Entidades)
 mapMarkerReservatorio: '#047857', // Verde Esmeralda Escuro (Balcar)
 mapMarkerSite: '#10B981',    // Verde Limão/Menta Vibrante (Sítio Balcar)

 // Outras cores do sistema (para consistência)
 mapMarkerFurnas: '#1D4ED8',
 mapMarkerSima: '#C2410C',
};

// --- Interfaces e Funções Úteis ---

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

// --- Tipos e Funções da Sidebar ---

type TipoFiltroBalcar = "Todos" | "Reservatório" | "Sitio";
type StatusFiltro = "Todos" | "Aberto" | "Fechado";
type DataItemBalcar = (Reservatorio & { type: 'reservatorio' }) | (Sitio & { type: 'sitio' });

const getIcon = (isReservatorio: boolean) => isReservatorio ? "💧" : "🔌"; // Sítio = Plug Elétrico

// Usando o objeto 'colors' para os ícones
const getIconBgStyle = (isReservatorio: boolean) => ({
 backgroundColor: isReservatorio ? colors.primary : colors.secondary, // Verde escuro e verde claro
 color: colors.white,
});


// --- Componente: SidebarItem ---

const SidebarItemBalcar: React.FC<{
 item: DataItemBalcar,
 reservatorioNameMap: Record<number, string>, // Necessário para exibir o nome do reservatório do sítio
 onSelect: (id: string) => void,
 isSelected: boolean
}> = ({ item, reservatorioNameMap, onSelect, isSelected }) => {

 const isReservatorio = item.type === 'reservatorio';
 const idString = `${item.type}-${isReservatorio ? item.idreservatorio : item.idsitio}`;

 const statusText = item.status === 'Fechado' ? "Fechado" : "Aberto";
 const statusColor = item.status === 'Fechado' ? "text-red-400" : "text-green-400";

 const itemID = isReservatorio ? item.idreservatorio : item.idsitio;
 const capacidade = Math.round(((itemID * 19) % 100) * 0.9) + 1;

 const barColor = capacidade > 70 ? "bg-green-500" : capacidade > 40 ? "bg-yellow-500" : "bg-red-500";


 const infoText = isReservatorio
  ? `Controle de Nível e Vazão` : `Conectado ao reservatório: ${reservatorioNameMap[item.idreservatorio] || "N/A"}`;
 const horaText = isReservatorio ? `Prioridade máxima` : `Última verificação: 2 horas atrás`;

 return (
  <div
   className={`p-3 border rounded-lg cursor-pointer transition-colors shadow-sm relative`}
   style={{
    backgroundColor: isSelected ? colors.sidebarHover : colors.sidebarItem,
    borderColor: isSelected ? colors.primary : colors.sidebarBorder, // Borda 'primary' (Verde) quando selecionado
    borderStyle: 'solid',
    borderWidth: isSelected ? '2px' : '1px',
   }}
   onClick={() => onSelect(idString)}
  >
   <div className={`flex items-center space-x-3 mb-2`}>
    <div
     className={`p-2 rounded-full text-lg`}
     style={getIconBgStyle(isReservatorio)}
    >
     {getIcon(isReservatorio)}
    </div>
    <div className="flex-1">
     <h4 className="font-semibold" style={{ color: colors.sidebarText }}>{item.nome}</h4>
    </div>
    <span className={`text-xs font-medium ${statusColor}`}>{statusText}</span>
   </div>

   <p className="text-xs mt-1" style={{ color: colors.sidebarTextMuted }}>{infoText}</p>
   <p className="text-xs" style={{ color: colors.sidebarTextMuted }}>{horaText}</p>

   <div className="mt-2 text-xs" style={{ color: colors.sidebarTextMuted }}>
    Carga / Nível (Simulado)
    <div className="flex items-center space-x-2">
     <div className="flex-1 w-full h-1 bg-gray-600 rounded-full">
      <div className={`h-1 rounded-full ${barColor}`}
       style={{ width: `${capacidade}%` }}>
      </div>
     </div>
     <span className="font-medium" style={{ color: colors.sidebarText }}>{capacidade}%</span>
    </div>
   </div>
  </div>
 );
};


// --- Componente: Sidebar ---

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

   <h2 className="text-xl font-bold mb-1" style={{ color: colors.sidebarText }}>Localizações BALCAR</h2>
   <p className="text-sm mb-4" style={{ color: colors.sidebarTextMuted }}>{filteredItems.length} pontos encontrados</p>

   <div className="flex justify-between space-x-3 mb-4">
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
    {/* Card Sítios */}
    <div
     className="flex-1 p-3 rounded-lg flex items-center shadow-sm"
     style={{ border: `1px solid ${colors.sidebarBorder}`, backgroundColor: colors.sidebarItem }}
    >

     <div
      className={`p-2 rounded-full text-xl mr-2`}
      style={getIconBgStyle(false)}
     >🔌</div>
     <div>
      <p className="text-sm" style={{ color: colors.sidebarTextMuted }}>Sítios</p>
      <p className="text-xl font-bold" style={{ color: colors.sidebarText }}>{totalSitios}</p>
     </div>
    </div>
   </div>

   <div className="mb-4">
    <div className="relative">
     <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: colors.sidebarTextMuted }} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
     <input
      type="text"
      placeholder="Buscar por nome ou descrição..."
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      className="w-full pl-10 pr-4 py-2 text-sm rounded-lg focus:ring-opacity-50"
      style={{
       border: `1px solid ${colors.sidebarBorder}`,
       backgroundColor: colors.sidebarItem, // Fundo do input
       color: colors.sidebarText, // Texto digitado
       // Adicionando foco com a cor primária (Verde)
       '--tw-ring-color': colors.primary,
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
     {(["Todos", "Reservatório", "Sitio"] as TipoFiltroBalcar[]).map((tipo) => (
      <button
       key={tipo}
       onClick={() => setTipoFiltro(tipo)}
       className={`flex-1 p-2 rounded-lg text-sm font-medium transition-all ${tipoFiltro === tipo
         ? `text-white shadow-sm`
         : "hover:opacity-80"
        }`}
       style={
        tipoFiltro === tipo
         ? { backgroundColor: colors.primary, color: colors.white } // Botão Verde
         : { color: colors.sidebarText, backgroundColor: 'transparent' }
       }
      >
       {tipo}
      </button>
     ))}
    </div>
   </div>

   <div className="mb-6">
    <h3 className="font-semibold text-sm mb-2" style={{ color: colors.sidebarText }}>Status (Simulado)</h3>
    <div
     className="flex space-x-2 p-1 rounded-lg border"
     style={{
      borderColor: colors.sidebarBorder,
      backgroundColor: colors.sidebarItem // Fundo do container do filtro
     }}
    >
     {(["Todos", "Aberto", "Fechado"] as StatusFiltro[]).map((status) => (
      <button
       key={status}
       onClick={() => setStatusFiltro(status)}
       className={`flex-1 p-2 rounded-lg text-sm font-medium transition-all ${statusFiltro === status
         ? `text-white shadow-sm`
         : "hover:opacity-80"
        }`}
       style={
        statusFiltro === status
         ? { backgroundColor: colors.primary, color: colors.white } // Botão Verde
         : { color: colors.sidebarText, backgroundColor: 'transparent' }
       }
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
     <p className="text-center p-8 text-sm" style={{ color: colors.sidebarTextMuted }}>Nenhuma localização encontrada com os filtros e busca atuais.</p>
    )}
   </div>

  </div>
 );
};


// --- Configurações do Leaflet ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
 iconRetinaUrl:
  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
 iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
 shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Ícone do Sítio Balcar (Fundo verde vibrante, borda verde escura)
const siteIcon = new L.DivIcon({
 className: "custom-site-icon",
 html: `<div style="background-color: ${colors.secondary}; width: 15px; height: 15px; border-radius: 50%; border: 3px solid ${colors.primary}; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
 iconSize: [21, 21],
 iconAnchor: [10, 10],
});

const INITIAL_CENTER: [number, number] = [-14.235, -51.9253];
const INITIAL_ZOOM = 4;


// --- Componente Principal: BalcarMap ---

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


 // Lógica de filtragem
 const filteredDataItems = useMemo(() => {
  let list = allData;

  // Filtrar por Tipo (Reservatório/Sitio)
  list = list.filter(item => {
   if (tipoFiltro === "Reservatório") return item.type === 'reservatorio';
   if (tipoFiltro === "Sitio") return item.type === 'sitio';
   return true; // "Todos"
  });

  // Filtrar por Status (Aberto/Fechado) - Usando o status simulado
  list = list.filter(item => {
   if (statusFiltro === "Aberto") return item.status === 'Aberto';
   if (statusFiltro === "Fechado") return item.status === 'Fechado';
   return true; // "Todos"
  });

  // Filtrar por Busca
  if (searchText) {
   const lowerCaseSearch = searchText.toLowerCase();
   list = list.filter(item =>
    item.nome.toLowerCase().includes(lowerCaseSearch) ||
    (item.type === 'sitio' && item.descricao.toLowerCase().includes(lowerCaseSearch))
   );
  }
  return list;
 }, [allData, tipoFiltro, statusFiltro, searchText]);

 // Filtro final (Aplica a seleção do item único)
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


 // lógica de centralização do mapa
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


 // <-- CORREÇÃO 2: Injeção de Estilo para Popups (Solução "Sem CSS Externo")
 // Define os estilos do popup usando os valores do objeto 'colors'
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
  // Layout flexível
  <div className="flex" style={{ height: "calc(100vh - 80px)" }}>

   {/* <-- CORREÇÃO 2 (Continuação): Renderiza a tag <style> no DOM */}
   <style>{popupStyles}</style>

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
        <Popup
         // <-- CORREÇÃO 3: Substitui a prop 'style' por 'className'
         className="balcar-popup"
        >
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
          // Cor do título do popup (Verde Balcar)
          style={{ color: colors.mapMarkerReservatorio }}
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
s    {filteredMapSitios.map((sitio) => {
      const reservatorioNome =
       reservatorioNameMap[sitio.idreservatorio] || "Nome Desconhecido";

      return sitio.lat && sitio.lng ? (
       <Marker
        key={sitio.idsitio}
        position={[sitio.lat, sitio.lng]}
        icon={siteIcon}
       >
        <Popup
         // <-- CORREÇÃO 4: Substitui a prop 'style' por 'className'
         className="balcar-popup"
        >
         <h3
          // Cor do título do Sítio (Verde Vibrante)
          style={{ color: colors.mapMarkerSite }}
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