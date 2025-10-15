import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { colorsSima } from "../../components/Sima/data/mockData";

interface ApiResponse<T> {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: T[];
}

interface Estacao {
  idestacao: string;
  rotulo: string;
  lat: number | null;
  lng: number | null;
  inicio: string;
  fim: string | null;
}

interface EstacaoSimaAninhada {
  idestacao: string;
  rotulo: string;
  lat: number;
  lng: number;
}

interface SimaRegistro {
  idsima: number;
  datahora: string;
  precipitacao: number | null;
  estacao: EstacaoSimaAninhada;
}

interface EstacaoComDados extends Estacao {
  ultimaPrecipitacao: number | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const getPrecipitacaoStyle = (mm: number) => {
  let color = colorsSima.primary;
  let radius = 6;

  if (mm > 50) {
    color = "#FF4500";
    radius = 12;
  } else if (mm > 20) {
    color = "#00CED1";
    radius = 9;
  } else if (mm > 0) {
    color = "#ADD8E6";
    radius = 6;
  } else {
    color = "#CCCCCC";
    radius = 5;
  }

  return { color, radius };
};

const INITIAL_CENTER: [number, number] = [-13.5, -50.0];
const INITIAL_ZOOM = 5;

const SimaMap: React.FC = () => {
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [simaRegistros, setSimaRegistros] = useState<SimaRegistro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [estacoesResponse, simaResponse] = await Promise.all([
          fetch("http://localhost:3001/api/sima/estacao/all?limit=10000"),
          fetch("http://localhost:3001/api/sima/sima/all?limit=10000"),
        ]);

        if (!estacoesResponse.ok || !simaResponse.ok) {
          throw new Error("Uma das requisições de API falhou.");
        }

        const estacoesData: ApiResponse<Estacao> = await estacoesResponse.json();
        const simaData: ApiResponse<SimaRegistro> = await simaResponse.json();

        if (estacoesData.success && simaData.success) {
          setEstacoes(estacoesData.data || []);
          setSimaRegistros(simaData.data || []);
        } else {
          console.error("Erro ao carregar dados da API (success: false):", estacoesData, simaData);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const estacoesComPrecipitacao = useMemo<EstacaoComDados[]>(() => {
    const lastPrecipitacaoMap = new Map<string, number | null>();

    for (const registro of simaRegistros) {
      const id = registro.estacao.idestacao;
      const precipitacao = registro.precipitacao;

      if (precipitacao !== null && precipitacao !== undefined && !lastPrecipitacaoMap.has(id)) {
        lastPrecipitacaoMap.set(id, precipitacao);
      }
    }

    return estacoes.map((estacao) => ({
      ...estacao,
      ultimaPrecipitacao: lastPrecipitacaoMap.get(estacao.idestacao) ?? 0,
    }));
  }, [estacoes, simaRegistros]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  if (loading) {
    return <div>Carregando mapa SIMA... 🗺️</div>;
  }

  return (
    <div className="p-4" style={{ height: "calc(100vh - 80px)" }}>
      <h1 className="text-3xl font-bold mb-4" style={{ color: colorsSima.primary }}>
        Mapa de Monitoramento - Projeto SIMA
      </h1>

      <MapContainer
        center={INITIAL_CENTER}
        zoom={INITIAL_ZOOM}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {estacoesComPrecipitacao.map(
          (estacao) =>
            estacao.lat &&
            estacao.lng && (
              <Marker key={estacao.idestacao} position={[estacao.lat, estacao.lng]}>
                <Popup>
                  <h3 style={{ color: colorsSima.primary }} className="font-bold text-lg">
                    Estação: {estacao.rotulo}
                  </h3>
                  <p>ID da Estação: {estacao.idestacao}</p>
                  <p>Início: {formatDate(estacao.inicio)}</p>
                  <p>Fim: {estacao.fim ? formatDate(estacao.fim) : "Em operação"}</p>
                  <p>Latitude: {estacao.lat.toFixed(4)}</p>
                  <p>Longitude: {estacao.lng.toFixed(4)}</p>
                </Popup>
              </Marker>
            ),
        )}

        {estacoesComPrecipitacao.map((estacao) => {
          const precipitacao = estacao.ultimaPrecipitacao ?? 0;
          const { color, radius } = getPrecipitacaoStyle(precipitacao);

          return (
            estacao.lat &&
            estacao.lng && (
              <CircleMarker
                key={`precip-${estacao.idestacao}`}
                center={[estacao.lat, estacao.lng]}
                pathOptions={{ color: color, fillColor: color, fillOpacity: 0.7, weight: 1 }}
                radius={radius}
              >
                <Popup>
                  <h3 style={{ color: color }} className="font-bold text-lg">
                    Estação: {estacao.rotulo}
                  </h3>
                  <p>
                    Precipitação (últ. registro):{" "}
                    <strong style={{ color }}>{precipitacao.toFixed(2)} mm</strong>
                  </p>
                  <p>ID da Estação: {estacao.idestacao}</p>
                </Popup>
              </CircleMarker>
            )
          );
        })}
      </MapContainer>
    </div>
  );
};

export default SimaMap;
