import React, { useState } from "react";
import { Link, Routes, Route, useLocation } from "react-router-dom";

// --- Tema Global ---
const theme = {
  primary: "#4682B4", // Azul Aço (moderado e elegante)
  secondary: "#5EC2B7", // Verde-água claro
  accent: "#A7BBC7", // Azul-cinza perolado

  // Tons neutros
  sidebarBg: "#2c2c2c",
  background: "linear-gradient(to bottom right, #f8f9fa, #d9d9d9, #b0b0b0)",
  surface: "#ffffff",
  text: "#1a1a1a",
  textSecondary: "#555555",
  border: "#e0e0e0",

  // Cores de feedback
  success: "#28a745",
  warning: "#ffc107",
  error: "#dc3545",
};

// --- Tipagem ---
interface IconProps {
  active?: boolean;
  className?: string;
}

interface MenuItem {
  label: string;
  path: string;
  icon: React.FC<IconProps>;
}

// --- Componentes de Ícones ---
const IconBase: React.FC<IconProps & { children: React.ReactNode }> = ({
  children,
  active,
  className,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke={active ? theme.secondary : "currentColor"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`transition-colors duration-300 ${
      active ? "text-white" : "text-gray-400"
    } ${className || "w-5 h-5"}`}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const MenuIcon: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </IconBase>
);

const XIcon: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </IconBase>
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

const InfoIcon: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </IconBase>
);

// --- Sidebar ---
interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { label: "Início", path: "/", icon: HomeIcon },
    { label: "Informações do Projeto", path: "/sima-info", icon: InfoIcon },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Overlay Escuro (apenas mobile) */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Container Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 p-6 flex flex-col shadow-xl transition-transform duration-300 ease-in-out bg-[#2f2f2f] md:transform-none md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "linear-gradient(to bottom, #2f2f2f, #3a3a3a, #4b4b4b)",
        }}
      >
        <div className="flex flex-col flex-grow overflow-y-auto">
          {/* Cabeçalho da Sidebar + Botão Fechar Mobile */}
          <div
            className="flex items-center justify-between mb-8 pb-4 border-b"
            style={{ borderColor: theme.border }}
          >
            <div className="flex items-center">
              <img
                src="/sima.png"
                alt="Logo do Projeto Sima"
                className="w-10 h-10 mr-3 drop-shadow-lg object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-white">Projeto Sima</h1>
                <p className="text-xs text-gray-400">Dados Limnológicos</p>
              </div>
            </div>
            {/* Botão X visível apenas no mobile */}
            <button
              onClick={closeSidebar}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <XIcon />
            </button>
          </div>

          {/* Navegação Principal */}
          <nav className="flex flex-col gap-2 mb-8" aria-label="Menu principal">
            <h2 className="text-xs font-semibold uppercase text-gray-500 mb-2">
              Navegação
            </h2>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => closeSidebar()} // Fecha ao clicar no link (UX Mobile)
                className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "shadow-md scale-[1.02] text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/70"
                }`}
                style={{
                  backgroundColor: isActive(item.path)
                    ? theme.primary + "90"
                    : "transparent",
                }}
              >
                <item.icon
                  active={isActive(item.path)}
                  className="w-5 h-5 flex-shrink-0"
                />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Projetos */}
          <div className="mb-8">
            <h2 className="text-xs font-semibold uppercase text-gray-500 mb-3">
              Projetos
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Botão Projeto Furnas */}
              <Link
                to="/furnas"
                onClick={closeSidebar}
                className="group relative aspect-square rounded-lg overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
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

              {/* Botão Projeto Balcar */}
              <Link
                to="/balcar"
                onClick={closeSidebar}
                className="group relative aspect-square rounded-lg overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
              >
                <img
                  src="/balcar.png"
                  alt="Projeto Balcar"
                  className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-300"></div>
                <span className="absolute bottom-2 left-2 text-sm font-bold text-white drop-shadow-md">
                  Balcar
                </span>
              </Link>
            </div>
          </div>

          {/* Sobre */}
          <div
            className="mt-auto pt-4 border-t"
            style={{ borderColor: theme.border }}
          >
            <h2 className="text-xs font-semibold uppercase text-gray-500 mb-2">
              Sobre o Projeto
            </h2>
            <p className="text-sm text-gray-400 leading-snug">
              Sistema integrado de monitoramento ambiental.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

// --- Home Page ---
const HomePage: React.FC = () => {
  const buttonsData = [
    {
      label: "Tabelas",
      path: "/sima-table",
      icon: TableIcon,
      color: "#36454F",
      description: "Visualize dados brutos e planilhas.",
    },
    {
      label: "Gráficos",
      path: "/sima-graph",
      icon: ChartIcon,
      color: "#808080",
      description: "Analise tendências e padrões visuais.",
    },
    {
      label: "Mapas",
      path: "/sima-map",
      icon: MapIcon,
      color: "#A7BBC7",
      description: "Explore a distribuição geográfica dos dados.",
    },
  ];

  return (
    <div style={{ background: theme.background }} className="min-h-full">
      {/* Hero */}
      <div
        className="pt-12 md:pt-16 pb-12 px-4 md:px-12 text-center relative overflow-hidden rounded-b-[2rem] md:rounded-b-3xl shadow-xl"
        style={{
          background:
            "linear-gradient(to bottom right, #f1f1f1, #dcdcdc, #bfbfbf)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(${theme.primary} 1px, transparent 1px),
              radial-gradient(${theme.secondary} 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 10px 10px",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10">
          <img
            src="/sima.png"
            alt="Logo do Projeto Sima"
            className="w-20 h-20 md:w-36 md:h-36 lg:w-48 lg:h-48 mb-6 inline-block drop-shadow-lg object-contain brightness-110"
          />
          {/* Tipografia Responsiva */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 drop-shadow-md mb-2 md:mb-4">
            Projeto Sima
          </h1>
          <h2 className="text-lg md:text-2xl font-medium text-gray-700 mb-6 px-2">
            Monitoramento e Análise de Dados Limnológicos
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto mb-8 md:mb-12 px-4">
            Sistema integrado de monitoramento ambiental.
          </p>

          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-6 md:mb-8">
            Explore os Dados
          </h3>

          <div className="flex justify-center gap-6 flex-wrap">
            {buttonsData.map((btn, idx) => (
              <Link
                key={idx}
                to={btn.path}
                className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl shadow-lg w-full sm:w-64 transition-transform duration-300 hover:scale-[1.05] text-white hover:shadow-2xl"
                style={{ backgroundColor: btn.color }}
              >
                <btn.icon active={true} />
                <span className="font-semibold text-xl">{btn.label}</span>
                <p className="text-xs text-white/90 mt-1">{btn.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div
        className="pt-12 md:pt-16 pb-20 text-center px-4"
        style={{ background: theme.background }}
      >
        <p className="text-gray-700 text-sm md:text-base">
          Escolha como deseja visualizar e analisar os dados limnológicos
          coletados.
        </p>
      </div>
    </div>
  );
};

// --- Páginas Internas ---
const TabelasPage: React.FC = () => (
  <div className="p-4 md:p-8 min-h-screen" style={{ background: theme.background }}>
    <h2
      className="text-2xl md:text-3xl font-bold"
      style={{ color: theme.primary }}
    >
      Tabelas de Dados
    </h2>
    <p className="mt-2" style={{ color: theme.textSecondary }}>
      Conteúdo detalhado das tabelas.
    </p>
  </div>
);

const GraficosPage: React.FC = () => (
  <div className="p-4 md:p-8 min-h-screen" style={{ background: theme.background }}>
    <h2
      className="text-2xl md:text-3xl font-bold"
      style={{ color: theme.primary }}
    >
      Gráficos Interativos
    </h2>
    <p className="mt-2" style={{ color: theme.textSecondary }}>
      Conteúdo das visualizações.
    </p>
  </div>
);

const MapasPage: React.FC = () => (
  <div className="p-4 md:p-8 min-h-screen" style={{ background: theme.background }}>
    <h2
      className="text-2xl md:text-3xl font-bold"
      style={{ color: theme.primary }}
    >
      Mapas de Coleta
    </h2>
    <p className="mt-2" style={{ color: theme.textSecondary }}>
      Conteúdo dos mapas geográficos.
    </p>
  </div>
);

const NotFoundPage: React.FC = () => (
  <div
    className="p-12 text-center min-h-screen"
    style={{ background: theme.background }}
  >
    <h2 className="text-5xl font-extrabold text-red-600">404</h2>
    <p style={{ color: theme.text }}>Página Não Encontrada.</p>
  </div>
);

// --- Layout Principal ---
const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="flex min-h-screen"
      style={{
        background: theme.background,
      }}
    >
      {/* Sidebar com estado */}
      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      {/* Conteúdo Principal */}
      <main
        className="flex-1 flex flex-col h-screen overflow-hidden"
        style={{
          background: theme.background,
        }}
      >
        {/* Barra de Topo Mobile (Hambúrguer) */}
        <div className="md:hidden bg-white p-4 shadow-sm flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-[#4682B4] transition-colors p-1"
              aria-label="Abrir menu"
            >
              <MenuIcon className="w-7 h-7" />
            </button>
            <span
              className="font-bold text-lg"
              style={{ color: theme.primary }}
            >
              Projeto Sima
            </span>
          </div>
        </div>

        {/* Área de conteúdo rolável */}
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sima-table" element={<TabelasPage />} />
            <Route path="/sima-graph" element={<GraficosPage />} />
            <Route path="/sima-map" element={<MapasPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;