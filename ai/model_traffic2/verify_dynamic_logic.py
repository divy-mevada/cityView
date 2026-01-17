
import sys
import os
import pandas as pd
import json

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from ai.model_traffic2.traffic_what_if import simulate_what_if_scenario
from ai.model_traffic2.traffic_model import get_baseline_capacity
from ai.model_traffic2.config import TRAFFIC_STATIONS

def test_dynamic_scaling():
    print("========================================")
    print("   VERIFYING DYNAMIC SCENARIO LOGIC")
    print("========================================")
    
    # 1. Setup a Test Station (Use logic from demo: interpolated point or existing station)
    # Let's use 'bopal' directly for simplicity and known mean
    station_id = "bopal"
    
    # Get its baseline capacity manually to calculate expected densities
    base_cap = get_baseline_capacity(station_id=station_id)
    print(f"Baseline Capacity for {station_id}: {base_cap:,.0f}")
    
    scenario = "build a bridge" # Parser maps this to 15% reduction
    
    # ---------------------------------------------------------
    # CASE A: LOW UTILIZATION (0.1x of capacity)
    # Expected: Scale factor 0.5x (Min limit) -> Impact 15% * 0.5 = 7.5%
    # ---------------------------------------------------------
    density_low = base_cap * 0.1
    print(f"\n[CASE A] Low Density ({density_low:,.0f} ~ 10% Util)")
    
    res_low = simulate_what_if_scenario(scenario, density_low, station_id=station_id)
    impact_low = res_low['parsed_params']['magnitude_percent']
    
    print(f"   -> Resulting Impact: {impact_low}%")
    if impact_low == 7.5:
        print("   [PASS]: Scaled down to 0.5x")
    else:
        print(f"   [FAIL]: Expected 7.5%, got {impact_low}%")

    # ---------------------------------------------------------
    # CASE B: NORMAL UTILIZATION (1.0x of capacity)
    # Expected: Scale factor 1.0x -> Impact 15% * 1.0 = 15%
    # ---------------------------------------------------------
    density_mid = base_cap * 1.0
    print(f"\n[CASE B] Normal Density ({density_mid:,.0f} ~ 100% Util)")
    
    res_mid = simulate_what_if_scenario(scenario, density_mid, station_id=station_id)
    impact_mid = res_mid['parsed_params']['magnitude_percent']
    
    print(f"   -> Resulting Impact: {impact_mid}%")
    if 14.9 <= impact_mid <= 15.1:
        print("   [PASS]: Kept at ~1.0x (15%)")
    else:
        print(f"   [FAIL]: Expected 15%, got {impact_mid}%")

    # ---------------------------------------------------------
    # CASE C: HIGH UTILIZATION (2.0x of capacity)
    # Expected: Scale factor 1.5x (Max limit) -> Impact 15% * 1.5 = 22.5%
    # ---------------------------------------------------------
    density_high = base_cap * 2.0
    print(f"\n[CASE C] High Density ({density_high:,.0f} ~ 200% Util)")
    
    res_high = simulate_what_if_scenario(scenario, density_high, station_id=station_id)
    impact_high = res_high['parsed_params']['magnitude_percent']
    
    print(f"   -> Resulting Impact: {impact_high}%")
    if impact_high == 22.5:
        print("   [PASS]: Scaled up to 1.5x")
    else:
        print(f"   [FAIL]: Expected 22.5%, got {impact_high}%")

if __name__ == "__main__":
    try:
        test_dynamic_scaling()
    except Exception as e:
        print(f"\nCRITICAL ERROR: {e}")
