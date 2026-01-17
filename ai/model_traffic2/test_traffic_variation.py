from ai.model_traffic2.traffic_model import predict_traffic_signal

print("Low road density:", predict_traffic_signal(road_density=1000, station_id="bopal"))
print("Medium road density:", predict_traffic_signal(road_density=2000, station_id="bopal"))
print("High road density:", predict_traffic_signal(road_density=3000, station_id="bopal"))
