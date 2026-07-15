# HCP CRM - AI-First CRM System

A pharma CRM for logging Healthcare Professional interactions.

## Tech Stack
- Frontend: React + Redux
- Backend: Python + FastAPI
- AI Agent: LangGraph
- LLM: Groq (llama-3.3-70b-versatile)
- Database: PostgreSQL (Neon)

## LangGraph Tools
1. log_interaction - Logs HCP interaction from free text
2. edit_interaction - Edits existing interaction
3. get_hcp_history - Gets past interactions for an HCP
4. search_hcp - Searches HCPs by name or specialty
5. schedule_followup - Sets follow-up actions

## Note on Model
Task specified gemma2-9b-it but it was decommissioned by Groq.
Used llama-3.3-70b-versatile as official replacement.

## Setup

### Backend
1. cd backend
2. python -m venv venv
3. venv\Scripts\activate
4. pip install -r requirements.txt
5. Create .env with DATABASE_URL and GROQ_API_KEY
6. cd app
7. python create_tables.py
8. python -m uvicorn main:app --reload

### Frontend
1. cd frontend
2. npm install
3. npm start

## Access
- Frontend: http://localhost:3000
- API Docs: http://127.0.0.1:8000/docs
