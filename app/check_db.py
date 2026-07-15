from database import SessionLocal
from models import Interaction

db = SessionLocal()
records = db.query(Interaction).all()
db.close()

for r in records:
    print(f"ID: {r.id} | HCP: {r.hcp_name} | Sentiment: {r.sentiment} | Topics: {r.topics}")