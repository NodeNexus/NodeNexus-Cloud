import logging
from config import get_settings

def get_logger(name: str) -> logging.Logger:
    settings = get_settings()
    logger = logging.getLogger(name)
    if not logger.handlers:
        logger.setLevel(settings.log_level)
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
    return logger
