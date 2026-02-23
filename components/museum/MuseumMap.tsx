"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import type { Museum } from "@/lib/types";

interface MuseumMapProps {
  museums: Museum[];
  focusedMuseumId: string | null;
  onMuseumClick?: (museum: Museum) => void;
}

function MapController({
  museums,
  focusedMuseumId,
}: {
  museums: Museum[];
  focusedMuseumId: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (focusedMuseumId) {
      const museum = museums.find((m) => m.id === focusedMuseumId);
      if (museum) {
        map.flyTo(museum.coordinates, 12, { duration: 1.2 });
      }
    }
  }, [focusedMuseumId, museums, map]);

  return null;
}

export default function MuseumMap({
  museums,
  focusedMuseumId,
  onMuseumClick,
}: MuseumMapProps) {
  // Center on Atlantic to show both US and Europe
  const defaultCenter: [number, number] = [40, -20];
  const defaultZoom = 3;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      scrollWheelZoom={true}
      className="h-full w-full"
      style={{ minHeight: "350px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController museums={museums} focusedMuseumId={focusedMuseumId} />
      {museums.map((museum) => (
        <Marker
          key={museum.id}
          position={museum.coordinates}
          eventHandlers={{
            click: () => onMuseumClick?.(museum),
          }}
        >
          <Popup>
            <strong>{museum.name}</strong>
            <br />
            {museum.location}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
