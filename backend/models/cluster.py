from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class Cluster(Base):
    __tablename__ = "clusters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    cluster_type = Column(String, default="kubernetes") # k3s, microk8s, kubernetes
    status = Column(String, default="offline")
    version = Column(String, nullable=True)
    api_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    nodes = relationship("Node", back_populates="cluster", cascade="all, delete-orphan")
