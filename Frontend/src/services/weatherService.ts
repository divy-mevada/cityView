import type { WeatherData, AQIData, TrafficData } from '../types';

const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const WEATHER_BASE_URL = import.meta.env.VITE_OPENWEATHER_API_BASE_URL;
const TOMTOM_API_KEY = import.meta.env.VITE_TOMTOM_API_KEY;

export const weatherService = {
  async getWeatherData(lat: number, lng: number): Promise<WeatherData> {
    const response = await fetch(
      `${WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    return response.json();
  },

  async getAQIData(lat: number, lng: number): Promise<AQIData> {
    const response = await fetch(
      `${WEATHER_BASE_URL}/air_pollution?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch AQI data');
    }
    
    return response.json();
  },

  async getTrafficData(lat: number, lng: number): Promise<TrafficData> {
    try {
      const response = await fetch(
        `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${lat},${lng}&unit=KMPH&key=${TOMTOM_API_KEY}`
      );
      
      if (!response.ok) {
        // Return mock data if API fails
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
      // Return mock data on error
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
      // Always fetch weather and AQI, use fallback for traffic if needed
      const [weather, aqi] = await Promise.all([
        this.getWeatherData(lat, lng),
        this.getAQIData(lat, lng)
      ]);
      
      // Get traffic data with fallback
      const traffic = await this.getTrafficData(lat, lng);
      
      return { weather, aqi, traffic, lat, lng };
    } catch (error) {
      console.error('Error fetching location data:', error);
      throw error;
    }
  },

  getAQILevel(aqi: number): string {
    const levels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
    return levels[aqi - 1] || 'Unknown';
  },

  getAQIColor(aqi: number): string {
    const colors = ['#00e400', '#ffff00', '#ff7e00', '#ff0000', '#8f3f97'];
    return colors[aqi - 1] || '#gray';
  },

  getAQIDescription(aqi: number): string {
    const descriptions = [
      'Air quality is considered satisfactory',
      'Air quality is acceptable for most people',
      'Members of sensitive groups may experience health effects',
      'Everyone may begin to experience health effects',
      'Health warnings of emergency conditions'
    ];
    return descriptions[aqi - 1] || 'Unknown air quality';
  }
};