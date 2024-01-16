import store from "../redux/store";
import { updateSwitchChart, updateActivityChart, ChartDataItem } from "../redux/slices/chartSlice";
import { updateMarkdown } from "../redux/slices/markdownSlice";
import { updateMap, MapState } from "../redux/slices/mapSlice";


type MessageCallback = (message: any) => void;

interface WebSocketMessage {
  markdown?: string;
}

export class WebSocketService {
  private url: string = "";
  private socket: WebSocket | null = null;
  private onMessage: MessageCallback;
  private retryCount: number = 0;
  private maxRetries: number = 5;
  private retryInterval: number = 2000; // in milliseconds

  constructor(onMessage: MessageCallback) {
    this.onMessage = onMessage;
  }

  private handleOpen = () => {
    console.log("WebSocket connected");
    this.retryCount = 0;

    var object = {
      tsSubCmds: [
        {
          cmdId: 1,
          entityType: "DEVICE",
          entityId: String(process.env.TB_PHONE_ENTITYID), // phone
          scope: "LATEST_TELEMETRY",
        },

        {
          cmdId: 2,
          entityType: "DEVICE",
          entityId: String(process.env.TB_SWITCH_ENTITYID), // switch
          scope: "LATEST_TELEMETRY",
        },
      ],
      historyCmds: [],
      attrSubCmds: [],
    };
    var data = JSON.stringify(object);

    this.sendMessage(data);
  };

  private handleError = (error: Event) => {
    console.error("WebSocket error:", error);
    this.socket = null;
    this.attemptReconnect();
  };

  private handleMessage = (event: MessageEvent) => {
    const subscription = JSON.parse(event.data);
    const data = subscription.data;

    switch (subscription.subscriptionId) {
      case 1:
        // console.log("phone", data);
        if(data.geo) {
          store.dispatch(updateMarkdown(data.geo[0][1]));
        }
        if(data.geo && data.latitude && data.longitude) {
          const newMapData : MapState = {
            lat: data.latitude[0][1], 
            lng: data.longitude[0][1], 
            hint: data.geo[0][1]
          };
          store.dispatch(updateMap(newMapData));
        }
        if(data.duration) {
          const value = Number(Number(data.duration[0][1]) / 3600)
          store.dispatch(updateActivityChart({ name: data.duration[0][0], value: parseFloat(value.toFixed(2))}));
        }
        break;

      case 2:
        // console.log("switch", data);
        if(data.active_power) {
          store.dispatch(updateSwitchChart({ name: data.active_power[0][0], value: Number(data.active_power[0][1])}));
        }
        break;
    }

    // this.onMessage(event.data);
  };

  private handleClose = (event: CloseEvent) => {
    console.log("WebSocket Closed", event);
    this.socket = null;
    this.attemptReconnect();
  };

  private attemptReconnect() {
    if (this.retryCount < this.maxRetries) {
      setTimeout(() => {
        console.log(
          `Attempting to reconnect... (Attempt ${this.retryCount + 1})`
        );
        this.retryCount++;
        this.connect(this.url);
      }, this.retryInterval);
    }
  }

  connect(url: string) {
    this.url = url;
    this.socket = new WebSocket(this.url);
    this.socket.onopen = this.handleOpen;
    this.socket.onerror = this.handleError;
    this.socket.onmessage = this.handleMessage;
    this.socket.onclose = this.handleClose;
  }

  sendMessage(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error("WebSocket is not connected");
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}
