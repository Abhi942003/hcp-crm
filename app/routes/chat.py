from fastapi import APIRouter
from pydantic import BaseModel
from agent.graph import run_agent

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
def chat(req: ChatRequest):
    reply = run_agent(req.message)
    return {"reply": reply}