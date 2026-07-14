from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class Node(Base):
    __tablename__ = "nodes"

    id = Column(Integer, primary_key=True, index=True)
    cluster_id = Column(Integer, ForeignKey("clusters.id", ondelete="CASCADE"), nullable=False)
    hostname = Column(String, index=True, nullable=False)
    ip_address = Column(String, nullable=True)
    architecture = Column(String, nullable=True)
    operating_system = Column(String, nullable=True)
    status = Column(String, default="offline")
    cpu_cores = Column(Integer, default=0)
    memory_total = Column(Float, default=0.0)
    storage_total = Column(Float, default=0.0)
    docker_version = Column(String, nullable=True)
    kubelet_version = Column(String, nullable=True)
    last_seen = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    cluster = relationship("Cluster", back_populates="nodes")
