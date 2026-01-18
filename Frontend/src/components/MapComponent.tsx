import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { mapService } from '../services/mapService';
import type { AQIData, TrafficData } from '../types';
import { Lightbulb, MapPin, Wind, AlertTriangle, Car } from 'lucide-react';

interface MapComponentProps {
  layers: string[];
  className?: string;
  onLocationSelect?: (lat: number, lng: number) => void;
}

interface LocationInfo {
  lat: number;
  lng: number;
  aqi?: AQIData;
  traffic?: TrafficData;
  loading?: boolean;
}

export const MapComponent: React.FC<MapComponentProps> = ({ layers, className = '', onLocationSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(null);
  const currentMarkerRef = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const tomtomApiKey = import.meta.env.VITE_TOMTOM_API_KEY;

      // Check for API keys
      if (!tomtomApiKey || tomtomApiKey === 'undefined') {
        console.error('TomTom API Key is missing');
        mapRef.current.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100%;color:red;">Error: TomTom API Key missing. Please check .env file.</div>';
        return;
      }

      // Initialize MapLibre GL map with TomTom tiles
      mapInstanceRef.current = new maplibregl.Map({
        container: mapRef.current,
        style: {
          version: 8,
          sources: {
            'tomtom-map': {
              type: 'raster',
              tiles: [`https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=${tomtomApiKey}`],
              tileSize: 256
            }
          },
          layers: [
            {
              id: 'tomtom-tiles',
              type: 'raster',
              source: 'tomtom-map',
              minzoom: 0,
              maxzoom: 22
            }
          ]
        },
        center: [72.5714, 23.0225], // [lng, lat] for Ahmedabad
        zoom: 11
      });

      // Add AQI monitoring stations for Ahmedabad
      const aqiStations = [
        { name: 'Maninagar', lat: 23.0088, lng: 72.6283 },
        { name: 'Vastrapur', lat: 23.0368, lng: 72.5066 },
        { name: 'Bopal', lat: 22.9734, lng: 72.4606 },
        { name: 'Satellite', lat: 23.0258, lng: 72.5194 },
        { name: 'Chandkheda', lat: 23.1319, lng: 72.6119 }
      ];

      aqiStations.forEach(async (station) => {
        try {
          const aqiData = await mapService.getAQIData(station.lat, station.lng);
          const aqi = aqiData.data.aqi;
          const color = mapService.getAQIColor(aqi);

          new maplibregl.Marker({ color })
            .setLngLat([station.lng, station.lat])
            .setPopup(new maplibregl.Popup().setHTML(`
              <div class="p-2">
                <h3 class="font-semibold">${station.name}</h3>
                <p class="text-lg font-bold" style="color: ${color}">AQI: ${aqi}</p>
                <p class="text-sm">${mapService.getAQILevel(aqi)}</p>
              </div>
            `))
            .addTo(mapInstanceRef.current!);
        } catch (error) {
          console.error(`Error loading AQI for ${station.name}:`, error);
        }
      });

      // Add click event listener for location selection
      mapInstanceRef.current.on('click', async (e) => {
        const { lng, lat } = e.lngLat;

        // Call parent callback if provided
        if (onLocationSelect) {
          onLocationSelect(lat, lng);
        }

        // Remove previous marker if exists
        if (currentMarkerRef.current) {
          currentMarkerRef.current.remove();
        }

        // Set loading state
        setSelectedLocation({ lat, lng, loading: true });

        // Add temporary marker for selected location
        currentMarkerRef.current = new maplibregl.Marker({ color: '#ff0000' })
          .setLngLat([lng, lat])
          .addTo(mapInstanceRef.current!);

        try {
          // Fetch AQI and traffic data for clicked location
          const locationData = await mapService.getLocationData(lat, lng);

          const aqi = locationData.aqi.data.aqi;
          const color = mapService.getAQIColor(aqi);

          // Update marker color based on AQI
          currentMarkerRef.current.remove();
          currentMarkerRef.current = new maplibregl.Marker({ color })
            .setLngLat([lng, lat])
            .addTo(mapInstanceRef.current!);

          // Update state with all data
          setSelectedLocation({
            lat,
            lng,
            aqi: locationData.aqi,
            traffic: locationData.traffic,
            loading: false
          });

        } catch (error) {
          console.error('Error fetching location data:', error);
          setSelectedLocation({ lat, lng, loading: false });
        }
      });
    }

    return () => {
      if (currentMarkerRef.current) {
        currentMarkerRef.current.remove();
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const getTrafficStatus = (traffic: TrafficData) => {
    if (!traffic.currentSpeed || !traffic.freeFlowSpeed) return { status: 'No Data', color: '#gray' };

    const ratio = traffic.currentSpeed / traffic.freeFlowSpeed;
    if (ratio >= 0.8) return { status: 'Free Flow', color: '#00e400' };
    if (ratio >= 0.6) return { status: 'Light Traffic', color: '#ffff00' };
    if (ratio >= 0.4) return { status: 'Moderate Traffic', color: '#ff7e00' };
    if (ratio >= 0.2) return { status: 'Heavy Traffic', color: '#ff0000' };
    return { status: 'Severe Congestion', color: '#8f3f97' };
  };

  const getHealthRecommendation = (aqi: number): string => {
    if (aqi <= 50) return 'Air quality is satisfactory. Enjoy outdoor activities!';
    if (aqi <= 100) return 'Air quality is acceptable. Sensitive individuals should consider limiting prolonged outdoor exertion.';
    if (aqi <= 150) return 'Sensitive groups should reduce outdoor activities. Others can continue normal activities.';
    if (aqi <= 200) return 'Everyone should limit outdoor activities. Sensitive groups should avoid outdoor activities.';
    if (aqi <= 300) return 'Health alert! Everyone should avoid outdoor activities and stay indoors.';
    return 'Health emergency! Everyone should avoid all outdoor activities.';
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* Map Container */}
      <div className="relative flex-1">
        <div ref={mapRef} className={`w-full h-full rounded-lg ${className}`} />

        {/* Layer controls */}
        <div className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow-lg z-10">
          <h5 className="text-xs font-semibold mb-2">Interactive Map</h5>

          {/* Instructions */}
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <Lightbulb className="w-3 h-3" />
              Click anywhere to get AQI & traffic data
            </p>
          </div>
        </div>
      </div>

      {/* Location Data Card */}
      {selectedLocation && (
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location Data
              </h3>
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 border rounded"
              >
                Clear
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Coordinates: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
            </p>

            {selectedLocation.loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-lg">Loading data...</span>
              </div>
            ) : selectedLocation.aqi && selectedLocation.traffic ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* AQI Card */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Wind className="w-5 h-5" />
                    Air Quality Index
                  </h4>
                  {(() => {
                    const aqi = selectedLocation.aqi.data.aqi;
                    const level = mapService.getAQILevel(aqi);
                    const color = mapService.getAQIColor(aqi);

                    return (
                      <>
                        <div className="flex items-center mb-3">
                          <span className="text-4xl font-bold" style={{ color }}>{aqi}</span>
                          <div className="ml-4">
                            <div className="font-semibold text-lg" style={{ color }}>{level}</div>
                            <div className="text-sm text-gray-600">{getHealthRecommendation(aqi)}</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div><strong>PM2.5:</strong> {selectedLocation.aqi.data.iaqi.pm25?.v || 'N/A'} μg/m³</div>
                          <div><strong>PM10:</strong> {selectedLocation.aqi.data.iaqi.pm10?.v || 'N/A'} μg/m³</div>
                          <div><strong>NO₂:</strong> {selectedLocation.aqi.data.iaqi.no2?.v || 'N/A'} μg/m³</div>
                          <div><strong>O₃:</strong> {selectedLocation.aqi.data.iaqi.o3?.v || 'N/A'} μg/m³</div>
                          <div><strong>SO₂:</strong> {selectedLocation.aqi.data.iaqi.so2?.v || 'N/A'} μg/m³</div>
                          <div><strong>CO:</strong> {selectedLocation.aqi.data.iaqi.co?.v || 'N/A'} mg/m³</div>
                        </div>

                        <div className="mt-3 p-2 bg-white bg-opacity-50 rounded text-xs">
                          <strong>Station:</strong> {selectedLocation.aqi.data.city.name}<br />
                          <strong>Updated:</strong> {new Date(selectedLocation.aqi.data.time.s).toLocaleString()}
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Traffic Card */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    Live Traffic Status
                  </h4>
                  {(() => {
                    const trafficStatus = getTrafficStatus(selectedLocation.traffic);
                    return (
                      <>
                        <div className="flex items-center mb-3">
                          <div
                            className="w-4 h-4 rounded-full mr-3"
                            style={{ backgroundColor: trafficStatus.color }}
                          ></div>
                          <span className="font-semibold text-lg" style={{ color: trafficStatus.color }}>
                            {trafficStatus.status}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Current Speed:</span>
                            <span className="font-semibold">{selectedLocation.traffic.currentSpeed || 0} km/h</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Free Flow Speed:</span>
                            <span className="font-semibold">{selectedLocation.traffic.freeFlowSpeed || 0} km/h</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Travel Time:</span>
                            <span className="font-semibold">{selectedLocation.traffic.currentTravelTime || 0}s</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Confidence:</span>
                            <span className="font-semibold">{(selectedLocation.traffic.confidence * 100 || 0).toFixed(0)}%</span>
                          </div>
                          {selectedLocation.traffic.roadClosure && (
                            <div className="mt-2 p-2 bg-red-100 text-red-800 rounded text-sm font-medium flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4" />
                              Road Closure Detected
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg text-red-600">Failed to load location data</p>
                <p className="text-sm text-gray-600">Please try clicking on a different location</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
