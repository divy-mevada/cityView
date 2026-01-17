import requests

def fetch_current_aqi(lat, lon, api_key):
    """
    Fetches real-time AQI from AQICN (waqi.info).
    URL: https://api.waqi.info/feed/geo:{lat};{lon}/?token={token}
    """
    url = f"https://api.waqi.info/feed/geo:{lat};{lon}/"
    params = {"token": api_key}
    
    try:
        response = requests.get(url, params=params).json()
        if response.get("status") == "ok":
            return response["data"]["aqi"]
        else:
            print(f"AQICN Error: {response.get('data')}")
            return None
    except Exception as e:
        print(f"API Fetch Error: {e}")
        return None
