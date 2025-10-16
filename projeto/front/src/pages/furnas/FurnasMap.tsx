import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { colorsFurnas } from "../../components/Furnas/data/mockData";

interface ImageMap {
  [key: string]: string;
}

const reservatorioImages: ImageMap = {
  balbina: "mapa/balbina.jpg",
  batalha: "/mapa/batalha.jpg",
  'belo-monte': "/mapa/belo-monte.jpg",
  corumba: "/mapa/corumba.jpg",
  curuai: "/mapa/curua.jpg",
  estreito: "/mapa/estreito.jpg",
  funil: "/mapa/funil.jpg",
  furnas: "/mapa/furnas.jpg",
  itumbiara: "/mapa/itumbiara.jpg",
  itaipu: "/mapa/itaipu.jpg",
  jirau: "/mapa/jirau.jpg",
  mamiraua: "/mapa/mamiraua.jpg",
  manso: "/mapa/manso.jpg",
  marimbondo: "mapa/marimbondo.jpg",
  'mascarenhas-de-moraes': "/mapa/mascarenhas-de-moraes.jpg",
  'porto-colombia': "mapa/porto-colombia.jpg",
  segredo: "/mapa/segredo.jpg",
  'serra-da-mesa': "/mapa/serra-da-mesa.jpg",
  'tres-marias': "/mapa/tres-marias.jpg",
  tucurui: "/mapa/tucurui.jpg",
  'santo-antonio': "/mapa/santo-antonio.jpg",
  xingo: "mapa/xingo.jpg"
};

const formatNameForImageKey = (name: string): string => {
  return name
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
    .replace(/ /g, "-")   
    .replace("serra-da-mesa", "serra-da-mesa") 
    .replace("tres-marias", "tres-marias")
    .replace("belo-monte", "belo-monte")
    .replace("santo-antonio", "santo-antonio")
    .replace("porto-colombia", "porto-colombia")
    .replace("mascarenhas-de-moraes", "mascarenhas-de-moraes");
};


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
  reservatorio: {
    idreservatorio: number;
    nome: string;
    lat: number;
    lng: number;
  };
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

const siteIconFurnas = new L.DivIcon({
  className: "custom-site-icon-furnas",
  html: `<div style="background-color: ${colorsFurnas.secondary}; width: 15px; height: 15px; border-radius: 50%; border: 3px solid ${colorsFurnas.primary}; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
  iconSize: [21, 21],
  iconAnchor: [10, 10],
});

const INITIAL_CENTER: [number, number] = [-20.0, -47.0];
const INITIAL_ZOOM = 6;

const FurnasMap: React.FC = () => {
  const [reservatorios, setReservatorios] = useState<Reservatorio[]>([]);
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reservatoriosResponse, sitiosResponse] = await Promise.all([
          fetch("http://localhost:3001/api/furnas/reservatorio/all?limit=10000"),
          fetch("http://localhost:3001/api/furnas/sitio/all?limit=10000"),
        ]);

        const reservatoriosData: ApiResponse<Reservatorio> = await reservatoriosResponse.json();
        const sitiosData: ApiResponse<Sitio> = await sitiosResponse.json();

        if (reservatoriosData.success && sitiosData.success) {
          setReservatorios(reservatoriosData.data);
          setSitios(sitiosData.data);
        } else {
          console.error("Erro ao carregar dados da API:", reservatoriosData, sitiosData);
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
    return <div>Carregando mapa...</div>;
  }

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

        {reservatorios.map((reservatorio) => {
          if (!reservatorio.lat || !reservatorio.lng) return null;

          const imageKey = formatNameForImageKey(reservatorio.nome);
          const imageSrc = reservatorioImages[imageKey] || null;

          return (
            <Marker
              key={reservatorio.idreservatorio}
              position={[reservatorio.lat, reservatorio.lng]}
            >
              <Popup>
                {imageSrc && (
                  <img
                    src={imageSrc}
                    alt={`Imagem do Reservatório ${reservatorio.nome}`}
                    style={{
                      width: "100%", 
                      height: "auto",
                      maxHeight: "150px", 
                      marginBottom: "10px",
                      borderRadius: "4px",
                      objectFit: "cover"
                    }}
                  />
                )}

                <h3 style={{ color: colorsFurnas.primary }} className="font-bold text-lg">
                  Reservatório: {reservatorio.nome}
                </h3>
                <p>
                  <span className="font-semibold">ID:</span> {reservatorio.idreservatorio}
                </p>
                <p>Lat: {reservatorio.lat.toFixed(4)}</p>
                <p>Lng: {reservatorio.lng.toFixed(4)}</p>
              </Popup>
            </Marker>
          );
        })}

        {sitios.map((sitio) =>
          sitio.lat && sitio.lng ? (
            <Marker key={sitio.idsitio} position={[sitio.lat, sitio.lng]} icon={siteIconFurnas}>
              <Popup>
                <h3 style={{ color: colorsFurnas.secondary }} className="font-bold text-lg">
                  Sítio: {sitio.nome}
                </h3>
                <p>
                  <span className="font-semibold">ID:</span> {sitio.idsitio}
                </p>
                <p>
                  <span className="font-semibold">Reservatório:</span> {sitio.reservatorio.nome} (ID: {sitio.reservatorio.idreservatorio})
                </p>
                <p>Lat: {sitio.lat.toFixed(4)}</p>
                <p>Lng: {sitio.lng.toFixed(4)}</p>
              </Popup>
            </Marker>
          ) : null,
        )}
      </MapContainer>
    </div>
  );
};

export default FurnasMap;