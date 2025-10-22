import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { colorsSima } from "../../components/Sima/data/mockData";

// --- Interfaces e Funções Úteis (Mantidas) ---

interface ImageMap {
  [key: string]: string;
}

const reservatorioImages: ImageMap = {
  antar: "/mapa/antar.jpg",
  balbina: "/mapa/balbina.jpg",
  batalha: "/mapa/batalha.jpg",
  'belo-monte': "/mapa/belo-monte.jpg",
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
  'mascarenhas-de-moraes': "/mapa/mascarenhas-de-moraes.jpg",
  'porto-colombia': "/mapa/porto-colombia.jpg",
  segredo: "/mapa/segredo.jpg",
  'serra-da-mesa': "/mapa/serra-da-mesa.jpg",
  'tres-marias': "/mapa/tres-marias.jpg",
  tucurui: "/mapa/tucurui.jpg",
  'santo-antonio': "/mapa/santo-antonio.jpg",
  xingo: "/mapa/xingo.jpg"
};

const formatNameForImageKey = (name: string): string => {
  const formattedName = name
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ /g, "-")
    .replace(/--/g, "-");

  const namesToMatch = [
    'mascarenhas-de-moraes',
    'serra-da-mesa',
    'tres-marias',
    'santo-antonio',
    'belo-monte',
    'porto-colombia'
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

// --- Tipos e Funções da Sidebar (Mantidas) ---

type TipoFiltro = "Todos" | "Coleta" | "Reservatório";
type StatusFiltro = "Todos" | "Aberto" | "Fechado";

const getIcon = (isReservatorio: boolean) => isReservatorio ? "💧" : "🗑️";
const getIconColorClass = (isReservatorio: boolean) => isReservatorio ? "text-blue-600 bg-blue-100" : "text-green-600 bg-green-100";


// --- Componente: SidebarItem (Completo e Corrigido) ---

const SidebarItem: React.FC<{
  estacao: EstacaoComDados,
  formatDate: (date: string) => string,
  onSelect: (id: string) => void, // NOVO: Para centralizar o mapa
  isSelected: boolean // NOVO: Para estilizar o item selecionado
}> = ({ estacao, onSelect, isSelected }) => {

  const imageKey = formatNameForImageKey(estacao.rotulo);
  const isReservatorio = !!reservatorioImages[imageKey];

  const statusText = estacao.fim ? "Fechado" : "Aberto";
  const statusColor = estacao.fim ? "text-red-600" : "text-green-600";

  const capacidade = isReservatorio
    ? Math.round(((estacao.ultimaPrecipitacao ?? 0) % 100) * 0.9) + 1 : 45;

  const barColor = capacidade > 70 ? "bg-green-500" : capacidade > 40 ? "bg-yellow-500" : "bg-red-500";

  const infoText = isReservatorio
    ? `Av. Nazaré, 1000 - Ipiranga, São Paulo ~` : `Rua Domingos de Morais, 2564 - Vila ~`;
  const horaText = isReservatorio ? `24 horas` : `Seg-Sex: 8h às 18h, Sáb: 8h às 12h`;

  return (
    <div
      className={`p-3 border rounded-lg cursor-pointer transition-colors shadow-sm 
                 ${isSelected ? 'border-2 border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
      onClick={() => onSelect(estacao.idestacao)} // NOVO: Ao clicar, seleciona
    >
      <div className={`flex items-center space-x-3 mb-2`}>
        <div className={`p-2 rounded-full ${getIconColorClass(isReservatorio)} text-lg`}>
          {getIcon(isReservatorio)}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">{estacao.rotulo}</h4>
        </div>
        <span className={`text-xs font-medium ${statusColor}`}>{statusText}</span>
      </div>

      <p className="text-xs text-gray-500 mt-1">{infoText}</p>
      <p className="text-xs text-gray-500">{horaText}</p>

      <div className="mt-2 text-xs text-gray-600">
        Capacidade
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


// --- Componente: Sidebar (Aba Lateral Preenchida) ---

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
  selectedEstacaoId: string | "all"; // NOVO: Id da estação selecionada
  onSelectEstacao: (id: string) => void; // NOVO: Função de seleção
}

const Sidebar: React.FC<SidebarProps> = ({
  tipoFiltro, setTipoFiltro,
  statusFiltro, setStatusFiltro,
  searchText, setSearchText,
  filteredEstacoes,
  totalColeta, totalReservatorios,
  selectedEstacaoId,
  onSelectEstacao
}) => {
  return (
    <div className="w-96 bg-white p-4 overflow-y-auto border-r border-gray-200 shadow-xl flex-shrink-0"
      style={{ height: "100%", zIndex: 10 }}>

      <h2 className="text-xl font-bold mb-1 text-gray-700">Localizações</h2>
      <p className="text-sm text-gray-500 mb-4">{filteredEstacoes.length} pontos encontrados</p>

      <div className="flex justify-between space-x-3 mb-4">
        <div className="flex-1 p-3 rounded-lg border border-gray-300 flex items-center shadow-sm">
          <div className={`p-2 rounded-full ${getIconColorClass(false)} text-xl mr-2`}>🗑️</div>
          <div>
            <p className="text-sm text-gray-500">Coleta</p>
            <p className="text-xl font-bold text-gray-800">{totalColeta}</p>
          </div>
        </div>
        <div className="flex-1 p-3 rounded-lg border border-gray-300 flex items-center shadow-sm">
          <div className={`p-2 rounded-full ${getIconColorClass(true)} text-xl mr-2`}>💧</div>
          <div>
            <p className="text-sm text-gray-500">Reservatórios</p>
            <p className="text-xl font-bold text-gray-800">{totalReservatorios}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input
            type="text"
            placeholder="Buscar por nome ou endereço..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      <button
        className={`w-full p-2 mb-6 rounded-lg font-semibold text-white shadow-md transition-colors hover:opacity-90`}
        style={{ backgroundColor: colorsSima.primary }}
        onClick={() => {
          // NOVO: Ao clicar em 'Me localizar', deseleciona qualquer estação para mostrar o mapa completo
          onSelectEstacao("all");
          alert("Funcionalidade 'Me localizar' a ser implementada com a API de Geolocation.");
        }}
      >
        <div className="flex items-center justify-center space-x-2">
          <span>📍 Me localizar</span>
        </div>
      </button>

      <div className="mb-4">
        <h3 className="font-semibold text-sm mb-2 text-gray-700">Tipo</h3>
        <div className="flex space-x-2 p-1 rounded-lg border border-gray-200 bg-gray-50">
          {(["Todos", "Coleta", "Reservatório"] as TipoFiltro[]).map((tipo) => (
            <button
              key={tipo}
              onClick={() => setTipoFiltro(tipo)}
              className={`flex-1 p-2 rounded-lg text-sm font-medium transition-all ${tipoFiltro === tipo
                  ? `text-white shadow-sm`
                  : "text-gray-700 hover:bg-gray-100"
                }`}
              style={tipoFiltro === tipo ? { backgroundColor: colorsSima.primary } : {}}
            >
              {tipo}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-sm mb-2 text-gray-700">Status</h3>
        <div className="flex space-x-2 p-1 rounded-lg border border-gray-200 bg-gray-50">
          {(["Todos", "Aberto", "Fechado"] as StatusFiltro[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFiltro(status)}
              className={`flex-1 p-2 rounded-lg text-sm font-medium transition-all ${statusFiltro === status
                  ? `text-white shadow-sm`
                  : "text-gray-700 hover:bg-gray-100"
                }`}
              style={statusFiltro === status ? { backgroundColor: colorsSima.primary } : {}}
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
              formatDate={() => ""}
              onSelect={onSelectEstacao} // NOVO
              isSelected={selectedEstacaoId === estacao.idestacao} // NOVO
            />
          ))
        ) : (
          <p className="text-center text-gray-500 p-8 text-sm">Nenhuma localização encontrada com os filtros e busca atuais.</p>
        )}
      </div>

    </div>
  );
};


// --- Configurações do Leaflet e Estilos (Mantidas) ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const getPrecipitacaoStyle = (mm: number) => {
  let color = colorsSima.primary;
  let radius = 6;

  // Ajustado para usar as cores originais do seu código (primeiro trecho),
  // que são mais coerentes com o contexto, ao invés das cores do código do colega.
  if (mm > 50) {
    color = "#FF4500"; // Laranja
    radius = 12;
  } else if (mm > 20) {
    color = "#00CED1"; // Turquesa
    radius = 9;
  } else if (mm > 0) {
    color = "#ADD8E6"; // Azul Claro
    radius = 6;
  } else {
    color = "#CCCCCC"; // Cinza
    radius = 5;
  }

  return { color, radius };
};

const INITIAL_CENTER: [number, number] = [-13.5, -50.0];
const INITIAL_ZOOM = 5;


// --- Componente Principal: SimaMap (Lógica de Centralização Mesclada) ---
const SimaMap: React.FC = () => {
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [simaRegistros, setSimaRegistros] = useState<SimaRegistro[]>([]);
  const [loading, setLoading] = useState(true);

  // ESTADOS DO SEU CÓDIGO (Sidebar/Filtros)
  const [tipoFiltro, setTipoFiltro] = useState<TipoFiltro>("Todos");
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>("Todos");
  const [searchText, setSearchText] = useState("");

  // ESTADO DO CÓDIGO DO COLEGA (Seleção e Centralização)
  const [selectedEstacaoId, setSelectedEstacaoId] = useState<string | "all">("all");

  // Função de formatação de data (mantida)
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  // Efeito de busca de dados (Mantido)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [estacoesResponse, simaResponse] = await Promise.all([
          fetch("http://localhost:3001/api/sima/estacao/all?limit=10000"),
          fetch("http://localhost:3001/api/sima/sima/all?limit=10000"),
        ]);
        if (!estacoesResponse.ok || !simaResponse.ok) throw new Error("Uma das requisições de API falhou.");

        const estacoesData: ApiResponse<Estacao> = await estacoesResponse.json();
        const simaData: ApiResponse<SimaRegistro> = await simaResponse.json();

        if (estacoesData.success && simaData.success) {
          setEstacoes(estacoesData.data || []);
          setSimaRegistros(simaData.data || []);
        } else {
          console.error("Erro ao carregar dados da API (success: false):", estacoesData, simaData);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Combina Estações com a última precipitação (Mantido)
  const estacoesComPrecipitacao = useMemo<EstacaoComDados[]>(() => {
    const lastPrecipitacaoMap = new Map<string, number | null>();

    for (const registro of simaRegistros) {
      const id = registro.estacao.idestacao;
      const precipitacao = registro.precipitacao;
      if (precipitacao !== null && precipitacao !== undefined && !lastPrecipitacaoMap.has(id)) {
        lastPrecipitacaoMap.set(id, precipitacao);
      }
    }

    return estacoes
      .filter(estacao => estacao.lat && estacao.lng)
      .map((estacao) => ({
        ...estacao,
        ultimaPrecipitacao: lastPrecipitacaoMap.get(estacao.idestacao) ?? 0,
      }));
  }, [estacoes, simaRegistros]);

  // Contadores (Mantidos)
  const totalColeta = estacoesComPrecipitacao.filter(estacao => !reservatorioImages[formatNameForImageKey(estacao.rotulo)]).length;
  const totalReservatorios = estacoesComPrecipitacao.filter(estacao => !!reservatorioImages[formatNameForImageKey(estacao.rotulo)]).length;

  // LÓGICA DE FILTRAGEM: O filtro da Sidebar é o principal. A seleção por ID do colega é aplicada DEPOIS.
  const filteredEstacoesBase = useMemo(() => {
    let list = estacoesComPrecipitacao;

    // 1. Filtrar por Tipo (Coleta/Reservatório)
    list = list.filter(estacao => {
      const imageKey = formatNameForImageKey(estacao.rotulo);
      const isReservatorio = !!reservatorioImages[imageKey];
      if (tipoFiltro === "Coleta") return !isReservatorio;
      if (tipoFiltro === "Reservatório") return isReservatorio;
      return true; // "Todos"
    });

    // 2. Filtrar por Status (Aberto/Fechado)
    list = list.filter(estacao => {
      if (statusFiltro === "Aberto") return !estacao.fim;
      if (statusFiltro === "Fechado") return !!estacao.fim;
      return true; // "Todos"
    });

    // 3. Filtrar por Busca
    if (searchText) {
      const lowerCaseSearch = searchText.toLowerCase();
      list = list.filter(estacao =>
        estacao.rotulo.toLowerCase().includes(lowerCaseSearch) ||
        estacao.idestacao.toLowerCase().includes(lowerCaseSearch)
      );
    }
    return list;
  }, [estacoesComPrecipitacao, tipoFiltro, statusFiltro, searchText]);

  // FILTRO FINAL (Incluindo a seleção de item único do colega)
  const filteredEstacoes = useMemo(() => {
    if (selectedEstacaoId === "all") {
      return filteredEstacoesBase;
    }
    // Retorna APENAS a estação selecionada, se ela estiver na lista base (respeita os outros filtros)
    const selected = filteredEstacoesBase.filter((e) => e.idestacao === selectedEstacaoId);
    return selected.length > 0 ? selected : filteredEstacoesBase; // fallback para a lista base se a selecionada sumir
  }, [selectedEstacaoId, filteredEstacoesBase]);


  // LÓGICA DE CENTRALIZAÇÃO DO MAPA (Código do colega)
  const mapSettings = useMemo(() => {
    if (selectedEstacaoId !== "all") {
      const estacao = estacoesComPrecipitacao.find(e => e.idestacao === selectedEstacaoId);
      if (estacao && estacao.lat && estacao.lng) {
        return {
          center: [estacao.lat, estacao.lng] as [number, number],
          zoom: 12,
        };
      }
    }
    return {
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    };
  }, [selectedEstacaoId, estacoesComPrecipitacao]);

  if (loading) {
    return <div className="p-4 text-lg font-medium">Carregando mapa SIMA... 🗺️</div>;
  }

  return (
    // LAYOUT FLEXÍVEL (Seu código da Sidebar)
    <div className="flex" style={{ height: "calc(100vh - 80px)" }}>

      {/* Sidebar (Passando a função de seleção e o ID) */}
      <Sidebar
        tipoFiltro={tipoFiltro}
        setTipoFiltro={setTipoFiltro}
        statusFiltro={statusFiltro}
        setStatusFiltro={setStatusFiltro}
        searchText={searchText}
        setSearchText={setSearchText}
        filteredEstacoes={filteredEstacoesBase} // NOTA: Passa a lista pré-filtrada para mostrar tudo na Sidebar
        totalColeta={totalColeta}
        totalReservatorios={totalReservatorios}
        selectedEstacaoId={selectedEstacaoId}
        onSelectEstacao={setSelectedEstacaoId} // Função para centralizar no mapa
      />

      {/* Container do Mapa (flex-1) */}
      <div className="flex-1 p-4 overflow-hidden">
        <h1 className="text-3xl font-bold mb-4" style={{ color: colorsSima.primary }}>
          Mapa de Monitoramento - Projeto SIMA
        </h1>

        <MapContainer
          center={mapSettings.center} // Usa a centralização dinâmica do colega
          zoom={mapSettings.zoom} // Usa o zoom dinâmico do colega
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%", borderRadius: "12px" }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Marcadores e Círculos: USAM filteredEstacoes (a lista final com item único, se houver) */}
          {filteredEstacoes.map(
            (estacao) =>
              estacao.lat &&
              estacao.lng && (
                <Marker key={estacao.idestacao} position={[estacao.lat, estacao.lng]}>
                  <Popup>
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
                                objectFit: "cover"
                              }}
                            />
                          )}

                          <h3 style={{ color: colorsSima.primary }} className="font-bold text-lg">
                            Estação: {estacao.rotulo}
                          </h3>
                          <p>ID da Estação: {estacao.idestacao}</p>
                          <p>Início: {formatDate(estacao.inicio)}</p>
                          <p>Fim: {estacao.fim ? formatDate(estacao.fim) : "Em operação"}</p>
                          <p>Latitude: {estacao.lat.toFixed(4)}</p>
                          <p>Longitude: {estacao.lng.toFixed(4)}</p>
                        </>
                      );
                    })()}
                  </Popup>
                </Marker>
              ),
          )}

          {filteredEstacoes.map((estacao) => {
            const precipitacao = estacao.ultimaPrecipitacao ?? 0;
            const { color, radius } = getPrecipitacaoStyle(precipitacao);

            return (
              estacao.lat &&
              estacao.lng && (
                <CircleMarker
                  key={`precip-${estacao.idestacao}`}
                  center={[estacao.lat, estacao.lng]}
                  pathOptions={{ color: color, fillColor: color, fillOpacity: 0.7, weight: 1 }}
                  radius={radius}
                >
                  <Popup>
                    <h3 style={{ color: color }} className="font-bold text-lg">
                      Estação: {estacao.rotulo}
                    </h3>
                    <p>
                      Precipitação (últ. registro):{" "}
                      <strong style={{ color }}>{precipitacao.toFixed(2)} mm</strong>
                    </p>
                    <p>ID da Estação: {estacao.idestacao}</p>
                  </Popup>
                </CircleMarker>
              )
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default SimaMap;