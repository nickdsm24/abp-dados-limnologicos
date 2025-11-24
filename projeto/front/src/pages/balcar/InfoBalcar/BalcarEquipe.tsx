import React from "react";

function BalcarEquipe() {
  return (
    <div className="bg-[#f6fff8] min-h-screen font-sans">

      {/* Banner */}
      <section className="bg-[#107B0B] text-white py-8 px-6">
        <h1 className="text-3xl font-semibold mt-1">Equipe</h1>
        <p className="text-lg mt-2">
          Projeto Balanço de Carbono nos Reservatórios de FURNAS Centrais Elétricas S.A.
        </p>
      </section>

      {/* Caixa principal */}
      <div className="bg-white p-6 max-w-5xl mx-auto mt-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-3">Coordenação Geral</h2>
        <p className="mb-2">André Carlos Prates Cimbleris</p>
      </div>

      {/* Seções */}
      <div className="max-w-5xl mx-auto mt-6 space-y-6">

        {/* Coordenação por Instituição */}
        <div className="bg-white p-6 rounded shadow border border-gray-200">
          <h3 className="text-lg font-bold mb-3">Coordenação por Instituição</h3>

          <ul className="list-disc ml-6 space-y-1">
            <li><strong>IIE:</strong> Donato Seiji Abe</li>
            <li><strong>INPE:</strong> José Luiz Stech</li>
            <li><strong>UFJF:</strong> Fábio Roland</li>
            <li><strong>UFRJ/COPPE:</strong> Marco Aurélio dos Santos</li>
          </ul>
        </div>

        {/* Responsáveis pelas Coletas e Análises */}
        <div className="bg-white p-6 rounded shadow border border-gray-200">
          <h3 className="text-lg font-bold mb-3">Responsáveis pelas Coletas e Análises</h3>

          <ul className="list-disc ml-6 space-y-1">
            <li>Arcilan Trevenzoli Assireu (INPE)</li>
            <li>Bohdan Matvienko Sikar (UFRJ/COPPE)</li>
            <li>Corina Verónica Sidagis Galli (IIE)</li>
            <li>Ednaldo Oliveira dos Santos (UFRJ/COPPE)</li>
            <li>Elizabeth Matvienko Sikar (UFRJ/COPPE)</li>
            <li>Felipe Siqueira Pacheco (UFJF)</li>
            <li>Ivan Bergier Tavares de Lima (INPE)</li>
            <li>Luciano Marani (INPE)</li>
            <li>Nathan Oliveira Barros (UFJF)</li>
            <li>Plínio Carlos Alvalá (INPE)</li>
          </ul>
        </div>

        {/* Gerente de Rede */}
        <div className="bg-white p-6 rounded shadow border border-gray-200">
          <h3 className="text-lg font-bold mb-3">Gerente de Rede do Portal</h3>
          <p className="text-gray-700">João Benedito Diehl</p>
        </div>

        {/* Web e Banco de Dados */}
        <div className="bg-white p-6 rounded shadow border border-gray-200">
          <h3 className="text-lg font-bold mb-3">Web e Banco de Dados</h3>
          <p className="text-gray-700">
            Arley Ferreira de Souza —{" "}
            <a
              href="mailto:arley@dpi.inpe.br"
              className="text-blue-600 underline hover:text-blue-800"
            >
              arley@dpi.inpe.br
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}

export default BalcarEquipe;
