import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from langgraph.prebuilt import create_react_agent
from agent.llm import llm
from agent.tools import (
    log_interaction,
    edit_interaction,
    get_hcp_history,
    search_hcp,
    schedule_followup,
)

tools = [log_interaction, edit_interaction, get_hcp_history, search_hcp, schedule_followup]

SYSTEM_PROMPT = """You are an AI assistant embedded in a pharma CRM, helping field
representatives log and manage their interactions with Healthcare Professionals (HCPs).

You have access to tools to log interactions, edit them, look up HCP history,
search for HCPs, and schedule follow-ups. Use the right tool based on what the
user asks. Always confirm what action you took in a short, clear sentence."""

agent = create_react_agent(llm, tools, prompt=SYSTEM_PROMPT)


def run_agent(user_message: str):
    result = agent.invoke({"messages": [{"role": "user", "content": user_message}]})
    final_message = result["messages"][-1]
    return final_message.content