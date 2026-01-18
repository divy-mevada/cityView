export interface User {
  id: string;
  username: string;
  role: 'citizen' | 'government';
  name?: string;
}

export interface KPIData {
  aqi: number;
  traffic: number;
  healthcare: number;
  schools: number;
  urbanDevelopment: number;
}

export interface AreaData {
  zone: string;
  ward: string;
  locality: string;
  kpis: KPIData;
  demand: number;
  footfall: number;
}

export interface TimelineOption {
  label: string;
  value: 'current' | '1month' | '3months' | '6months';
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  visualData?: KPIData;
}

export interface MapLayer {
  id: string;
  name: string;
  enabled: boolean;
  color: string;
}

export interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  name: string;
}

export interface AQIData {
  status: string;
  data: {
    aqi: number;
    idx: number;
    city: {
      name: string;
      geo: [number, number];
    };
    iaqi: {
      pm25?: { v: number };
      pm10?: { v: number };
      no2?: { v: number };
      o3?: { v: number };
      so2?: { v: number };
      co?: { v: number };
    };
    time: {
      s: string;
      tz: string;
    };
  };
}

export interface TrafficData {
  currentSpeed: number;
  freeFlowSpeed: number;
  currentTravelTime: number;
  freeFlowTravelTime: number;
  confidence: number;
  roadClosure: boolean;
}

export interface LocationData {
  lat: number;
  lng: number;
  aqi: AQIData;
  traffic: TrafficData;
}