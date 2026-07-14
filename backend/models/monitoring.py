from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class AlertRule(Base):
    __tablename__ = "alert_rules"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    metric = Column(String, nullable=False) # cpu, memory, storage
    condition = Column(String, nullable=False) # >, <, ==
    threshold = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    rule_id = Column(Integer, ForeignKey("alert_rules.id", ondelete="SET NULL"), nullable=True)
    message = Column(String, nullable=False)
    severity = Column(String, default="warning") # warning, critical
    is_resolved = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    rule = relationship("AlertRule")

class NotificationChannel(Base):
    __tablename__ = "notification_channels"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False) # discord, slack, telegram, email
    name = Column(String, nullable=False)
    webhook_url = Column(String, nullable=True)
    config = Column(Text, nullable=True) # JSON config
    is_active = Column(Boolean, default=True)
