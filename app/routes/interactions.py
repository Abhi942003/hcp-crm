from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from database import SessionLocal
from models import Interaction

router = APIRouter()

class InteractionCreate(BaseModel):
    hcp_name: str
    hcp_specialty: Optional[str] = ""
    channel: Optional[str] = ""
    products_discussed: Optional[str] = ""
    topics: Optional[str] = ""
    sentiment: Optional[str] = ""
    materials_shared: Optional[str] = ""
    follow_up: Optional[str] = ""

@router.get("/interactions")
def list_interactions():
    db = SessionLocal()
    records = db.query(Interaction).order_by(Interaction.interaction_date.desc()).all()
    db.close()
    return [
        {
            "id": r.id,
            "hcp_name": r.hcp_name,
            "hcp_specialty": r.hcp_specialty,
            "channel": r.channel,
            "products_discussed": r.products_discussed,
            "topics": r.topics,
            "sentiment": r.sentiment,
            "materials_shared": r.materials_shared,
            "follow_up": r.follow_up,
            "interaction_date": str(r.interaction_date),
        }
        for r in records
    ]

@router.post("/interactions")
def create_interaction(payload: InteractionCreate):
    db = SessionLocal()
    record = Interaction(**payload.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    db.close()
    return {"id": record.id, "message": "Interaction logged successfully"}

@router.get("/interactions/{interaction_id}")
def get_interaction(interaction_id: int):
    db = SessionLocal()
    record = db.query(Interaction).filter(Interaction.id == interaction_id).first()
    db.close()
    if not record:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return {
        "id": record.id,
        "hcp_name": record.hcp_name,
        "hcp_specialty": record.hcp_specialty,
        "channel": record.channel,
        "products_discussed": record.products_discussed,
        "topics": record.topics,
        "sentiment": record.sentiment,
        "materials_shared": record.materials_shared,
        "follow_up": record.follow_up,
    }