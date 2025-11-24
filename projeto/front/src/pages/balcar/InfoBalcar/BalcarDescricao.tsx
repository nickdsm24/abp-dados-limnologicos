function BalcarDescricao() {
  return (
    <div className="bg-[#f6fff8] min-h-screen p-6 font-sans">
      <div className="max-w-5xl mx-auto">

        {/* ============================= */}
        {/* BOX PRINCIPAL (somente a descrição) */}
        {/* ============================= */}
        <div className="bg-[#daf5e1] p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-3 text-[#107B0B]">
            Descrição da Base de Dados
          </h2>

          <p className="mb-0 text-gray-800 leading-relaxed">
            A base de dados é formada pelos resultados de <strong>79 campanhas</strong> 
            realizadas pelas instituições participantes nos diferentes reservatórios. 
            As datas compreendem o período de início e fim de cada campanha e podem 
            variar entre as instituições. Os dados fornecidos por <strong>Furnas</strong> 
            não são provenientes de campanhas.
          </p>
        </div>

        {/* Espaço entre a caixa e as campanhas */}
        <div className="h-8"></div>

        {/* ============================= */}
        {/* CAMPANHAS POR RESERVATÓRIO */}
        {/* ============================= */}

        {/* ------ MANSO ------ */}
        <h3 className="text-lg font-bold text-[#107B0B] mt-6 mb-2">
          Campanhas em Manso
        </h3>

        <section className="mb-6 text-gray-800">
          <h4 className="font-semibold">IIE</h4>
          <ul className="ml-4 list-disc">
            <li>Primeira: 25/11/2003 a 26/11/2003</li>
            <li>Segunda: 22/3/2004 a 24/3/2004</li>
            <li>Terceira: 19/7/2004 a 21/7/2004</li>
            <li>Quarta: 27/11/2006 a 29/11/2006</li>
            <li>Quinta: 19/3/2007 a 22/3/2007</li>
            <li>Sexta: 16/7/2007 a 18/7/2007</li>
          </ul>

          <h4 className="font-semibold mt-4">INPE</h4>
          <ul className="ml-4 list-disc">
            <li>Primeira: 22/3/2004 a 25/3/2004</li>
          </ul>

          <h4 className="font-semibold mt-4">UFJF</h4>
          <ul className="ml-4 list-disc">
            <li>Primeira: 25/11/2003 a 25/11/2003</li>
            <li>Segunda: 24/3/2004 a 25/3/2004</li>
            <li>Terceira: 19/7/2004 a 22/7/2004</li>
          </ul>

          <h4 className="font-semibold mt-4">UFRJ</h4>
          <ul className="ml-4 list-disc">
            <li>Primeira: 24/11/2003 a 27/11/2003</li>
            <li>Segunda: 22/3/2004 a 25/3/2004</li>
            <li>Terceira: 18/7/2004 a 25/7/2004</li>
            <li>Quarta: 27/11/2006 a 1/12/2006</li>
            <li>Quinta: 19/3/2007 a 22/3/2007</li>
            <li>Sexta: 16/7/2007 a 19/7/2007</li>
          </ul>
        </section>

        {/* ------ MASCARENHAS DE MORAES ------ */}
        <h3 className="text-lg font-bold text-[#107B0B] mt-6 mb-2">
          Campanhas em Mascarenhas de Moraes
        </h3>

        <section className="mb-6 text-gray-800">
          <h4 className="font-semibold">IIE</h4>
          <ul className="ml-4 list-disc">
            <li>Primeira: 14/11/2005 a 17/11/2005</li>
            <li>Segunda: 29/3/2006 a 1/4/2006</li>
            <li>Terceira: 6/8/2006 a 10/8/2006</li>
          </ul>

          <h4 className="font-semibold mt-4">UFJF</h4>
          <ul className="ml-4 list-disc">
            <li>Primeira: 17/11/2005 a 21/11/2005</li>
            <li>Segunda: 7/4/2006 a 12/4/2006</li>
            <li>Terceira: 4/8/2006 a 8/8/2006</li>
          </ul>

          <h4 className="font-semibold mt-4">UFRJ</h4>
          <ul className="ml-4 list-disc">
            <li>Primeira: 17/11/2005 a 21/11/2005</li>
            <li>Segunda: 28/3/2006 a 1/4/2006</li>
            <li>Terceira: 7/8/2006 a 10/8/2006</li>
          </ul>
        </section>

        {/* ------ SERRA DA MESA ------ */}
        <h3 className="text-lg font-bold text-[#107B0B] mt-6 mb-2">
          Campanhas em Serra da Mesa
        </h3>

        <section className="mb-6 text-gray-800">
          <h4 className="font-semibold">IIE</h4>
          <ul className="ml-4 list-disc">
            <li>Primeira: 18/11/2003 a 21/11/2003</li>
            <li>Segunda: 15/3/2004 a 19/3/2004</li>
            <li>Terceira: 12/7/2004 a 16/7/2004</li>
          </ul>

          <h4 className="font-semibold mt-4">INPE</h4>
          <ul className="ml-4 list-disc">
            <li>Primeira: 16/3/2004 a 18/3/2004</li>
          </ul>

          <h4 className="font-semibold mt-4">UFJF</h4>
          <ul className="ml-4 list-disc">
            <li>Primeira: 18/11/2003 a 18/11/2003</li>
            <li>Segunda: 18/3/2004 a 18/3/2004</li>
            <li>Terceira: 12/7/2004 a 14/7/2004</li>
          </ul>

          <h4 className="font-semibold mt-4">UFRJ</h4>
          <ul className="ml-4 list-disc">
            <li>Primeira: 17/11/2003 a 21/11/2003</li>
            <li>Segunda: 15/3/2004 a 19/3/2004</li>
            <li>Terceira: 12/7/2004 a 17/7/2004</li>
          </ul>
        </section>

        {/* ====================================== */}
        {/* DADOS POR INSTITUIÇÃO (Fora da caixa) */}
        {/* ====================================== */}

        {/* ------ FURNAS ------ */}
        <h3 className="text-lg font-bold text-[#107B0B] mt-6 mb-2">Furnas</h3>
        <section className="mb-6 text-gray-800">
          <h4 className="font-semibold">Dados de precipitação</h4>
          <p>Quantidade de coletas: 20683</p>
          <p>Parâmetro: Precipitação (medida diária)</p>

          <h4 className="font-semibold mt-4">Nível do reservatório</h4>
          <p>Quantidade de coletas: 8470</p>
          <p>Parâmetros coletados: Nível, Volume útil, Percentual do volume útil, Geração, Vazões, Produtividade etc.</p>
        </section>

        {/* ------ IIE ------ */}
        <h3 className="text-lg font-bold text-[#107B0B] mt-6 mb-2">IIE</h3>
        <section className="mb-6 text-gray-800">
          <p className="mb-2 font-semibold">Água e matéria orgânica no sedimento</p>
          <p>Coletas: 1283 — Campanhas: 27 — Locais: 243</p>

          <p className="mt-4 mb-2 font-semibold">Concentração de gás na água</p>
          <p>Coletas: 1008 — Campanhas: 27 — Locais: 244</p>

          <p className="mt-4 mb-2 font-semibold">Concentração de gás no sedimento</p>
          <p>Coletas: 3548 — Campanhas: 27 — Locais: 243</p>

          <p className="mt-4 mb-2 font-semibold">Dados Horiba</p>
          <p>Coletas: 21799 — Campanhas: 27</p>

          <p className="mt-4 mb-2 font-semibold">Fluxo difusivo</p>
          <p>Coletas: 324 — Campanhas: 27</p>

          <p className="mt-4 mb-2 font-semibold">Íons na água intersticial</p>
          <p>Coletas: 1069 — Campanhas: 27</p>

          <p className="mt-4 mb-2 font-semibold">Nutrientes no sedimento</p>
          <p>Coletas: 1233 — Campanhas: 27</p>

          <p className="mt-4 mb-2 font-semibold">Variáveis físicas e químicas da água</p>
          <p>Coletas: 446 — Campanhas: 27</p>
        </section>

        {/* ------ INPE ------ */}
        <h3 className="text-lg font-bold text-[#107B0B] mt-6 mb-2">INPE</h3>
        <section className="mb-6 text-gray-800">
          <p className="font-semibold mb-2">Fluxo de bolhas</p>
          <p>Coletas: 297 — Campanhas: 2 — Locais: 1</p>

          <p className="font-semibold mb-2 mt-4">Fluxo difusivo</p>
          <p>Coletas: 380 — Campanhas: 4 — Locais: 3</p>
        </section>

        {/* ------ UFJF ------ */}
        <h3 className="text-lg font-bold text-[#107B0B] mt-6 mb-2">UFJF</h3>
        <section className="mb-6 text-gray-800">
          <p className="font-semibold mb-1">Abióticos na coluna d’água — 120 coletas</p>
          <p className="font-semibold mb-1 mt-3">Abióticos na superfície — 238 coletas</p>
          <p className="font-semibold mb-1 mt-3">Bióticos na coluna d’água — 120 coletas</p>
          <p className="font-semibold mb-1 mt-3">Bióticos na superfície — 239 coletas</p>
          <p className="font-semibold mb-1 mt-3">Fluxos de carbono — 19 coletas</p>
          <p className="font-semibold mb-1 mt-3">Medidas de campo — 131 coletas</p>
        </section>

        {/* ------ UFRJ ------ */}
        <h3 className="text-lg font-bold text-[#107B0B] mb-2">UFRJ</h3>
        <section className="mb-6 text-gray-800">
          <p className="font-semibold mb-1">Bolhas — 396 coletas</p>
          <p className="font-semibold mb-1 mt-3">Câmara solo — 82 coletas</p>
          <p className="font-semibold mb-1 mt-3">Carbono Total no sedimento — 301 coletas</p>
          <p className="font-semibold mb-1 mt-3">DC/DOC/POC/TOC/DIC/TC — 315 coletas</p>
          <p className="font-semibold mb-1 mt-3">Difusão — 654 coletas</p>
          <p className="font-semibold mb-1 mt-3">Dupla dessorção — 535 coletas</p>
          <p className="font-semibold mb-1 mt-3">Gases em bolhas — 20 coletas</p>
          <p className="font-semibold mb-1 mt-3">Parâmetros físicos e químicos — 1547 coletas</p>
        </section>

      </div>
    </div>
  );
}

export default BalcarDescricao;
