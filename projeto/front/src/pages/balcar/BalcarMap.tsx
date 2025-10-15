import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { colors } from "../../components/Balcar/data/mockData";
import L from "leaflet";

interface Reservatorio {
  idreservatorio: number;
  nome: string;
  lat: number | null;
  lng: number | null;
}

interface Sitio {
  idsitio: number;
  nome: string;
  lat: number | null;
  lng: number | null;
  descricao: string;
  idreservatorio: number;
}

interface ApiResponse<T> {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: T[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const siteIcon = new L.DivIcon({
  className: "custom-site-icon",
  html: `<div style="background-color: ${colors.secondary}; width: 15px; height: 15px; border-radius: 50%; border: 3px solid ${colors.primary}; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
  iconSize: [21, 21],
  iconAnchor: [10, 10],
});

const INITIAL_CENTER: [number, number] = [-14.235, -51.9253];
const INITIAL_ZOOM = 4;

const BalcarMap: React.FC = () => {
  const [reservatorios, setReservatorios] = useState<Reservatorio[]>([]);
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [loading, setLoading] = useState(true);

  const reservatorioNameMap: Record<number, string> = reservatorios.reduce(
    (acc, res) => {
      acc[res.idreservatorio] = res.nome;
      return acc;
    },
    {} as Record<number, string>
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reservatoriosResponse, sitiosResponse] = await Promise.all([
          fetch("http://localhost:3001/api/balcar/reservatorio/all?limit=10000"),
          fetch("http://localhost:3001/api/balcar/sitio/all?limit=10000"),
        ]);

        if (!reservatoriosResponse.ok || !sitiosResponse.ok) {
          throw new Error("Uma das requisições falhou");
        }

        const reservatoriosData: ApiResponse<Reservatorio> = await reservatoriosResponse.json();
        const sitiosData: ApiResponse<Sitio> = await sitiosResponse.json();

        if (reservatoriosData.success && sitiosData.success) {
          setReservatorios(reservatoriosData.data || []);
          setSitios(sitiosData.data || []);
        } else {
          console.error(
            "Erro ao carregar dados da API (success: false):",
            reservatoriosData,
            sitiosData,
          );
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Carregando mapa... 🗺️</div>;
  }

  return (
    <div className="p-4" style={{ height: "calc(100vh - 80px)" }}>
      <h1 className="text-3xl font-bold mb-4" style={{ color: colors.primary }}>
        Mapa de Localizações - Projeto BALCAR
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

        {reservatorios.map((reservatorio) =>
          reservatorio.lat && reservatorio.lng ? (
            <Marker
              key={reservatorio.idreservatorio}
              position={[reservatorio.lat, reservatorio.lng]}
            >
              <Popup>
                <h3 style={{ color: colors.primary }} className="font-bold text-lg">
                  Reservatório: {reservatorio.nome}
                </h3>
                <p>
                  <span className="font-semibold">ID:</span> {reservatorio.idreservatorio}
                </p>
                <p>Lat: {reservatorio.lat.toFixed(4)}</p>
                <p>Lng: {reservatorio.lng.toFixed(4)}</p>
              </Popup>
            </Marker>
          ) : null,
        )}

        {sitios.map((sitio) => {
          const reservatorioNome = reservatorioNameMap[sitio.idreservatorio] || "Nome Desconhecido";
          
          return sitio.lat && sitio.lng ? (
            <Marker key={sitio.idsitio} position={[sitio.lat, sitio.lng]} icon={siteIcon}>
              <Popup>
                <h3 style={{ color: colors.secondary }} className="font-bold text-lg">
                  Sítio: {sitio.nome}
                </h3>
                <p>
                  <span className="font-semibold">ID Sítio:</span> {sitio.idsitio}
                </p>
                <p>
                  <span className="font-semibold">Reservatório:</span> {reservatorioNome} (ID: {sitio.idreservatorio})
                </p>
                <p>Lat: {sitio.lat.toFixed(4)}</p>
                <p>Lng: {sitio.lng.toFixed(4)}</p>
              </Popup>
            </Marker>
          ) : null;
        })}
      </MapContainer>
    </div>
  );
};

export default BalcarMap;