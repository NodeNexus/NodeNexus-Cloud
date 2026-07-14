from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class SettingsModel(Base):
    __tablename__ = "settings"
    
    id = Column(Integer, primary_key=True, index=True)
    hostname = Column(String, default="vnav-pi")
    update_channel = Column(String, default="stable")
    enable_ssh = Column(Boolean, default=False)
