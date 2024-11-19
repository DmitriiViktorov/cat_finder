from pydantic import BaseModel


class MarkerCreate(BaseModel):
    latitude: float
    longitude: float
    comment: str


class MarkerResponse(BaseModel):
    id: int
    latitude: float
    longitude: float
    comment: str

    class Config:
        from_attributes = True