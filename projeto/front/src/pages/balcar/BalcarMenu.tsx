import { Link, useLocation, Routes, Route } from "react-router-dom";
import React from "react";

// --- Cores ---
const primaryColor = "#006666"; // Verde Corporativo
const secondaryColor = "#CFF47D"; // Verde Claro
//const sidebarBg = "#082020"; // Fundo da Sidebar (Não mais usado, mas mantido)

// --- Tipagem ---
interface IconProps {
  active: boolean;
}
interface MenuItem {
  label: string;
  path: string;
  icon: React.FC<any>; // Permite ícones com ou sem 'active'
}

// --- Componentes de Ícones ---
const IconBase: React.FC<IconProps & { children: React.ReactNode }> = ({
  children,
  active,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    stroke={active ? secondaryColor : "currentColor"}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`w-5 h-5 transition-colors duration-300 ${
      active ? "text-white" : "text-gray-400"
    }`}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const HomeIcon: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </IconBase>
);

const TableIcon: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <path d="M12 3v18M4 9h16M4 15h16M20 3H4" />
  </IconBase>
);

const ChartIcon: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <path d="M18 20V10M12 20V4M6 20v-6" />
  </IconBase>
);

const MapIcon: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </IconBase>
);

// --- NOVO ÍCONE DE INFORMAÇÃO ---
const InfoIcon: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </IconBase>
);

// --- Sidebar (MODIFICADA) ---
const Sidebar: React.FC = () => {
  const location = useLocation();

  // --- ITENS DE MENU MODIFICADOS ---
  const menuItems: MenuItem[] = [
    { label: "Início", path: "/", icon: HomeIcon },
    { label: "Informações do Projeto", path: "/info", icon: InfoIcon },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className="left-0 h-screen w-64 p-6 flex flex-col shadow-xl z-20"
      style={{
        background: "linear-gradient(to bottom, #2f2f2f, #3a3a3a, #4b4b4b)",
      }}
    >
      <div className="flex flex-col flex-grow">
        {/* --- Seção do Logo (Mantido Balcar) --- */}
        <div className="flex items-center mb-8 pb-4 border-b border-gray-700">
          <img
            src="/balcar.png"
            alt="Logo do Projeto Balcar"
            className="w-10 h-10 mr-3 drop-shadow-lg object-contain"
          />
          <div>
            <h1 className="text-xl font-bold text-white">Projeto Balcar</h1>
            <p className="text-xs text-gray-400">Dados Limnológicos</p>
          </div>
        </div>

        {/* --- Navegação Principal (Modificada) --- */}
        <nav className="flex flex-col gap-2 mb-8" aria-label="Menu principal">
          <h2 className="text-xs font-semibold uppercase text-gray-500 mb-2">
            Navegação
          </h2>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? "shadow-md scale-[1.02] text-white"
                  : "text-gray-300 hover:text-white hover:bg-gray-700/70"
              }`}
              style={{
                // Usando a primaryColor (#006666) deste arquivo
                backgroundColor: isActive(item.path)
                  ? primaryColor + "90"
                  : "transparent",
              }}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" active={isActive(item.path)} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* --- NOVA SEÇÃO DE PROJETOS --- */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold uppercase text-gray-500 mb-3">
            Projetos
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {/* --- Botão Projeto Furnas (AGORA É LINK) --- */}
            <Link
              to="/furnas"
              className="group relative aspect-square rounded-lg overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
              title="Projeto Furnas"
            >
              <img
                src="/furnas.jpg"
                alt="Projeto Furnas"
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-300"></div>
              <span className="absolute bottom-2 left-2 text-sm font-bold text-white drop-shadow-md">
                Furnas
              </span>
            </Link>

            {/* --- Botão Projeto Sima (AGORA É LINK E COM AJUSTE DE IMAGEM) --- */}
            <Link
              to="/sima"
              className="group relative aspect-square rounded-lg overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-xl bg-gray-700" // Fundo para o botão
              title="Projeto Sima"
            >
              <img
                src="/sima.png"
                alt="Projeto Sima"
                className="h-1/2 w-auto object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 group-hover:opacity-80" // Imagem centralizada e com metade da altura
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-300"></div>
              <span className="absolute bottom-2 left-2 text-sm font-bold text-white drop-shadow-md">
                Sima
              </span>
            </Link>
          </div>
        </div>


        {/* --- Seção "Sobre" (Movida para o final) --- */}
        <div className="mt-auto pt-4 border-t border-gray-700">
          <h2 className="text-xs font-semibold uppercase text-gray-500 mb-2">
            Sobre o Projeto
          </h2>
          <p className="text-sm text-gray-400 leading-snug">
            {/* Texto genérico atualizado */}
            Sistema integrado de monitoramento ambiental.
          </p>
        </div>
      </div>
    </aside>
  );
};

// --- Páginas ---
const HomePage: React.FC = () => {
  const buttonsData = [
    {
      label: "Tabelas",
      path: "/balcar-table",
      icon: TableIcon,
      color: "bg-green-700",
      description: "Visualize dados brutos e planilhas.",
    },
    {
      label: "Gráficos",
      path: "/balcar-graph",
      icon: ChartIcon,
      color: "bg-green-600",
      description: "Analise tendências e padrões visuais.",
    },
    {
      label: "Mapas",
      path: "/balcar-map",
      icon: MapIcon,
      color: "bg-green-500",
      description: "Explore a distribuição geográfica dos dados.",
    },
  ];

  return (
    <div className="bg-gray-50">
      <div
        className="pt-24 pb-16 px-12 text-center relative overflow-hidden rounded-b-3xl shadow-xl"
        style={{ backgroundColor: primaryColor }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(${primaryColor} 1px, transparent 1px),
              radial-gradient(${primaryColor} 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 10px 10px",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10">
          <img
            src="/balcar.png"
            alt="Logo do Projeto Balcar"
            className="w-24 h-24 mb-6 inline-block drop-shadow-lg object-contain brightness-110"
          />
          <h1 className="text-5xl font-extrabold text-white drop-shadow-md mb-4">
            Projeto Balcar
          </h1>
          <h2 className="text-2xl font-medium text-white/90 mb-6">
            Monitoramento e Análise de Dados Limnológicos
          </h2>
          <p className="text-base text-white/70 max-w-xl mx-auto mb-12">
            Balanço de carbono nos reservatórios de FURNAS.
          </p>
          <h3 className="text-3xl font-extrabold text-white mb-8">
            Explore os Dados
          </h3>

          <div className="flex justify-center gap-6 flex-wrap">
            {buttonsData.map((btn, idx) => (
              <Link
                key={idx}
                to={btn.path}
                className={`flex flex-col items-center justify-center gap-2 p-6 rounded-2xl shadow-2xl w-64 transition-transform duration-300 hover:scale-[1.05] ${btn.color} text-white hover:shadow-lg hover:brightness-110`}
              >
                <btn.icon active={true} />
                <span className="font-semibold text-xl">{btn.label}</span>
                <p className="text-xs text-white/80 mt-1">{btn.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-16 pb-20 text-center bg-gray-50">
        <p className="text-gray-600">
          Escolha como deseja visualizar e analisar os dados limnológicos
          coletados.
        </p>
      </div>
    </div>
  );
};

const TabelasPage: React.FC = () => (
  <div className="p-8">
    <h2 className="text-3xl font-bold" style={{ color: primaryColor }}>
      Tabelas de Dados
    </h2>
    <p className="text-gray-600">Conteúdo detalhado das tabelas.</p>
  </div>
);

const GraficosPage: React.FC = () => (
  <div className="p-8">
    <h2 className="text-3xl font-bold" style={{ color: primaryColor }}>
      Gráficos Interativos
    </h2>
    <p className="text-gray-600">Conteúdo das visualizações.</p>
  </div>
);

const MapasPage: React.FC = () => (
  <div className="p-8">
    <h2 className="text-3xl font-bold" style={{ color: primaryColor }}>
      Mapas de Coleta
    </h2>
    <p className="text-gray-600">Conteúdo dos mapas geográficos.</p>
  </div>
);

const NotFoundPage: React.FC = () => (
  <div className="p-12 text-center">
    <h2 className="text-5xl font-extrabold text-red-600">404</h2>
    <p className="text-xl text-gray-700">Página Não Encontrada.</p>
  </div>
);

// --- Layout Principal ---
const AppLayout: React.FC = () => (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar />
    <main className="flex-1 overflow-y-auto ">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/balcar-table" element={<TabelasPage />} />
        <Route path="/balcar-graph" element={<GraficosPage />} />
        <Route path="/balcar-map" element={<MapasPage />} />
        {/* As rotas /info, /furnas, e /sima não estão definidas,
            então levarão ao NotFoundPage */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  </div>
);

export default AppLayout;