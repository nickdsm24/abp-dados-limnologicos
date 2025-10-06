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

export default function FurnasMenu() {
    const menuItems = [
        { label: "Visualizar Tabelas", path: "/furnas-table", icon: <TableIcon /> },
        { label: "Gráficos e Análises", path: "/furnas-graph", icon: <ChartIcon /> },
        { label: "Mapas Interativos", path: "/furnas-map", icon: <MapIcon /> }
    ];

    const summaryText = `O aumento na emissão de gases de efeito estufa representa um desafio ambiental global, com impactos mais severos previstos para os países em desenvolvimento, como o Brasil. Em conformidade com a Convenção do Clima da ONU, o país necessita inventariar suas fontes de emissão para criar estratégias de mitigação. Recentemente, a comunidade científica passou a investigar o papel dos reservatórios hidrelétricos como potenciais emissores desses gases. Este projeto, portanto, é a fase inicial para a elaboração do balanço de carbono de FURNAS. O objetivo é comparar as emissões dos reservatórios com as da geração termelétrica e contrastá-las com o carbono fixado pelos projetos de reflorestamento da empresa. A iniciativa, financiada pela lei 9.991/2000 e regulada pela ANEEL, é fundamental para que o setor elétrico nacional se qualifique no mercado de Reduções Certificadas de Emissão, buscando uma geração de energia mais sustentável e alinhada às metas climáticas globais, garantindo a transparência e o rigor científico em seus procedimentos.`;
    
    return (
        <div className="w-full my-8 bg-[#F3F7FB] p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200">
            
            {/* Seção de Informações do Projeto */}
            <div className="text-center mb-10">
                <img 
                    src="/furnas.jpg" 
                    alt="Logo de Furnas" 
                    className="mx-auto h-24 w-auto object-contain mb-6 drop-shadow-md"
                />
                <div className="bg-amber-100 border-l-4 border-amber-400 text-gray-800 p-6 rounded-lg shadow-inner">
                    <p className="text-base text-left leading-relaxed">{summaryText}</p>
                </div>
            </div>

            {/* Seção de Navegação (Botões) */}
            <nav aria-label="Menu de Navegação Furnas">
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
