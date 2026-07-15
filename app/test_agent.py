import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from agent.graph import run_agent

response = run_agent(
    "I met Dr. Priya Sharma today, a cardiologist. We discussed the new "
    "hypertension drug CardioMax. She seemed positive and wants a follow-up "
    "call next week with more clinical trial data."
)
print(response)
