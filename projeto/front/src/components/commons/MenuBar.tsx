import { useState, useMemo, useRef, useEffect }
from "react";
import { Link, useLocation } from "react-router-dom";
// Adicionado ChevronDown para o dropdown
import { Menu, X, Home, ChevronDown } from "lucide-react";

// --- Definições dos Temas ---
// (Nenhuma mudança aqui, temas permanecem os mesmos)
const themes = {
  furnas: {
    bg: 'bg-[#1777af]',
    bgHover: 'hover:bg-[#136190]',
    bgMobile: 'bg-[#136190]',
    bgMobileHover: 'hover:bg-[#1777af]',
    accent: 'text-[#1fbdd2]',
    accentBg: 'bg-[#1fbdd2]',
    accentBgHover: 'hover:bg-[#ffb020]',
    accentText: 'text-gray-900',
    focusRing: 'focus:ring-[#FFA500]',
  },
  balcar: {
    bg: 'bg-[#006666]',
    bgHover: 'hover:bg-[#005555]',
    bgMobile: 'bg-[#005555]',
    bgMobileHover: 'hover:bg-[#006666]',
    accent: 'text-[#CFF47D]',
    accentBg: 'bg-[#CFF47D]',
    accentBgHover: 'hover:bg-[#d9f794]',
    accentText: 'text-gray-900',
    focusRing: 'focus:ring-[#CFF47D]',
  },
  sima: {
    bg: 'bg-[#2c2c2c]',
    bgHover: 'hover:bg-[#444444]',
    bgMobile: 'bg-[#444444]',
    bgMobileHover: 'hover:bg-[#555555]',
    accent: 'text-[#e0e0e0]',
    accentBg: 'bg-[#e0e0e0]',
    accentBgHover: 'hover:bg-[#ffffff]',
    accentText: 'text-gray-900',
    focusRing: 'focus:ring-[#e0e0e0]',
  },
};

const getTheme = (path: string) => {
  if (path.startsWith('/furnas')) return themes.furnas;
  if (path.startsWith('/balcar')) return themes.balcar;
  if (path.startsWith('/sima')) return themes.sima;
  return themes.furnas; // Padrão
};

function MenuBar() {
  const [isOpen, setIsOpen] = useState(false); // Menu mobile
  const [isInfoOpen, setIsInfoOpen] = useState(false); // Dropdown de Informações
  const { pathname } = useLocation();
  const infoDropdownRef = useRef<HTMLDivElement>(null); // Ref para o dropdown

  const theme = useMemo(() => getTheme(pathname), [pathname]);

  // Efeito para fechar o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (infoDropdownRef.current && !infoDropdownRef.current.contains(event.target as Node)) {
        setIsInfoOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fecha o menu mobile
  const handleLinkClick = () => setIsOpen(false);

  // Fecha o dropdown de info E o menu mobile (caso necessário)
  const handleInfoLinkClick = () => {
    setIsInfoOpen(false);
    setIsOpen(false);
  };

  const baseLinkClasses = "px-4 py-2 rounded-lg transition duration-200 text-sm font-semibold whitespace-nowrap";
  const desktopLinkClasses = `${baseLinkClasses} ${theme.bgHover}`;
  const mobileLinkClasses = `${baseLinkClasses} w-full text-left ${theme.bgMobileHover}`;

  return (
    <nav className={`${theme.bg} text-white w-full shadow-lg sticky top-0 z-50 font-inter`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link to="/" className="flex items-center space-x-2 text-xl font-extrabold text-white hover:text-gray-200 transition-colors">
            <Home className={`w-6 h-6 ${theme.accent}`} />
            <span>Página Inicial</span>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex space-x-4 items-center">
            <Link to="/balcar" className={desktopLinkClasses}>Balcar</Link>
            <Link to="/furnas" className={desktopLinkClasses}>Furnas</Link>
            <Link to="/sima" className={desktopLinkClasses}>Sima</Link>
            
            <div className="w-px h-6 bg-white/30 mx-2"></div>
            
            {/* --- Botão Dropdown de Informações --- */}
            <div className="relative" ref={infoDropdownRef}>
              <button 
                onClick={() => setIsInfoOpen(!isInfoOpen)}
                className={`${baseLinkClasses} ${theme.accentBg} ${theme.accentBgHover} ${theme.accentText} shadow-md flex items-center space-x-1.5`}
              >
                <span>Informações</span>
                <ChevronDown size={18} className={`${isInfoOpen ? 'rotate-180' : ''} transition-transform`} />
              </button>

              {/* Painel Dropdown */}
              {isInfoOpen && (
                <div className={`absolute top-full right-0 mt-2 w-56 ${theme.bgMobile} rounded-lg shadow-xl z-50 overflow-hidden py-1`}>
                  <Link 
                    to="/balcar-info"
                    onClick={handleInfoLinkClick}
                    className={`block ${mobileLinkClasses} text-white`}
                  >
                    Projeto Balcar
                  </Link>
                  <Link 
                    to="/furnas-info"
                    onClick={handleInfoLinkClick}
                    className={`block ${mobileLinkClasses} text-white`}
                  >
                    Projeto Furnas
                  </Link>
                  <Link 
                    to="/sima-info"
                    onClick={handleInfoLinkClick}
                    className={`block ${mobileLinkClasses} text-white`}
                  >
                    Projeto Sima
                  </Link>
                </div>
              )}
            </div>
            {/* --- Fim do Dropdown --- */}

          </div>

          {/* Botão Mobile (Hamburger/Close) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg text-white ${theme.bgHover} focus:outline-none focus:ring-2 ${theme.focusRing}`}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className={`px-2 pt-2 pb-3 space-y-1 ${theme.bgMobile} shadow-xl`}>
          <Link 
            to="/balcar" 
            onClick={handleLinkClick} 
            className={`block ${mobileLinkClasses} text-white`}
          >
            Balcar
          </Link>
          <Link 
            to="/furnas" 
            onClick={handleLinkClick} 
            className={`block ${mobileLinkClasses} text-white`}
          >
            Furnas
          </Link>
          <Link 
            to="/sima" 
            onClick={handleLinkClick} 
            className={`block ${mobileLinkClasses} text-white`}
          >
            Sima
          </Link>
          
          {/* Separador no mobile */}
          <div className="border-t border-white/20 pt-2 mt-2 space-y-1">
            <Link 
              to="/balcar-info" 
              onClick={handleLinkClick} 
              className={`block ${mobileLinkClasses} text-white/90`}
            >
              Projeto Balcar
            </Link>
            <Link 
              to="/furnas-info" 
              onClick={handleLinkClick} 
              className={`block ${mobileLinkClasses} text-white/90`}
            >
              Projeto Furnas
            </Link>
            <Link 
              to="/sima-info" 
              onClick={handleLinkClick} 
              className={`block ${mobileLinkClasses} text-white/90`}
            >
              Projeto Sima
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default MenuBar;
