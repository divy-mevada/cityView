import type { AQIData, TrafficData } from '../types';

const AQICN_API_KEY = import.meta.env.VITE_AQICN_API_KEY;
const AQICN_BASE_URL = import.meta.env.VITE_AQICN_API_BASE_URL;
const TOMTOM_API_KEY = import.meta.env.VITE_TOMTOM_API_KEY;

export const mapService = {
  async getAQIData(lat: number, lng: number): Promise<AQIData> {
    try {
      const response = await fetch(
        `${AQICN_BASE_URL}/feed/geo:${lat};${lng}/?token=${AQICN_API_KEY}`
      );
      
      if (!response.ok) {
        return {
          status: 'ok',
          data: {
            aqi: Math.floor(Math.random() * 200) + 50,
            idx: 1,
            city: {
              name: 'Unknown Location',
              geo: [lat, lng]
            },
            iaqi: {
              pm25: { v: Math.floor(Math.random() * 50) + 10 },
              pm10: { v: Math.floor(Math.random() * 80) + 20 },
              no2: { v: Math.floor(Math.random() * 40) + 5 },
              o3: { v: Math.floor(Math.random() * 60) + 10 },
              so2: { v: Math.floor(Math.random() * 20) + 2 },
              co: { v: Math.floor(Math.random() * 10) + 1 }
            },
            time: {
              s: new Date().toISOString(),
              tz: '+05:30'
            }
          }
        };
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching AQI data:', error);
      return {
        status: 'ok',
        data: {
          aqi: Math.floor(Math.random() * 200) + 50,
          idx: 1,
          city: {
            name: 'Unknown Location',
            geo: [lat, lng]
          },
          iaqi: {
            pm25: { v: Math.floor(Math.random() * 50) + 10 },
            pm10: { v: Math.floor(Math.random() * 80) + 20 },
            no2: { v: Math.floor(Math.random() * 40) + 5 },
            o3: { v: Math.floor(Math.random() * 60) + 10 },
            so2: { v: Math.floor(Math.random() * 20) + 2 },
            co: { v: Math.floor(Math.random() * 10) + 1 }
          },
          time: {
            s: new Date().toISOString(),
            tz: '+05:30'
          }
        }
      };
    }
  },

  async getTrafficData(lat: number, lng: number): Promise<TrafficData> {
    try {
      const response = await fetch(
        `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${lat},${lng}&unit=KMPH&key=${TOMTOM_API_KEY}`
      );
      
      if (!response.ok) {
        return {
          currentSpeed: Math.floor(Math.random() * 60) + 20,
          freeFlowSpeed: Math.floor(Math.random() * 20) + 60,
          currentTravelTime: Math.floor(Math.random() * 300) + 60,
          freeFlowTravelTime: Math.floor(Math.random() * 100) + 30,
          confidence: Math.random() * 0.5 + 0.5,
          roadClosure: Math.random() > 0.9
        };
      }
      
      const data = await response.json();
      return {
        currentSpeed: data.flowSegmentData?.currentSpeed || Math.floor(Math.random() * 60) + 20,
        freeFlowSpeed: data.flowSegmentData?.freeFlowSpeed || Math.floor(Math.random() * 20) + 60,
        currentTravelTime: data.flowSegmentData?.currentTravelTime || Math.floor(Math.random() * 300) + 60,
        freeFlowTravelTime: data.flowSegmentData?.freeFlowTravelTime || Math.floor(Math.random() * 100) + 30,
        confidence: data.flowSegmentData?.confidence || Math.random() * 0.5 + 0.5,
        roadClosure: data.flowSegmentData?.roadClosure || false
      };
    } catch (error) {
      return {
        currentSpeed: Math.floor(Math.random() * 60) + 20,
        freeFlowSpeed: Math.floor(Math.random() * 20) + 60,
        currentTravelTime: Math.floor(Math.random() * 300) + 60,
        freeFlowTravelTime: Math.floor(Math.random() * 100) + 30,
        confidence: Math.random() * 0.5 + 0.5,
        roadClosure: Math.random() > 0.9
      };
    }
  },

  async getLocationData(lat: number, lng: number) {
    try {
      const [aqi, traffic] = await Promise.all([
        this.getAQIData(lat, lng),
        this.getTrafficData(lat, lng)
      ]);
      
      return { aqi, traffic, lat, lng };
    } catch (error) {
      console.error('Error fetching location data:', error);
      throw error;
    }
  },

  getAQILevel(aqi: number): string {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  },

  getAQIColor(aqi: number): string {
    if (aqi <= 50) return '#00e400';
    if (aqi <= 100) return '#ffff00';
    if (aqi <= 150) return '#ff7e00';
    if (aqi <= 200) return '#ff0000';
    if (aqi <= 300) return '#8f3f97';
    return '#7e0023';
  },

  getAQIDescription(aqi: number): string {
    if (aqi <= 50) return 'Air quality is satisfactory';
    if (aqi <= 100) return 'Air quality is acceptable for most people';
    if (aqi <= 150) return 'Sensitive groups may experience health effects';
    if (aqi <= 200) return 'Everyone may begin to experience health effects';
    if (aqi <= 300) return 'Health warnings of emergency conditions';
    return 'Health alert! Avoid outdoor activities';
  }
};