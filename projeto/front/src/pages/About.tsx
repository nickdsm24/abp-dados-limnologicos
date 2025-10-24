import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function About() {
  const [openSection, setOpenSection] = useState<null | string>("introducao");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-[#F3F7FB] p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <span className="text-blue-500 text-4xl">💧</span>
          </div>
          <h1 className="text-2xl font-bold text-blue-600">Dados Limnológicos</h1>
        </div>

        {/* Seção: O que são Dados Limnológicos */}
        <section className="mb-4">
          <button
            onClick={() => toggleSection("introducao")}
            className="flex items-center gap-2 font-bold text-lg text-left w-full"
          >
            <ChevronDown
              className={`text-blue-600 transition-transform ${
                openSection === "introducao" ? "rotate-180" : ""
              }`}
              size={20}
            />
            O que são Dados Limnológicos?
          </button>
          {openSection === "introducao" && (
            <div className="mt-3 text-gray-700 leading-relaxed">
              <p>
                Os dados limnológicos são informações coletadas sobre ecossistemas de água doce, como
                rios, lagos e reservatórios. Eles ajudam a entender a qualidade da água, a saúde dos
                ecossistemas e os impactos de atividades humanas e fenômenos naturais.
              </p>
              <p className="mt-2">
                A análise desses dados permite identificar problemas como eutrofização, contaminação
                por poluentes e alterações causadas por mudanças climáticas, auxiliando na
                conservação e no uso sustentável da água.
              </p>
            </div>
          )}
        </section>

        {/* Seção: Variáveis Físicas */}
        <section className="mb-4">
          <button
            onClick={() => toggleSection("fisicas")}
            className="flex items-center gap-2 font-bold text-lg text-left w-full"
          >
            <ChevronDown
              className={`text-blue-600 transition-transform ${
                openSection === "fisicas" ? "rotate-180" : ""
              }`}
              size={20}
            />
            Variáveis Físicas
          </button>
          {openSection === "fisicas" && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl shadow-sm text-center">
                <h3 className="font-semibold text-blue-700">Turbidez</h3>
                <p className="text-sm text-gray-600">Partículas suspensas na água</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl shadow-sm text-center">
                <h3 className="font-semibold text-blue-700">Temperatura</h3>
                <p className="text-sm text-gray-600">Energia térmica da água</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl shadow-sm text-center">
                <h3 className="font-semibold text-blue-700">Profundidade</h3>
                <p className="text-sm text-gray-600">Medição da coluna d’água</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl shadow-sm text-center">
                <h3 className="font-semibold text-blue-700">Transparência</h3>
                <p className="text-sm text-gray-600">Visibilidade na coluna d’água</p>
              </div>
            </div>
          )}
        </section>

        {/* Seção: Variáveis Químicas */}
        <section className="mb-4">
          <button
            onClick={() => toggleSection("quimicas")}
            className="flex items-center gap-2 font-bold text-lg text-left w-full"
          >
            <ChevronDown
              className={`text-blue-600 transition-transform ${
                openSection === "quimicas" ? "rotate-180" : ""
              }`}
              size={20}
            />
            Variáveis Químicas
          </button>
          {openSection === "quimicas" && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 rounded-xl shadow-sm text-center">
                <h3 className="font-semibold text-green-700">pH</h3>
                <p className="text-sm text-gray-600">Acidez ou alcalinidade da água</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl shadow-sm text-center">
                <h3 className="font-semibold text-green-700">Oxigênio Dissolvido</h3>
                <p className="text-sm text-gray-600">Disponível para organismos aquáticos</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl shadow-sm text-center">
                <h3 className="font-semibold text-green-700">Nutrientes</h3>
                <p className="text-sm text-gray-600">Nitrogênio e fósforo</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl shadow-sm text-center">
                <h3 className="font-semibold text-green-700">Condutividade</h3>
                <p className="text-sm text-gray-600">Capacidade de conduzir eletricidade</p>
              </div>
            </div>
          )}
        </section>

        {/* Seção: Variáveis Biológicas */}
        <section>
          <button
            onClick={() => toggleSection("biologicas")}
            className="flex items-center gap-2 font-bold text-lg text-left w-full"
          >
            <ChevronDown
              className={`text-blue-600 transition-transform ${
                openSection === "biologicas" ? "rotate-180" : ""
              }`}
              size={20}
            />
            Variáveis Biológicas
          </button>
          {openSection === "biologicas" && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-purple-50 rounded-xl shadow-sm text-center">
                <h3 className="font-semibold text-purple-700">Fitoplâncton</h3>
                <p className="text-sm text-gray-600">Microrganismos produtores</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl shadow-sm text-center">
                <h3 className="font-semibold text-purple-700">Zooplâncton</h3>
                <p className="text-sm text-gray-600">Organismos consumidores</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl shadow-sm text-center">
                <h3 className="font-semibold text-purple-700">Bactérias</h3>
                <p className="text-sm text-gray-600">Indicadores de poluição</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl shadow-sm text-center">
                <h3 className="font-semibold text-purple-700">Macroinvertebrados</h3>
                <p className="text-sm text-gray-600">Indicadores biológicos</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
