from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime

from .database import Base


class Marker(Base):
    __tablename__ = 'markers'
    id = Column(Integer, primary_key=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    # timestamp = Column(DateTime, default=datetime.now())
    comment = Column(String, nullable=False)


"""
    - user_id (связанный пользователь или null для анонимных)
    - status (статус метки)
    - photos (массив фотографий)
    - comments (связь с комментариями)
"""