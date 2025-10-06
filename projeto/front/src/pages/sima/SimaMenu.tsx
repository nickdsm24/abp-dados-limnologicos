// src/components/SimaMenu.tsx

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

export default function SimaMenu() {
    const menuItems = [
        { label: "Visualizar Tabelas", path: "/sima-table", icon: <TableIcon /> },
        { label: "Gráficos e Análises", path: "/sima-graph", icon: <ChartIcon /> },
        { label: "Mapas Interativos", path: "/sima-map", icon: <MapIcon /> }
    ];

    const summaryText = `O SIMA (Sistema Integrado de Monitoramento Ambiental) é uma solução tecnológica avançada, composta por hardware e software, projetada para a coleta e monitoramento em tempo real de processos na hidrosfera. Utilizando um sistema autônomo fundeado com sensores, baterias e transmissão via satélite, o SIMA coleta uma vasta gama de variáveis ambientais. Acima da água, mede temperatura do ar, pressão, ventos e radiação solar, enquanto abaixo da superfície, analisa parâmetros como amônia, nitrato, clorofila, oxigênio dissolvido, pH e correntes. Os dados são enviados por satélite e disponibilizados neste portal poucas horas após a coleta, fornecendo uma ferramenta poderosa para o gerenciamento e controle ambiental de recursos hídricos. Desenvolvido originalmente em parceria entre a UNIVAP e o INPE, e posteriormente aprimorado pela Neuron Engenharia, o sistema já foi validado em campo, confirmando seu excelente desempenho e confiabilidade para estudos oceanográficos e ambientais.`;

    return (
        <div className="w-full my-8 bg-[#F3F7FB] p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200">
            
            {/* Seção de Informações do Projeto */}
            <div className="text-center mb-10">
                <img 
                    src="/sima.png" 
                    alt="Logo do Projeto Sima" 
                    className="mx-auto h-24 w-auto object-contain mb-6 drop-shadow-md"
                />
                <div className="bg-amber-100 border-l-4 border-amber-400 text-gray-800 p-6 rounded-lg shadow-inner">
                    <p className="text-base text-left leading-relaxed">{summaryText}</p>
                </div>
            </div>

            {/* Seção de Navegação (Botões) */}
            <nav aria-label="Menu de Navegação Sima">
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
