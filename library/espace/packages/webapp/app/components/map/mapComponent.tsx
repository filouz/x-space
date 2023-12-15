"use client";


import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { MapState } from '@/lib/redux/slices/mapSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/types'; 



const MapComponent = () => {

  const data = useSelector((state: RootState) => state.map);

  return (
    <MapContainer
      center={[data.lat, data.lng]} 
      zoom={18}  
      // scrollWheelZoom={false} 
      style={{ height: '35vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[data.lat, data.lng]}>
        <Popup>
          <div dangerouslySetInnerHTML={{ __html: data.hint }} />
        </Popup>      
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
