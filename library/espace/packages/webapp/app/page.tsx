"use client";

import React, { useEffect, useState } from 'react';
import AppBar from "@mui/material/AppBar";
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import dynamic from "next/dynamic";


import MarkdownPanel from './components/markdown/markdown'
import MapPanel from './components/map/map'
import ActivityChart from './components/chart/activityChart'
import SwitchChart from './components/chart/switchChart'

import useWebSocket, { WebSocketHook } from '@/lib/websocket/useWebSocket';
import { fetchToken } from '@/lib/api/fetchToken';


export default function Home() {

  const { data, sendMessage, connectWebSocket } : WebSocketHook = useWebSocket();

  useEffect(() => {

    const initializeData = async () => {
      try {
        const fetchedToken = await fetchToken();
        console.log("fetchedToken", fetchedToken)
        connectWebSocket(`${String(process.env.THINGSBOARD_TELEMETRY)}${fetchedToken}`)
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };

    initializeData();
  }, [connectWebSocket]);

  const ActivityPanel = dynamic(() => import("./components/chart/activityChart"), {
    ssr: false
  });

  const SwitchPanel = dynamic(() => import("./components/chart/switchChart"), {
    ssr: false
  });

  return (
    <div className="bg-[#eeeeee] min-h-screen flex flex-col">
      <AppBar position="relative"  style={{ backgroundColor: '#122e47' }}>
        <Toolbar>
          <SatelliteAltIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            E-Space
          </Typography>
        </Toolbar>
      </AppBar>
      <main className="flex flex-col justify-between w-full h-screen" style={{ height: 'calc(100vh - 64px)' }}> {/* Changed from 'flex-1' to 'flex-col' and 'h-screen' */}
        <div className="flex-grow"> {/* New div to fill the space between AppBar and panels */}
          <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full h-full p-4"> {/* Ensure full height and width with padding */}

            {/* Panel 1 */}
            <div className="bg-white p-4 shadow-lg flex flex-col">
              <h2 className="text-sm flex items-center mb-3">
                <ToggleOnIcon sx={{ color: 'rgb(212, 221, 31)', mr: 1 }} /> Switch: Active Power
              </h2>
              <div className="flex-1">
                <SwitchPanel  />
              </div>
            </div>

            {/* Panel 2 */}
            <div className="bg-white p-4 shadow-lg flex flex-col">
              <h2 className="text-sm flex items-center mb-3">
                Activity Duration
              </h2>
              <div className="flex-1">
                <ActivityPanel  />
              </div>
            </div>

            {/* Panel 3 */}
            <div className="bg-white p-4 shadow-lg flex flex-col">
              <h2 className="text-sm mb-3">Phone Location</h2>
              <MapPanel />
            </div>

            {/* Panel 4 */}
            <div className="bg-white p-4 shadow-lg flex flex-col">
                <MarkdownPanel />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
