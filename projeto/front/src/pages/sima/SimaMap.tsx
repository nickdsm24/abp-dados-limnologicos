import React from "react";
// Importar componentes necessários do react-leaflet.
// CircleMarker é perfeito para o Requisito 3.1 (Precipitação)
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Importações específicas de Sima
import {
  mockReservatoriosSima,
  mockSitiosSima,
  colorsSima,
} from "../../components/Sima/data/mockData";
// Importar a tipagem específica do Sima e a tipagem base
import type { Reservatorio } from "../../components/Balcar/data/mockData";
import type { SitioSima } from "../../components/Sima/data/mockData";

// Importar ícones personalizados para evitar o bug do Leaflet com pacotes JS
import L from "leaflet";

// Corrigir problema de ícones padrão do Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// FUNÇÃO AUXILIAR para calcular o raio e a cor com base na precipitação (Requisito 3.1)
const getPrecipitacaoStyle = (mm: number) => {
    let color = colorsSima.primary;
    let radius = 6; // Raio base

    if (mm > 50) {
        color = '#FF4500'; // Chuva Forte (Laranja)
        radius = 12;
    } else if (mm > 20) {
        color = '#00CED1'; // Chuva Moderada (Ciano)
        radius = 9;
    } else if (mm > 0) {
        color = '#ADD8E6'; // Chuva Leve (Azul Claro)
        radius = 6;
    } else {
        color = '#CCCCCC'; // Sem chuva
        radius = 5;
    }

    return { color, radius };
};

// --- Configuração Inicial para SIMA ---
const INITIAL_CENTER: [number, number] = [-13.5, -50.0]; // Foco em uma área central do Brasil
const INITIAL_ZOOM = 5;

const SimaMap: React.FC = () => {
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

        {/* 1. Marcadores de Reservatórios SIMA */}
        {/* Usando Marker padrão para o Reservatório principal (Nível/Volume) */}
        {mockReservatoriosSima.map((reservatorio: Reservatorio) => (
            reservatorio.lat &&
            reservatorio.lng && (
                <Marker
                    key={reservatorio.idreservatorio}
                    position={[reservatorio.lat, reservatorio.lng]}
                >
                    <Popup>
                        <h3
                            style={{ color: colorsSima.primary }}
                            className="font-bold text-lg"
                        >
                            Reservatório: {reservatorio.nome}
                        </h3>
                        {/* Requisito 3.2: Nível de Água e Volume Útil */}
                        <p>Status: OK (mock)</p>
                        <p>Volume Útil: 85% (mock)</p>
                    </Popup>
                </Marker>
            )
        ))}
        
        {/* 2. Marcadores de Sítios SIMA (Precipitação) */}
        {/* Usando CircleMarker para visualização de dados (Requisito 3.1) */}
        {mockSitiosSima.map((sitio: SitioSima) => {
            const { color, radius } = getPrecipitacaoStyle(sitio.precipitacao_24h);
            
            return (
                sitio.lat &&
                sitio.lng && (
                    <CircleMarker
                        key={sitio.idsitio}
                        center={[sitio.lat, sitio.lng]}
                        pathOptions={{ color: color, fillColor: color, fillOpacity: 0.7, weight: 1 }}
                        radius={radius} // Raio varia conforme a precipitação
                    >
                        <Popup>
                            <h3
                                style={{ color: color }}
                                className="font-bold text-lg"
                            >
                                Estação: {sitio.nome}
                            </h3>
                            <p>Precipitação (24h): <strong style={{color}}>{sitio.precipitacao_24h} mm</strong></p>
                            <p>Descrição: {sitio.descricao}</p>
                            {/* Aqui pode vir um gráfico de histórico de precipitação (Requisito 6) */}
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