import json
from datetime import datetime

from sqlalchemy.orm import Session

from database.models import  Marker
from fastapi.encoders import jsonable_encoder

from schemas.schemas import MarkerResponse, MarkerCreate


def add_new_marker(marker: MarkerCreate, db: Session) -> MarkerResponse:
    db_marker = Marker(**marker.model_dump())

    db.add(db_marker)
    db.commit()
    db.refresh(db_marker)

    return MarkerResponse.model_validate(db_marker)

def get_all_markers(db: Session):
    all_markers = db.query(Marker).all()
    return all_markers