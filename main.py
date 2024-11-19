from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request, Response, Depends
import uvicorn
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from starlette.staticfiles import StaticFiles
from schemas.schemas import MarkerResponse
from service.marker_crud import *
from database.database import SessionLocal, Base, engine



async def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

Base.metadata.create_all(bind=engine)
app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/markers/", response_model=list[MarkerResponse])
async def get_markers(db: Session = Depends(get_db)):
    markers = get_all_markers(db)
    return markers

@app.post("/markers/", response_model=MarkerResponse)
async def create_marker(marker: MarkerCreate, db: Session = Depends(get_db)):
    marker = add_new_marker(marker, db)
    return marker



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)