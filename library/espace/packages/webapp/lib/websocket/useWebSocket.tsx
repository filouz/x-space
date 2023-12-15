
import { useCallback, useEffect, useRef, useState } from 'react';
import { WebSocketService } from './webSocketService';

interface WebSocketHook {
  data: any;
  sendMessage: (message: string) => void;
  connectWebSocket: (url: string) => void;
}

const useWebSocket = (): WebSocketHook => {

  const [data, setData] = useState<any>(null);
  const webSocketService = useRef<WebSocketService | null>(null);

  const connectWebSocket = useCallback((url: string) => {
    if (!webSocketService.current) {
      webSocketService.current = new WebSocketService(setData);
      webSocketService.current.connect(url);
    }
  }, []);

  const sendMessage = useCallback((message: string) => {
    webSocketService.current?.sendMessage(message);
  }, []);

  useEffect(() => {
    // Clean up the WebSocket connection on component unmount
    return () => {
      webSocketService.current?.disconnect();
    };
  }, []);

  return { data, sendMessage, connectWebSocket };
};

export type { WebSocketHook };
export default useWebSocket;
