
import sys
import os
import json

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from ai.model_traffic2.traffic_what_if import simulate_what_if_scenario

def run_test_scenario(text, station_id="bopal", density=2000):
    print(f"\n--- Scenario: '{text}' (Station: {station_id}) ---")
    
    # Pass None as llm_client to use heuristic parser
    result = simulate_what_if_scenario(text, station_id, density, llm_client=None)
    
    parsed = result["parsed_params"]
    print(f"Parsed: Action={parsed['action']}, Magnitude={parsed['magnitude_percent']}%, Days={parsed['duration_months']}")
    
    print(f"Baseline AQI Impact: {result['baseline_aqi_impact']:.3f}")
    
    for period in ["1_month", "3_months", "6_months"]:
        fc = result["forecast"][period]
        diff = fc["aqi_impact"] - result["baseline_aqi_impact"]
        print(f"[{period:<8}] Traffic: {fc['traffic_change_pct']:>5}% | AQI Impact: {fc['aqi_impact']:.3f} (Change: {diff:+.3f})")

if __name__ == "__main__":
    print("Verifying What-If Analytics...")
    
    # Test 1: Infrastructure
    run_test_scenario("What if we build a bridge here?")
    
    # Test 2: Policy
    run_test_scenario("What if traffic reduces by 20%?")
    
    # Test 3: Growth (Bad scenario)
    run_test_scenario("What if traffic increases by 50%?")

    # Test 4: Station sensitivity (Maninagar - usually less sensitive due to size)
    run_test_scenario("What if traffic reduces by 20%?", station_id="maninagar", density=2000)
