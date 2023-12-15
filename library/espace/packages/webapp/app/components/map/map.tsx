
import React from "react";
import { useSelector } from 'react-redux';
import dynamic from "next/dynamic";
import { RootState } from '@/lib/redux/types'; 


const MapPanel = () => {
  const MapComponent = dynamic(() => import("./mapComponent"), {
    ssr: false
  });
  
  return (
    <div>
      <MapComponent />
    </div>
  );
};

export default MapPanel;