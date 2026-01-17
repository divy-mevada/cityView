import json
import re

def parse_what_if_scenario(llm_client, sentence):
    """
    Extracts structured parameters from a natural language What-If scenario.
    Expected fields:
    - action: "reduce", "increase", "add_infrastructure"
    - magnitude_percent: e.g. 20 (for 20%)
    - location: e.g. "bopal", "all"
    - duration_months: e.g. 6 (implied or stated)
    """

    system_prompt = (
        "You are an AI expert in urban traffic analytics. "
        "Extract structured data from the user's 'What-If' scenario. "
        "Return strictly valid JSON with keys: 'action', 'magnitude_percent' (number), 'location', 'duration_months' (number). "
        "Default duration_months to 6 if not specified. "
        "For 'bridge', action is 'add_infrastructure', magnitude_percent is -15 (traffic diversion)."
    )

    user_prompt = f"""
    Scenario: "{sentence}"
    
    Output JSON:
    """

    # If llm_client is None (for testing without API), use regex heuristic
    if llm_client is None:
        return _heuristic_fallback(sentence)

    try:
        response = llm_client.chat(
            system=system_prompt,
            user=user_prompt
        )
        # Handle case where LLM returns markdown code block
        clean_response = response.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_response)
    except Exception as e:
        print(f"LLM Parse Error: {e}, falling back to heuristic.")
        return _heuristic_fallback(sentence)


def _heuristic_fallback(sentence):
    """
    Simple rule-based fallback for testing or when LLM fails.
    """
    sentence = sentence.lower()
    data = {
        "action": "unknown",
        "magnitude_percent": 0.0,
        "location": "all",
        "duration_months": 6
    }

    # Location extraction (simple match against known stations or default to "all")
    # In a real app, pass the list of stations to check against
    
    # Magnitude
    percent_match = re.search(r"(\d+)%", sentence)
    if percent_match:
        data["magnitude_percent"] = float(percent_match.group(1))

    # Action & Logic
    # Action & Logic
    if "bridge" in sentence:
        data["action"] = "add_infrastructure"
        data["magnitude_percent"] = 15.0 # Implicit 15% reduction
    elif "metro" in sentence:
        data["action"] = "add_infrastructure" 
        data["magnitude_percent"] = 25.0
    elif "reduce" in sentence or "decrease" in sentence:
        data["action"] = "reduce"
        # magnitude is positive in the text (reduce by 20%), but logic handles sign later
    elif "increase" in sentence:
        data["action"] = "increase"

    return data
