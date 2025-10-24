import React from "react";
import { Link, Routes, Route, useLocation } from "react-router-dom";

// --- Variáveis de Estilo ---
const primaryColor: string = "#1777af"; // Azul Corporativo
const secondaryColor: string = "#00BFFF"; // Azul Claro/Ciano
const sidebarBg: string = "#2d3748"; // Sidebar

// --- Tipagem ---
interface IconProps { active: boolean; }
interface MenuItem { label: string; path: string; icon: React.FC<IconProps>; }

// --- Componentes de Ícones ---
// (Nenhuma alteração aqui, estão corretos)
const IconBase: React.FC<IconProps & { children: React.ReactNode }> = ({ children, active }) => (
 <svg
  xmlns="http://www.w3.org/2000/svg"
  width="20"
  height="20"
  fill="none"
  stroke={active ? secondaryColor : "currentColor"}
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  className={`w-5 h-5 transition-colors duration-300 ${active ? 'text-white' : 'text-gray-400'}`}
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
 <IconBase {...props}><path d="M12 3v18M4 9h16M4 15h16M20 3H4" /></IconBase>
);
const ChartIcon: React.FC<IconProps> = (props) => (
 <IconBase {...props}><path d="M18 20V10M12 20V4M6 20v-6" /></IconBase>
);
const MapIcon: React.FC<IconProps> = (props) => (
 <IconBase {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></IconBase>
);

// --- Sidebar ---
const Sidebar: React.FC = () => {
 const location = useLocation();
 const menuItems: MenuItem[] = [
  { label: "Início", path: "/", icon: HomeIcon },
  { label: "Tabelas", path: "/furnas-table", icon: TableIcon },
  { label: "Gráficos", path: "/furnas-graph", icon: ChartIcon },
  { label: "Mapas", path: "/furnas-map", icon: MapIcon },
 ];
 const isActive = (path: string) => location.pathname === path;

 return (
    // CORREÇÃO 1: 
    // - Trocado 'top-0' por 'top-[30px]' (para ficar abaixo da BarraBrasil de 30px)
    // - Trocado 'h-full' por 'h-[calc(100vh-30px)]' (para preencher o resto da altura)
  <aside 
      className="fixed top-[30px] left-0 h-[calc(100vh-30px)] w-64 p-6 flex flex-col shadow-xl z-20" 
      style={{ backgroundColor: sidebarBg }}
    >
   <div className="flex flex-col flex-grow">
    <div className="flex items-center mb-8 pb-4 border-b border-gray-700">
     <span className="text-3xl font-extrabold mr-2" style={{ color: secondaryColor }}>💧</span>
     <div>
      <h1 className="text-xl font-bold text-white">Projeto Furnas</h1>
      <p className="text-xs text-gray-400">Dados Limnológicos</p>
     </div>
    </div>

    <nav className="flex flex-col gap-2 mb-8" aria-label="Menu principal">
     <h2 className="text-xs font-semibold uppercase text-gray-500 mb-2">Navegação</h2>
     {menuItems.map((item) => (
      <Link
       key={item.path}
       to={item.path}
       className={`flex items-center p-3 rounded-lg font-medium transition-all duration-200
        ${isActive(item.path)
         ? 'bg-blue-600/50 text-white shadow-md scale-[1.02]'
         : 'text-gray-300 hover:bg-gray-700/70 hover:text-white'}`}
      >
       <item.icon active={isActive(item.path)} />
       <span>{item.label}</span>
      </Link>
     ))}
    </nav>

    <div className="mt-auto pt-4 border-t border-gray-700">
     <h2 className="text-xs font-semibold uppercase text-gray-500 mb-2">Sobre o Projeto</h2>
     <p className="text-sm text-gray-400 leading-snug">
      Monitoramento da qualidade da água do reservatório de Furnas.
     </p>
    </div>
   </div>
  </aside>
 );
};

// --- Home Page ---
const HomePage: React.FC = () => {
 const buttonsData = [
  { label: "Tabelas", path: "/furnas-table", icon: TableIcon, color: "bg-blue-600", description: "Visualize dados brutos e planilhas." },
  { label: "Gráficos", path: "/furnas-graph", icon: ChartIcon, color: "bg-blue-500", description: "Analise tendências e padrões visuais." },
  { label: "Mapas", path: "/furnas-map", icon: MapIcon, color: "bg-blue-400", description: "Explore a distribuição geográfica dos dados." },
 ];

 return (
  <div className="bg-gray-50">
   {/* Hero */}
   <div className="pt-24 pb-16 px-12 text-center relative overflow-hidden rounded-b-3xl shadow-xl" style={{ backgroundColor: primaryColor }}>
    <div
     className="absolute inset-0 opacity-10"
     style={{
      backgroundImage: `radial-gradient(${primaryColor} 1px, transparent 1px), radial-gradient(${primaryColor} 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 10px 10px'
     }}
     aria-hidden="true"
    />
    <div className="relative z-10">
     <span className="text-6xl mb-4 inline-block drop-shadow-lg" style={{ color: secondaryColor }}>💧</span>
     <h1 className="text-5xl font-extrabold text-white drop-shadow-md mb-4">Projeto Furnas</h1>
     <h2 className="text-2xl font-medium text-white/90 mb-6">Monitoramento e Análise de Dados Limnológicos</h2>
     <p className="text-base text-white/70 max-w-xl mx-auto mb-12">
      Sistema integrado para visualização e análise da qualidade da água do Reservatório de Furnas.
     </p>

     <h3 className="text-3xl font-extrabold text-white mb-8">Explore os Dados</h3>

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

      {/* CORREÇÃO 5: Trocado 'pt-20' (80px) por 'pt-16' (64px) */}
   <div className="pt-16 pb-20 text-center bg-gray-50">
    <p className="text-gray-600">Escolha como deseja visualizar e analisar os dados limnológicos coletados</p>
   </div>
  </div>
 );
};

// --- Páginas internas ---
// (Nenhuma alteração aqui)
const TabelasPage: React.FC = () => (
 <div className="p-8">
  <h2 className="text-3xl font-bold" style={{ color: primaryColor }}>Tabelas de Dados</h2>
  <p className="text-gray-600">Conteúdo detalhado das tabelas.</p>
 </div>
);

const GraficosPage: React.FC = () => (
 <div className="p-8">
  <h2 className="text-3xl font-bold" style={{ color: primaryColor }}>Gráficos Interativos</h2>
  <p className="text-gray-600">Conteúdo das visualizações.</p>
 </div>
);

const MapasPage: React.FC = () => (
 <div className="p-8">
  <h2 className="text-3xl font-bold" style={{ color: primaryColor }}>Mapas de Coleta</h2>
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
    {/* CORREÇÃO 2: 
        - Adicionado 'pt-[30px]' para que NENHUMA página comece abaixo da BarraBrasil.
    */}
  <main className="flex-1 ml-64 overflow-y-auto pt-[30px]">
   <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/furnas-table" element={<TabelasPage />} />
    <Route path="/furnas-graph" element={<GraficosPage />} />
    <Route path="/furnas-map" element={<MapasPage />} />
    <Route path="*" element={<NotFoundPage />} />
   </Routes>
  </main>
 </div>
);

export default AppLayout;
