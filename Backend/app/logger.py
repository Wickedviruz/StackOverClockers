import os
import logging
from logging.handlers import RotatingFileHandler

def create_logger():
    """
    Logger to log both to CLI of server and log file

    Possilbe states : DEBUG, INFO, WARNING, ERROR, CRITICAL
    """
    logger = logging.getLogger("Backend")
    logger.setLevel(logging.DEBUG)

    if logger.hasHandlers():
        return logger

    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )

    # Console logging
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)

    # File-logger
    log_dir = "logs"
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)
    file_handler = RotatingFileHandler (
        f'{log_dir}/app.log', maxBytes=5 * 1024 * 1024, backupCount=3)
    file_handler.setFormatter(formatter)

    logger.addHandler(console_handler)
    logger.addHandler(file_handler)

    return logger

logger = create_logger()