import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_simulation():
    print("1. Logging in as divy (Government user)...")
    login_data = {"username": "divy", "password": "1234"}
    res = requests.post(f"{BASE_URL}/api/auth/login/", json=login_data)
    if res.status_code != 200:
        print(f"Login failed: {res.text}")
        return
    
    token = res.json()["access"]
    print("Login successful.")

    print("\n2. Sending prediction request to /api/predict/...")
    # New simplified routing: config /api/predict -> simulation /''
    
    predict_data = {
        "lat": 23.03,
        "lon": 72.58,
        "scenario": "What if we build a new metro line in Vastrapur?",
        "duration_months": 6
    }
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "X-User-Role": "government"
    }
    
    res = requests.post(f"{BASE_URL}/api/predict/", json=predict_data, headers=headers)
    
    if res.status_code != 200:
        print(f"Prediction failed: {res.status_code} - {res.text}")
        return

    result = res.json()
    print("Prediction successful!")
    print(json.dumps(result, indent=2))
    
    print("\n3. Verifying metric integration...")
    details = result.get("details", {})
    metrics = ["healthcare_index", "schools_index", "urban_dev_index", "traffic_change_percent"]
    for m in metrics:
        if m in details:
            print(f"[OK] Metric found: {m} = {details[m]}")
        else:
            print(f"[FAIL] Metric missing: {m}")

    print("\n4. Verifying reasoning...")
    if details.get("reasoning"):
        print(f"[OK] Reasoning found: {details['reasoning'][:100]}...")
    else:
        print("[FAIL] Reasoning missing")

if __name__ == "__main__":
    test_simulation()
