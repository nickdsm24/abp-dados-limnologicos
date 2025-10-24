import { Link } from 'react-router-dom';

// Ícones SVG embutidos para evitar dependências externas
const TableIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><path d="M12 3v18M4 9h16M4 15h16M20 3H4"/></svg>
);
const ChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><path d="M21.21 15.89A10 10 0 1 1 8.11 2.99"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
);
const MapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
);


export default function BalcarMenu() {
    const menuItems = [
        { label: "Visualizar Tabelas", path: "/balcar-table", icon: <TableIcon /> },
        { label: "Gráficos e Análises", path: "/balcar-graph", icon: <ChartIcon /> },
        { label: "Mapas Interativos", path: "/balcar-map", icon: <MapIcon /> }
    ];

    const summaryText = `Este portal é a interface de acesso aos dados do projeto "Balanço de Carbono nos Reservatórios de FURNAS", que se baseia em coletas de 79 campanhas distintas. Equipes de instituições renomadas como IIE, INPE, UFJF e UFRJ/COPPE colaboraram para obter parâmetros nas interfaces água-sedimento, coluna d’água e água-atmosfera. Os principais objetivos eram determinar as emissões de gases de efeito estufa (CO₂, CH₄, N₂O), compreender o ciclo do carbono nos reservatórios e identificar os fatores ambientais, morfológicos e operacionais que influenciam essas emissões. Além disso, o projeto buscou estabelecer o padrão de emissão pré-reservatório e desenvolver um modelo espacial e temporal para reservatórios em ambientes de cerrado. A plataforma oferece ferramentas poderosas para os usuários, permitindo realizar consultas personalizadas para download dos dados, criar tabelas dinâmicas para análises aprofundadas e visualizar a distribuição espacial das coletas em mapas interativos, democratizando o acesso à informação científica.`;

    return (
        <div className="w-full my-8 bg-[#F3F7FB] p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200">
            
            {/* Seção de Informações do Projeto */}
            <div className="text-center mb-10">
                <img 
                    src="/balcar.png" 
                    alt="Logo do Projeto Balcar" 
                    className="mx-auto h-24 w-auto object-contain mb-6 drop-shadow-md"
                />
                <div className="bg-amber-100 border-l-4 border-amber-400 text-gray-800 p-6 rounded-lg shadow-inner">
                    <p className="text-base text-left leading-relaxed">{summaryText}</p>
                </div>
            </div>

            {/* Seção de Navegação (Botões) */}
            <nav aria-label="Menu de Navegação Balcar">
                <ul className="flex flex-col sm:flex-row items-center justify-around gap-4 sm:gap-6">
                    {menuItems.map((item) => (
                        <li key={item.path} className="w-full sm:w-auto flex-1">
                            <Link
                                to={item.path}
                                className="flex items-center justify-center w-full text-center px-6 py-4 text-lg font-semibold text-white bg-[#1777af] rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1777af] transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}