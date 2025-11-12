import React from "react";

const FurnasMetodologia: React.FC = () => {
  return (
    <div className="font-sans bg-[#f3f8fb] text-gray-800 scroll-smooth">
      {/* 🔹 Cabeçalho principal */}
      <header className="bg-[#0077b6] text-white py-8 px-6 shadow-md">
        <h1 className="text-2xl font-semibold">Balanço de Carbono</h1>
        <h2 className="text-lg mt-1">Reservatórios de Furnas</h2>
        <p className="text-sm mt-2 opacity-90">
          Projeto de pesquisa dedicado ao monitoramento e análise do balanço de
          carbono nos reservatórios hidrelétricos de Furnas
        </p>
      </header>

      {/* 🔸 Conteúdo principal */}
      <main className="max-w-5xl mx-auto p-6 space-y-10">
        {/* Título da página */}
        <section className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-2xl font-semibold text-[#0077b6] mb-4">
            Metodologia
          </h2>
          <p className="text-gray-700 leading-relaxed">
            O projeto será composto por quatro subprojetos a serem desenvolvidos
            em paralelo:
          </p>
        </section>

        {/* 1️⃣ Aquisição de dados */}
        <section className="bg-[#e9f7ef] border-l-4 border-green-600 rounded-md p-6">
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            1. Aquisição de dados micrometeorológicos e limnológicos em tempo real
          </h3>
          <p className="text-sm leading-relaxed mb-3">
            O Sistema Integrado de Monitoração Ambiental (SIMA) é um conjunto de
            hardware e software projetado para a coleta e monitoramento em tempo
            real de sistemas hidrológicos. Ele utiliza plataformas autônomas
            fundeadas com sensores, painéis solares, antenas e eletrônica de
            armazenamento, transmitindo dados via satélite em tempo quase real.
          </p>
          <p className="text-sm leading-relaxed mb-3">
            A seleção das variáveis ambientais considerou sua relevância para a
            caracterização dos ambientes aquáticos, como indicadores de impacto
            ambiental e no processo de emissão de gases de efeito estufa.
          </p>

          <div className="bg-white border border-green-200 rounded-md p-4 mt-4">
            <h4 className="font-semibold text-green-700 mb-2">
              Variáveis monitoradas
            </h4>
            <ul className="list-disc pl-6 text-sm space-y-1">
              <li>
                <strong>Água:</strong> temperatura, pH, turbidez, oxigênio e CO₂
                dissolvidos, condutividade, nitrato, amônia e profundidade relativa.
              </li>
              <li>
                <strong>Atmosfera:</strong> temperatura do ar, pressão
                atmosférica, radiação solar, vento, corrente e profundidade relativa.
              </li>
            </ul>
          </div>

          <p className="text-sm leading-relaxed mt-4">
            O INPE trabalha em parceria com a Neuron Engenharia na integração e
            testes do sistema. Três plataformas serão construídas, com dois kits
            sobressalentes para manutenção. O transporte e instalação exigem
            logística específica devido ao peso e à necessidade de embarcação.
          </p>

          <p className="text-sm leading-relaxed mt-4">
            As plataformas serão estrategicamente distribuídas, sendo uma
            permanente na UHE Furnas e outras duas rotativas entre reservatórios.
            A operação segue um cronograma de 2003 a 2008, com campanhas anuais
            de instalação, manutenção e calibração dos sensores.
          </p>
        </section>

        {/* 2️⃣ Estimativa de Fluxos de Gases */}
        <section className="bg-[#fff7e6] border-l-4 border-yellow-500 rounded-md p-6">
          <h3 className="text-xl font-semibold text-yellow-700 mb-2">
            2. Estimativa de Fluxos de CO₂, CH₄ e N₂O na interface água-atmosfera e coluna d’água
          </h3>
          <p className="text-sm leading-relaxed mb-3">
            Diferente das termelétricas, onde o CO₂ é resultado da combustão de
            combustíveis fósseis, nos reservatórios de hidrelétricas os gases de
            efeito estufa são formados pela decomposição bacteriana do material
            orgânico. O programa de amostragem será ajustado por tipo de região e
            profundidade, utilizando funis de captação de bolhas e câmaras de
            difusão.
          </p>

          <ul className="list-disc pl-6 text-sm mb-3">
            <li>Regiões próximas à barragem (profundas e previamente desmatadas)</li>
            <li>Regiões abrigadas com vegetação remanescente (rasas e biológicas)</li>
            <li>Regiões opostas para comparação de padrões de emissão</li>
            <li>Regiões à montante, com presença de macrófitas aquáticas</li>
            <li>Regiões à jusante, para avaliar água turbinada</li>
          </ul>

          <div className="bg-white border border-yellow-200 rounded-md p-4">
            <p className="text-sm leading-relaxed">
              As amostras serão analisadas em laboratório por cromatografia gasosa.
              Serão quantificados metano, dióxido de carbono, oxigênio e óxido
              nitroso, com cálculo das taxas de emissão (kg/km²/dia) e medições
              in situ com analisador portátil.
            </p>
          </div>
        </section>

        {/* 3️⃣ Ciclo do Carbono */}
        <section className="bg-[#e6f0ff] border-l-4 border-blue-600 rounded-md p-6">
          <h3 className="text-xl font-semibold text-blue-800 mb-2">
            3. Ciclo do Carbono na coluna d’água
          </h3>
          <p className="text-sm leading-relaxed mb-3">
            O carbono nos ambientes aquáticos se distribui em formas inorgânicas
            e orgânicas dissolvidas, com pequena fração particulada. A relação
            entre respiração e produção primária determina o balanço entre
            sistemas autotróficos (absorvedores) e heterotróficos (exportadores).
          </p>

          <div className="bg-white border border-blue-200 rounded-md p-4 mb-4">
            <h4 className="font-semibold text-blue-700 mb-2">
              Dados a serem obtidos
            </h4>
            <ul className="list-disc pl-6 text-sm space-y-1">
              <li>Estoques biológicos de carbono (fitoplâncton e bactérias)</li>
              <li>Produção primária e excreção de carbono radioativo (¹⁴C)</li>
              <li>Produção bacteriana via incorporação de leucina tritiada (³H)</li>
              <li>Respiração planctônica com Micro-Oxymax</li>
              <li>
                Parâmetros ambientais: DIC, DOC, POC, N, P, clorofila-a, isótopos
                de C e N
              </li>
              <li>
                Quantificação de material alóctone via análise de tributários e
                cargas orgânicas
              </li>
            </ul>
          </div>

          <p className="text-sm leading-relaxed">
            O conjunto desses dados permitirá construir um modelo ecológico do
            ciclo do carbono nos reservatórios, relacionando produção, respiração
            e variáveis limnológicas.
          </p>
        </section>

        {/* 4️⃣ Fluxos na interface água-sedimento */}
        <section className="bg-[#fdecef] border-l-4 border-red-500 rounded-md p-6">
          <h3 className="text-xl font-semibold text-red-700 mb-2">
            4. Estimativa de Fluxos de CO₂, CH₄ e N₂ na interface água-sedimento
          </h3>
          <p className="text-sm leading-relaxed mb-3">
            A decomposição da matéria orgânica nos sedimentos anóxicos é fonte
            significativa de gases de efeito estufa. Serão coletadas amostras de
            sedimentos e analisadas em laboratório para quantificação de CO₂,
            CH₄, N₂, O₂ e Ar, utilizando cromatografia gasosa.
          </p>

          <p className="text-sm leading-relaxed mb-2">
            As medidas de O₂ e Ar servem como indicadores de contaminação
            atmosférica e para refinar as estimativas de N₂. Serão avaliados os
            fluxos difusivos desses gases, seu potencial de desoxigenação das
            águas hipolimnéticas e o fluxo final para a atmosfera.
          </p>

          <p className="text-sm leading-relaxed">
            Também será analisada a composição isotópica do carbono e nitrogênio
            presentes nos sedimentos, aprofundando a compreensão sobre os
            processos biogeoquímicos do sistema.
          </p>
        </section>
      </main>
    </div>
  );
};

export default FurnasMetodologia;
