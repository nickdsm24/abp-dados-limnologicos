import { motion } from 'framer-motion';

export default function SimaInfo() {
  return (
    <div className="bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-blue-900 text-white py-6 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-wide">SIMA</h1>
          <nav className="space-x-6 hidden md:flex">
            <a href="#sobre" className="hover:text-blue-300">Sobre</a>
            <a href="#estrutura" className="hover:text-blue-300">Estrutura</a>
            <a href="#motivacao" className="hover:text-blue-300">Motivação</a>
            <a href="#funcionamento" className="hover:text-blue-300">Funcionamento</a>
            <a href="#dados" className="hover:text-blue-300">Dados</a>
            <a href="#historia" className="hover:text-blue-300">História</a>
            <a href="#problemas" className="hover:text-blue-300">Problemas</a>
            <a href="#apoio" className="hover:text-blue-300">Apoio</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-800 to-blue-600 text-white py-20 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1 }}
          className="text-4xl font-semibold mb-4">
          Sistema Integrado de Monitoramento Ambiental
        </motion.h2>
        <p className="text-lg max-w-2xl mx-auto">
          Coleta e monitoramento em tempo real de processos da hidrosfera.
        </p>
      </section>

      {/* Sobre */}
      <section id="sobre" className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-bold text-blue-800 mb-4">Sobre o SIMA</h3>
        <p>
          O SIMA (Sistema Integrado de Monitoramento Ambiental) é um conjunto de hardware e software desenhado para a coleta de dados e o monitoramento em tempo real de processos da hidrosfera. Para a coleta dos dados, o SIMA faz uso de um sistema autônomo fundeado, onde são instalados sensores, eletrônica de armazenamento, bateria e antena de transmissão. Os dados coletados em intervalo de tempo pré-programado são transmitidos via satélite e também armazenados na estação de coleta, sendo que os dados armazenados são aqueles obtidos com maior frequência. Este portal permite o acesso aos dados transmitidos por satélite poucas horas após a coleta. A associação destas componentes fornece uma poderosa ferramenta que pode ser empregada no gerenciamento e controle ambiental de recursos hídricos.
        </p>
      </section>

      {/* Estrutura */}
      <section id="estrutura" className="bg-white max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-bold text-blue-800 mb-4">Estrutura do SIMA</h3>
        <p>
          O SIMA é formado por uma plataforma que em alguns modelos pode ser uma bóia toroidal ou uma estrutura maior. No centro da plataforma existe uma torre onde são afixados os painéis solares, sensores meteorológicos e antena. No vão central um compartimento abriga a eletrônica do sistema, baterias e transmissor de satélite. Os sensores submersos são conectados à eletrônica por cabos.
        </p>
      </section>

      {/* Motivação */}
      <section id="motivacao" className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-bold text-blue-800 mb-4">Motivação do SIMA</h3>
        <ul className="list-disc ml-6 space-y-2">
          <li>Sistemas aquáticos são muito dinâmicos, podendo sofrer mudanças significativas em questão de horas;</li>
          <li>Complexa e cara logística necessária para amostrar adequadamente os sistemas aquáticos em estudo;</li>
          <li>Necessidade de dados em tempo real para a tomada de decisões.</li>
        </ul>
      </section>

      {/* Modo de Funcionamento */}
      <section id="funcionamento" className="bg-white max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-bold text-blue-800 mb-4">Modo de Funcionamento</h3>
        <ul className="list-disc ml-6 space-y-2">
          <li>Coleta e transmissão dos dados: circuitos analógicos e digitais comandam sensores e transmissor de satélite;</li>
          <li>Amostragem: a cada hora cheia um novo conjunto de dados é armazenado em memória, substituindo os mais antigos;</li>
          <li>Esquema de transmissão: a cada 90 segundos, um dos buffers é transmitido, independente da disponibilidade do satélite;</li>
          <li>Recepção: unidades do INPE recebem, filtram e processam os dados, enviando-os para a DSR (São José dos Campos - SP);</li>
          <li>Distribuição: este portal permite consulta e visualização dos dados;</li>
          <li>Armazenamento interno: alguns SIMAs armazenam coletas locais para download posterior a cada 10 minutos.</li>
        </ul>
      </section>

      {/* Dados Coletados */}
      <section id="dados" className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-bold text-blue-800 mb-4">Dados Coletados</h3>
        <p>
          O SIMA coleta variáveis ambientais a partir de sensores colocados acima da linha d’água (temperatura do ar, pressão atmosférica, ventos, radiação solar) e abaixo da linha d’água (amônia, nitrato, clorofila, condutividade, corrente, oxigênio dissolvido, pH e temperatura em diferentes profundidades).
        </p>
      </section>

      {/* História */}
      <section id="historia" className="bg-white max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-bold text-blue-800 mb-4">História</h3>
        <p>
          O SIMA foi desenvolvido em parceria entre a Universidade do Vale do Paraíba e o INPE. A partir de 1995, o projeto foi transferido para a Neuron Engenharia Ltda. Em parceria com a Diretoria de Hidrografia e Navegação (DHN), a Neuron construiu um protótipo que ficou fundeado no litoral do Rio de Janeiro por um ano. Os dados foram disponibilizados pelo Programa Nacional de Bóia e comparados com dados in situ, confirmando o bom desempenho do sistema.
        </p>
      </section>

      {/* Problemas */}
      <section id="problemas" className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-bold text-blue-800 mb-4">Problemas</h3>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Sensores:</strong> alguns ambientes aquáticos degradam rapidamente os sensores, invalidando dados.</li>
          <li><strong>Satélite:</strong> o SIMA realiza 24 leituras por dia, mas nem todas são recebidas devido à posição dos satélites.</li>
        </ul>
      </section>

      {/* Apoio */}
      <section id="apoio" className="bg-white max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-bold text-blue-800 mb-4">Apoio</h3>
        <ul className="list-disc ml-6 space-y-2">
          <li>CEPEL - Centro de Pesquisas de Energia Elétrica</li>
          <li>Chesf - Companhia Hidro Elétrica do São Francisco</li>
          <li>CNPq - Conselho Nacional de Desenvolvimento Científico e Tecnológico</li>
          <li>Eletronorte - Centrais Elétricas do Norte do Brasil</li>
          <li>FAPESP - Fundação de Amparo à Pesquisa do Estado de São Paulo</li>
          <li>Furnas Centrais Elétricas</li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-6 text-center mt-10">
        <p>© 2025 SIMA - Sistema Integrado de Monitoramento Ambiental</p>
      </footer>
    </div>
  );
}
