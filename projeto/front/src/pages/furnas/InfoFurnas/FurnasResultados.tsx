import React from "react";
import { Link } from "react-router-dom";

const FurnasResultados: React.FC = () => {
  return (
    <div className="font-sans bg-[#f3f8fb] text-gray-800">
      {/* 🔷 Header */}
      <header className="bg-[#0077b6] text-white py-8 px-6">
        <h1 className="text-2xl font-semibold">Balanço de Carbono</h1>
        <h2 className="text-lg mt-1">Reservatórios de Furnas</h2>
        <p className="text-sm mt-2 opacity-90">
          Resultados esperados e benefícios gerados pelo projeto
        </p>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-10">
        {/* 🔙 Botão de retorno */}
        <div className="mb-4">
          <Link
            to="/furnas-info"
            className="inline-block text-[#0077b6] text-sm font-medium hover:underline"
          >
            ← Voltar para o menu principal
          </Link>
        </div>

        {/* 🔹 Resultados Esperados */}
        <section className="bg-white rounded-md shadow p-6 border-l-4 border-[#0077b6]">
          <h3 className="text-xl font-semibold text-[#0077b6] mb-4">
            Resultados Esperados do Projeto
          </h3>

          <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
            <li>
              Padronização de metodologia para o cálculo das emissões de gases
              de efeito estufa em reservatórios;
            </li>
            <li>
              Modelo de emissão de longo prazo de gases de efeito estufa por
              reservatórios;
            </li>
            <li>
              Artigos em revistas especializadas e publicação de livro, o qual
              incluirá uma versão direcionada à comunidade científica
              internacional;
            </li>
            <li>Modelos ecohidrodinâmicos aplicados;</li>
            <li>Disponibilização de modelos e dados na internet;</li>
            <li>
              Desenvolvimento de técnicas computacionais de análise de sinais
              ambientais;
            </li>
            <li>Incentivo da inovação tecnológica no país;</li>
            <li>
              Capacitação de recursos humanos com atividades acadêmicas de
              pesquisa.
            </li>
          </ul>
        </section>

        {/* 🔹 Benefícios Gerados */}
        <section className="bg-[#e9f2f9] rounded-md shadow p-6 border-l-4 border-[#00a6d6]">
          <h3 className="text-xl font-semibold text-[#0077b6] mb-4">
            Benefícios Gerados
          </h3>

          <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
            <li>Fortalecimento dos parceiros como Centros de Excelência;</li>
            <li>
              Produção de conhecimento relevante ao estado-da-arte (Subsídios à
              realização de 5 dissertações de mestrado e 6 teses de doutorado,
              além de cursos de especialização);
            </li>
            <li>
              Participação em conferências, seminários e congressos e
              publicações em anais e revistas especializadas;
            </li>
            <li>
              Resultados irão compor o balanço de carbono de FURNAS, o qual
              permitirá o aprimoramento de seu planejamento ambiental, baseado
              no desenvolvimento sustentável.
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default FurnasResultados;
