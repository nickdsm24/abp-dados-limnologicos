import React from "react";
// Importar componentes necessários do react-leaflet
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Importar o CSS do Leaflet para estilos básicos

// Importar os dados mockados e a paleta de cores (Apenas valores de runtime)
import {
  mockReservatorios,
  mockSitios,
  colors,
} from "../../components/Balcar/data/mockData";

// Use 'import type' para importar interfaces e tipos (Correção TS1484)
import type { Reservatorio, Sitio } from "../../components/Balcar/data/mockData";

// Importar ícones personalizados para evitar o bug do Leaflet com pacotes JS
import L from "leaflet";

// Corrigir problema de ícones padrão do Leaflet no Webpack/Vite
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Ícone Customizado para Sítios (Diferente do Reservatório)
const siteIcon = new L.DivIcon({
  className: "custom-site-icon",
  html: `<div style="background-color: ${colors.secondary}; width: 15px; height: 15px; border-radius: 50%; border: 3px solid ${colors.primary}; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
  iconSize: [21, 21], // Tamanho total do ícone (incluindo border)
  iconAnchor: [10, 10], // Ponto de ancoragem (centro)
});

// --- Configuração Inicial ---
// Centro inicial no Brasil (latitude/longitude aproximada central)
const INITIAL_CENTER: [number, number] = [-14.235, -51.9253];
// Nível de zoom inicial
const INITIAL_ZOOM = 4;

/**
 * Componente principal do Mapa Balcar.
 */
const BalcarMap: React.FC = () => {
  return (
    <div className="p-4" style={{ height: "calc(100vh - 80px)" }}>
      <h1 className="text-3xl font-bold mb-4" style={{ color: colors.primary }}>
        Mapa de Localizações - Projeto BALCAR
      </h1>

      {/* MapContainer do Leaflet */}
      <MapContainer
        center={INITIAL_CENTER}
        zoom={INITIAL_ZOOM}
        scrollWheelZoom={true} // Permite zoom com a roda do mouse
        style={{ height: "100%", width: "100%", borderRadius: "12px" }}
      >
        {/* Camada Base: OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* --- 1. Marcadores de Reservatórios (TBReservatório) --- */}
        {mockReservatorios.map((reservatorio: Reservatorio) => (
          // Verifica se a latitude e longitude existem (para evitar erros)
          reservatorio.lat &&
          reservatorio.lng && (
            <Marker
              key={reservatorio.idreservatorio}
              position={[reservatorio.lat, reservatorio.lng]}
            >
              <Popup>
                <h3
                  style={{ color: colors.primary }}
                  className="font-bold text-lg"
                >
                  Reservatório: {reservatorio.nome}
                </h3>
                <p>ID: {reservatorio.idreservatorio}</p>
                <p>Lat: {reservatorio.lat.toFixed(4)}</p>
                <p>Lng: {reservatorio.lng.toFixed(4)}</p>
              </Popup>
            </Marker>
          )
        ))}

        {/* --- 2. Marcadores de Sítios (TBSítio) --- */}
        {mockSitios.map((sitio: Sitio) => (
          sitio.lat &&
          sitio.lng && (
            <Marker
              key={sitio.idsitio}
              position={[sitio.lat, sitio.lng]}
              icon={siteIcon} // Usando ícone personalizado
            >
              <Popup>
                <h3
                  style={{ color: colors.secondary }}
                  className="font-bold text-lg"
                >
                  Sítio: {sitio.nome}
                </h3>
                <p>Reservatório ID: {sitio.idreservatorio}</p>
                <p>Descrição: {sitio.descricao}</p>
                <p>Lat: {sitio.lat.toFixed(4)}</p>
                <p>Lng: {sitio.lng.toFixed(4)}</p>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default BalcarMap;