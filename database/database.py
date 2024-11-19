from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()
engine = create_engine('sqlite:///database.db')
SessionLocal = sessionmaker(bind=engine)
#
# async def init_db():
#     Base.metadata.create_all(bind=engine)