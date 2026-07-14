from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime
from datetime import datetime, timezone
from database import Base

class EdgeDevice(Base):
    __tablename__ = "edge_devices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    device_type = Column(String, nullable=False) # ESP32, Raspberry Pi, Jetson, Linux PC
    ip_address = Column(String, nullable=True)
    status = Column(String, default="offline")
    mqtt_status = Column(String, default="disconnected")
    cpu_usage = Column(Float, default=0.0)
    memory_usage = Column(Float, default=0.0)
    temperature = Column(Float, default=0.0)
    ota_version = Column(String, nullable=True)
    last_seen = Column(DateTime, default=lambda: datetime.now(timezone.utc))
