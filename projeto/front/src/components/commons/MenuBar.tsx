import { useState } from "react";
import { Link } from "react-router-dom"; // Assumindo react-router-dom
import { Menu, X, Home } from "lucide-react"; // Adicionei Waves para o ícone de marca

// Cores do Projeto:
// Primary Blue: #1777af
// Primary Dark Blue (Hover/Mobile BG): #136190 (custom shade)
// Secondary Cyan: #FFA500

/**
 * Componente de Menu de Navegação Superior.
 * Utiliza Tailwind CSS para styling e é totalmente responsivo (desktop/mobile).
 */
function MenuBar() {
  const [isOpen, setIsOpen] = useState(false);

  // Função para fechar o menu mobile
  const handleLinkClick = () => setIsOpen(false);

  // Classes de estilo reutilizáveis para os links de navegação
  const baseLinkClasses = "px-4 py-2 rounded-lg transition duration-200 text-sm font-semibold whitespace-nowrap";
  const desktopLinkClasses = `${baseLinkClasses} hover:bg-[#136190]`;
  const mobileLinkClasses = `${baseLinkClasses} w-full text-left hover:bg-[#1777af]`; // No mobile, o hover é o azul mais claro

  return (
    // Nav principal: Primary Blue e Sombra
    <nav className="bg-[#1777af] text-white w-full shadow-lg sticky top-0 z-50 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Título Principal */}
          <Link to="/" className="flex items-center space-x-2 text-xl font-extrabold text-white hover:text-gray-200 transition-colors">
            <Home className="w-6 h-6 text-[#FFA500]" />
            <span>Página Inicial</span>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex space-x-4 items-center">
            <Link to="/balcar" className={desktopLinkClasses}>Balcar</Link>
            <Link to="/furnas" className={desktopLinkClasses}>Furnas</Link>
            <Link to="/sima" className={desktopLinkClasses}>Sima</Link>
            
            {/* Separador e links secundários */}
            <div className="w-px h-6 bg-white/30 mx-2"></div>
            <Link to="/about" className={`${baseLinkClasses} bg-[#FFA500] hover:bg-[#ffb020] text-gray-900 shadow-md`}>Informações Sobre os Projetos</Link>
          </div>

          {/* Botão Mobile (Hamburger/Close) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-[#136190] focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
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
        <div className="px-2 pt-2 pb-3 space-y-1 bg-[#136190] shadow-xl">
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
          <Link 
            to="/about" 
            onClick={handleLinkClick} 
            className={`block ${mobileLinkClasses} text-white`}
          >
            Sobre
          </Link>
          <Link 
            to="/about" 
            onClick={handleLinkClick} 
            className={`block ${mobileLinkClasses} bg-[#FFA500] text-gray-900 font-bold hover:bg-[#ffb020]`}
          >
            Contato
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default MenuBar;
