'use client';

import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { HeadquartersState, BranchInfo } from '@/context/BenefitsContext';

interface BenefitMapProps {
  readonly activeCity: string;
  readonly headquarters: HeadquartersState;
  readonly selectedCoordinates: { lat: number; lng: number } | null;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 4.6097, // Bogotá default fallback
  lng: -74.0817,
};

const googleEnv = process.env.GOOGLE ? JSON.parse(process.env.GOOGLE) : null;
const apiKey = googleEnv?.MAPS?.API_KEY || '';

export default function BenefitMap({ activeCity, headquarters, selectedCoordinates }: BenefitMapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  const [activeMarker, setActiveMarker] = useState<BranchInfo | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Extract branches for active city
  const cityData = headquarters[activeCity];
  const branches = cityData?.info || [];

  // Determine center based on selection or first branch
  const getCenter = () => {
    if (selectedCoordinates) {
      return selectedCoordinates;
    }
    if (branches.length > 0) {
      return {
        lat: Number(branches[0].latitude),
        lng: Number(branches[0].longitude),
      };
    }
    return defaultCenter;
  };

  const center = getCenter();

  // If selectedCoordinates changes, pan to it
  useEffect(() => {
    if (map && selectedCoordinates) {
      map.panTo(selectedCoordinates);
      map.setZoom(15);
    }
  }, [selectedCoordinates, map]);

  if (loadError) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-center text-red-500 bg-red-50 rounded-3xl">
        Error al cargar Google Maps. Por favor, intente de nuevo.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 text-gray-500 rounded-3xl animate-pulse font-semibold">
        Cargando Mapa...
      </div>
    );
  }

  return (
    <div className="w-full h-full relative rounded-3xl overflow-hidden shadow-md">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={selectedCoordinates ? 15 : 12}
        center={center}
        onLoad={(mapInstance) => setMap(mapInstance)}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      >
        {branches.map((branch) => {
          const lat = Number(branch.latitude);
          const lng = Number(branch.longitude);
          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <MarkerF
              key={branch.id}
              position={{ lat, lng }}
              onClick={() => setActiveMarker(branch)}
              icon={{
                url: '/static/images/localizacion/icono-boton-hover.svg',
                scaledSize: new window.google.maps.Size(32, 32),
              }}
            />
          );
        })}

        {activeMarker && (
          <InfoWindowF
            position={{
              lat: Number(activeMarker.latitude),
              lng: Number(activeMarker.longitude),
            }}
            onCloseClick={() => setActiveMarker(null)}
          >
            <div className="p-2 text-gray-800 text-xs font-semibold max-w-[200px]">
              <p className="font-bold text-[#03091e] mb-1">{activeMarker.name || 'Sede'}</p>
              <p className="text-gray-600 mb-0.5">{activeMarker.address}</p>
              {activeMarker.phone && <p className="text-gray-400">Tel: {activeMarker.phone}</p>}
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </div>
  );
}
