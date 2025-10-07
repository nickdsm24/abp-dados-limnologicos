import React from "react";
// Importar componentes necessários do react-leaflet
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Importações específicas de Furnas
import {
  mockReservatoriosFurnas,
  mockSitiosFurnas,
  colorsFurnas,
} from "../../components/Furnas/data/mockData";
import type { Reservatorio, Sitio } from "../../components/Balcar/data/mockData"; // Reutilizando a tipagem

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

// Ícone Customizado para Sítios (com as cores de Furnas)
const siteIconFurnas = new L.DivIcon({
  className: "custom-site-icon-furnas",
  html: `<div style="background-color: ${colorsFurnas.secondary}; width: 15px; height: 15px; border-radius: 50%; border: 3px solid ${colorsFurnas.primary}; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
  iconSize: [21, 21],
  iconAnchor: [10, 10],
});

// --- Configuração Inicial para Furnas ---
const INITIAL_CENTER: [number, number] = [-20.0, -47.0]; // Foco na região de Furnas/Minas Gerais
const INITIAL_ZOOM = 6;

const FurnasMap: React.FC = () => {
  return (
    <div className="p-4" style={{ height: "calc(100vh - 80px)" }}>
      <h1 className="text-3xl font-bold mb-4" style={{ color: colorsFurnas.primary }}>
        Mapa de Localizações - Projeto FURNAS
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

        {/* 1. Marcadores de Reservatórios Furnas */}
        {mockReservatoriosFurnas.map((reservatorio: Reservatorio) => (
            // A lógica de renderização estava faltando!
            reservatorio.lat &&
            reservatorio.lng && (
                <Marker
                    key={reservatorio.idreservatorio}
                    position={[reservatorio.lat, reservatorio.lng]}
                >
                    <Popup>
                        <h3
                            style={{ color: colorsFurnas.primary }}
                            className="font-bold text-lg"
                        >
                            Reservatório: {reservatorio.nome}
                        </h3>
                        <p>Lat: {reservatorio.lat.toFixed(4)}</p>
                        <p>Lng: {reservatorio.lng.toFixed(4)}</p>
                    </Popup>
                </Marker>
            )
        ))}
        
        {/* 2. Marcadores de Sítios Furnas */}
        {mockSitiosFurnas.map((sitio: Sitio) => (
            // A lógica de renderização estava faltando!
            sitio.lat &&
            sitio.lng && (
                <Marker
                    key={sitio.idsitio}
                    position={[sitio.lat, sitio.lng]}
                    icon={siteIconFurnas}
                >
                    <Popup>
                        <h3
                            style={{ color: colorsFurnas.secondary }}
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

export default FurnasMap;