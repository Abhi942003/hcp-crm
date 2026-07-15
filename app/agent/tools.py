from langchain_core.tools import tool
from database import SessionLocal
from models import Interaction
from agent.llm import llm
import json
import sys
import os

# allow importing from parent 'app' folder
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


@tool
def log_interaction(raw_text: str) -> str:
    """Extract structured HCP interaction data from free text (e.g. a rep's chat message)
    and save it as a new interaction record in the database."""
    prompt = f"""Extract the following fields as a JSON object from this field rep's note.
Fields: hcp_name, hcp_specialty, channel, products_discussed, topics, sentiment, materials_shared, follow_up.
If a field is not mentioned, use an empty string.
Sentiment must be one of: positive, neutral, negative.
Return ONLY valid JSON, no extra text, no markdown formatting.

Note: {raw_text}"""

    result = llm.invoke(prompt).content
    result = result.strip().replace("```json", "").replace("```", "")
    data = json.loads(result)

    db = SessionLocal()
    record = Interaction(
        hcp_name=data.get("hcp_name", ""),
        hcp_specialty=data.get("hcp_specialty", ""),
        channel=data.get("channel", ""),
        products_discussed=data.get("products_discussed", ""),
        topics=data.get("topics", ""),
        sentiment=data.get("sentiment", ""),
        materials_shared=data.get("materials_shared", ""),
        follow_up=data.get("follow_up", ""),
        raw_notes=raw_text,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    interaction_id = record.id
    db.close()

    return f"Logged interaction #{interaction_id} with HCP '{data.get('hcp_name')}'. Sentiment: {data.get('sentiment')}."


@tool
def edit_interaction(interaction_id: int, change_request: str) -> str:
    """Modify an existing logged interaction based on a natural language change request.
    For example: 'change the sentiment to positive' or 'update the follow up to schedule a call next week'."""
    db = SessionLocal()
    record = db.query(Interaction).filter(Interaction.id == interaction_id).first()
    if not record:
        db.close()
        return f"No interaction found with ID {interaction_id}."

    current_data = {
        "hcp_name": record.hcp_name,
        "hcp_specialty": record.hcp_specialty,
        "channel": record.channel,
        "products_discussed": record.products_discussed,
        "topics": record.topics,
        "sentiment": record.sentiment,
        "materials_shared": record.materials_shared,
        "follow_up": record.follow_up,
    }

    prompt = f"""Current interaction record: {json.dumps(current_data)}
Change request: "{change_request}"
Return ONLY a JSON object containing the fields that should be updated, with their new values.
Only include fields that actually need to change."""

    result = llm.invoke(prompt).content
    result = result.strip().replace("```json", "").replace("```", "")
    updates = json.loads(result)

    for key, value in updates.items():
        if hasattr(record, key):
            setattr(record, key, value)

    db.commit()
    db.close()
    return f"Interaction #{interaction_id} updated: {updates}"


@tool
def get_hcp_history(hcp_name: str) -> str:
    """Retrieve past logged interactions for a given HCP by name, to give context before a visit."""
    db = SessionLocal()
    records = (
        db.query(Interaction)
        .filter(Interaction.hcp_name.ilike(f"%{hcp_name}%"))
        .order_by(Interaction.interaction_date.desc())
        .all()
    )
    db.close()

    if not records:
        return f"No past interactions found for '{hcp_name}'."

    summary = "\n".join(
        [f"- {r.interaction_date}: {r.topics} (sentiment: {r.sentiment})" for r in records]
    )
    return f"Found {len(records)} past interaction(s) with {hcp_name}:\n{summary}"


@tool
def search_hcp(query: str) -> str:
    """Search for HCPs in the system by name or specialty."""
    db = SessionLocal()
    records = (
        db.query(Interaction)
        .filter(
            (Interaction.hcp_name.ilike(f"%{query}%"))
            | (Interaction.hcp_specialty.ilike(f"%{query}%"))
        )
        .all()
    )
    db.close()

    names = sorted(set([r.hcp_name for r in records if r.hcp_name]))
    if not names:
        return f"No HCPs found matching '{query}'."
    return f"Matching HCPs: {', '.join(names)}"


@tool
def schedule_followup(interaction_id: int, followup_note: str) -> str:
    """Set or update a follow-up action/reminder for a specific logged interaction."""
    db = SessionLocal()
    record = db.query(Interaction).filter(Interaction.id == interaction_id).first()
    if not record:
        db.close()
        return f"No interaction found with ID {interaction_id}."

    record.follow_up = followup_note
    db.commit()
    db.close()
    return f"Follow-up set for interaction #{interaction_id}: {followup_note}"