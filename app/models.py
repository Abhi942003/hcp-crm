from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base
import datetime

class Interaction(Base):
    __tablename__ = "interactions"
    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String(255))
    hcp_specialty = Column(String(255))
    interaction_date = Column(DateTime, default=datetime.datetime.utcnow)
    channel = Column(String(50))
    products_discussed = Column(String(500))
    topics = Column(Text)
    sentiment = Column(String(20))
    materials_shared = Column(String(500))
    follow_up = Column(Text)
    raw_notes = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)